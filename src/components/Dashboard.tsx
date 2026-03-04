import React from 'react';
import { DesignForm } from './DesignForm';
import { RecommendationCard } from './RecommendationCard';
import { TrendingSidebar } from './TrendingSidebar';
import { UserInputs, DesignRecommendation, SavedDesign } from '../types';
import { generateRecommendations } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface DashboardProps {
    username: string;
    onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ username }) => {
    const { user, signOut } = useAuth();
    const [recommendations, setRecommendations] = React.useState<DesignRecommendation[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [savedDesigns, setSavedDesigns] = React.useState<SavedDesign[]>([]);
    const [currentInputs, setCurrentInputs] = React.useState<UserInputs | null>(null);
    const [activeView, setActiveView] = React.useState<'suggestions' | 'saved'>('suggestions');
    const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
    const [showSettingsModal, setShowSettingsModal] = React.useState(false);
    const [showImageModal, setShowImageModal] = React.useState(false);
    const [modalImage, setModalImage] = React.useState({ src: '', title: '' });
    const [settingsSuccess, setSettingsSuccess] = React.useState(false);
    const [isSavingDesigns, setIsSavingDesigns] = React.useState(false);

    const profileRef = React.useRef<HTMLDivElement>(null);

    // Load saved designs from Supabase on mount
    React.useEffect(() => {
        if (!user) return;
        const fetchDesigns = async () => {
            const { data, error } = await supabase
                .from('saved_designs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Failed to load saved designs:', error);
                return;
            }

            if (data) {
                const designs: SavedDesign[] = data.map((row: any) => ({
                    id: row.id,
                    title: row.title,
                    description: row.description || '',
                    neckDesign: row.neck_design || undefined,
                    sleevePattern: row.sleeve_pattern || undefined,
                    garmentCut: row.garment_cut,
                    layoutStyle: row.layout_style,
                    trendingNotes: row.trending_notes || '',
                    svgLayout: row.svg_layout || '',
                    imageUrl: row.image_url || undefined,
                    inputs: {
                        fabricType: row.fabric_type || '',
                        color: row.color || '',
                        materialLength: row.material_length || '',
                        bodyType: row.body_type || '',
                        height: row.height || '',
                        occasion: row.occasion || '',
                        outfitType: row.outfit_type || 'complete',
                    },
                    createdAt: new Date(row.created_at).getTime(),
                }));
                setSavedDesigns(designs);
            }
        };
        fetchDesigns();
    }, [user]);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDesignSubmit = async (inputs: UserInputs) => {
        setIsLoading(true);
        setCurrentInputs(inputs);
        setActiveView('suggestions');
        try {
            const results = await generateRecommendations(inputs);
            setRecommendations(results);
        } catch (error) {
            console.error('Failed to generate designs:', error);
            alert('Something went wrong. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (rec: DesignRecommendation) => {
        if (!currentInputs || !user) return;

        const isAlreadySaved = savedDesigns.some(d => d.id === rec.id);

        if (isAlreadySaved) {
            // Delete from Supabase
            setIsSavingDesigns(true);
            const { error } = await supabase
                .from('saved_designs')
                .delete()
                .eq('id', rec.id);

            if (error) {
                console.error('Failed to delete design:', error);
            } else {
                setSavedDesigns(prev => prev.filter(d => d.id !== rec.id));
            }
            setIsSavingDesigns(false);
            return;
        }

        // Insert into Supabase
        setIsSavingDesigns(true);
        const { data, error } = await supabase
            .from('saved_designs')
            .insert({
                user_id: user.id,
                title: rec.title,
                description: rec.description,
                neck_design: rec.neckDesign || null,
                sleeve_pattern: rec.sleevePattern || null,
                garment_cut: rec.garmentCut,
                layout_style: rec.layoutStyle,
                trending_notes: rec.trendingNotes,
                svg_layout: rec.svgLayout,
                image_url: rec.imageUrl || null,
                fabric_type: currentInputs.fabricType,
                color: currentInputs.color,
                material_length: currentInputs.materialLength,
                body_type: currentInputs.bodyType,
                height: currentInputs.height,
                occasion: currentInputs.occasion,
                outfit_type: currentInputs.outfitType,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to save design:', error);
        } else if (data) {
            const newSaved: SavedDesign = {
                id: data.id,
                title: data.title,
                description: data.description || '',
                neckDesign: data.neck_design || undefined,
                sleevePattern: data.sleeve_pattern || undefined,
                garmentCut: data.garment_cut,
                layoutStyle: data.layout_style,
                trendingNotes: data.trending_notes || '',
                svgLayout: data.svg_layout || '',
                imageUrl: data.image_url || undefined,
                inputs: currentInputs,
                createdAt: new Date(data.created_at).getTime(),
            };
            setSavedDesigns(prev => [newSaved, ...prev]);
        }
        setIsSavingDesigns(false);
    };

    const handleTrendClick = (img: string, title: string) => {
        setModalImage({ src: img, title });
        setShowImageModal(true);
    };

    const [settingsError, setSettingsError] = React.useState<string | null>(null);

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsError(null);
        setSettingsSuccess(false);

        const form = e.target as HTMLFormElement;
        const passwordInput = form.elements.namedItem('updatePassword') as HTMLInputElement;
        const newPassword = passwordInput.value;

        if (!newPassword) {
            setSettingsError('Please enter a new password.');
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setSettingsError(error.message);
        } else {
            setSettingsSuccess(true);
            passwordInput.value = ''; // clear the input
            setTimeout(() => {
                setSettingsSuccess(false);
                setShowSettingsModal(false);
            }, 1500);
        }
    };

    const handleLogout = async () => {
        await signOut();
    };

    const avatarLetter = username ? username.charAt(0).toUpperCase() : 'U';

    return (
        <div className="dashboard-bg">
            <div className="background-orbs dashboard-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="glass-navbar">
                <div className="nav-brand">
                    <span className="logo-icon-small">✨</span>
                    <span className="brand-name">Style Draft</span>
                </div>
                <div className="nav-links">
                    <a href="#" className="active">Designer</a>
                </div>
                <div className="user-profile" ref={profileRef}>
                    <div
                        className="avatar"
                        onClick={(e) => { e.stopPropagation(); setShowProfileDropdown(!showProfileDropdown); }}
                    >
                        {avatarLetter}
                    </div>
                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{username}</span>
                                {user?.email && (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>{user.email}</span>
                                )}
                            </div>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setShowSettingsModal(true); }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                                Profile Settings
                            </button>
                            <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setActiveView('saved'); }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                                My Saved Designs
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Dashboard Layout */}
            <main className="dashboard-layout">
                {/* Design Form Panel */}
                <DesignForm onSubmit={handleDesignSubmit} isLoading={isLoading} />

                {/* Results Panel */}
                <section className="results-panel slide-up delay-1">
                    <div className="glass-panel main-view">
                        <div className="results-header">
                            <h2>AI Suggestions</h2>
                            <div className="view-toggles">
                                <button
                                    className={`toggle-btn ${activeView === 'suggestions' ? 'active' : ''}`}
                                    onClick={() => setActiveView('suggestions')}
                                >
                                    Ideas &amp; Concepts
                                </button>
                                <button
                                    className={`toggle-btn ${activeView === 'saved' ? 'active' : ''}`}
                                    onClick={() => setActiveView('saved')}
                                >
                                    Saved Concepts
                                </button>
                            </div>
                        </div>

                        <div className="canvas-area">
                            {activeView === 'suggestions' && (
                                <>
                                    {isLoading ? (
                                        <div className="loading-state">
                                            <div className="loader-ring"></div>
                                            <p>Analyzing style trends and body profile...</p>
                                            <div className="progress-bar">
                                                <div className="progress-fill"></div>
                                            </div>
                                        </div>
                                    ) : recommendations.length > 0 ? (
                                        <div className="draft-gallery">
                                            {recommendations.map((rec) => (
                                                <RecommendationCard
                                                    key={rec.id}
                                                    recommendation={rec}
                                                    onSave={handleSave}
                                                    isSaved={savedDesigns.some(d => d.title === rec.title && d.description === rec.description)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-icon">✨</div>
                                            <h3>Ready to Create</h3>
                                            <p>Fill out the parameters and generate your custom smart outfits.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeView === 'saved' && (
                                <>
                                    {savedDesigns.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-icon">🔖</div>
                                            <h3>No Saved Concepts Yet</h3>
                                            <p>Go back to Ideas & Concepts and save your favorite designs to see them here.</p>
                                        </div>
                                    ) : (
                                        <div className="draft-gallery">
                                            {savedDesigns.map((design) => (
                                                <div key={design.id} className="design-card slide-up">
                                                    <div className="design-card-img">
                                                        {design.imageUrl && <img src={design.imageUrl} alt={design.title} />}
                                                    </div>
                                                    <div className="design-card-content">
                                                        <h4>{design.title}</h4>
                                                        <p>{design.description}</p>
                                                        <button
                                                            className="download-btn"
                                                            onClick={() => {
                                                                if (design.imageUrl) {
                                                                    const a = document.createElement('a');
                                                                    a.href = design.imageUrl;
                                                                    a.download = design.title.replace(/\s+/g, '_').toLowerCase() + '.png';
                                                                    document.body.appendChild(a);
                                                                    a.click();
                                                                    document.body.removeChild(a);
                                                                }
                                                            }}
                                                        >
                                                            <span className="icon">⬇️</span> Download Image
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Trending Sidebar */}
                <TrendingSidebar onTrendClick={handleTrendClick} />
            </main>

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSettingsModal(false); }}>
                    <div className="modal-content glass-panel slide-up">
                        <div className="modal-header">
                            <h2>Profile Settings</h2>
                            <button className="icon-btn close-modal" onClick={() => setShowSettingsModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <form className="settings-form" onSubmit={handleSettingsSubmit}>
                            {settingsError && (
                                <div className="auth-error">{settingsError}</div>
                            )}
                            {settingsSuccess && (
                                <div className="auth-success">Profile successfully updated.</div>
                            )}

                            <div className="input-group">
                                <label htmlFor="updateEmail">Email</label>
                                <input type="email" id="updateEmail" name="updateEmail" defaultValue={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                            </div>

                            <div className="input-group">
                                <label htmlFor="updatePassword">New Password</label>
                                <input type="password" id="updatePassword" name="updatePassword" placeholder="Leave blank to keep current password" />
                            </div>

                            <button type="submit" className="primary-btn glow-effect" style={{ marginTop: '1rem' }}>
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {showImageModal && (
                <div
                    className="modal-overlay"
                    style={{ zIndex: 1000, alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowImageModal(false); }}
                >
                    <div className="modal-content glass-panel slide-up image-modal-content">
                        <div className="modal-header" style={{ borderBottom: 'none', justifyContent: 'flex-end', paddingBottom: 0 }}>
                            <button className="icon-btn close-modal" onClick={() => setShowImageModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>{modalImage.title}</h3>
                        <div className="image-modal-img-wrapper">
                            <img src={modalImage.src} alt={modalImage.title} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
