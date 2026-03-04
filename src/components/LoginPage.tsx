import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { signIn, signUp } = useAuth();
    const [showSignup, setShowSignup] = React.useState(false);
    const [loginError, setLoginError] = React.useState('');
    const [signupError, setSignupError] = React.useState('');
    const [signupSuccess, setSignupSuccess] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError('');
        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string).trim();
        const password = formData.get('password') as string;

        if (!email) {
            setLoginError('Please enter your email.');
            return;
        }
        if (!password) {
            setLoginError('Please enter your password.');
            return;
        }

        setIsLoading(true);
        const { error } = await signIn(email, password);
        setIsLoading(false);

        if (error) {
            setLoginError(error.message);
        }
        // Auth state change handled by AuthContext → App will redirect automatically
    };

    const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignupError('');
        setSignupSuccess('');
        const formData = new FormData(e.currentTarget);
        const email = (formData.get('signupEmail') as string).trim();
        const password = formData.get('signupPassword') as string;

        if (!email) {
            setSignupError('Please enter your email.');
            return;
        }
        if (!password || password.length < 6) {
            setSignupError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        const { error } = await signUp(email, password);
        setIsLoading(false);

        if (error) {
            setSignupError(error.message);
        } else {
            setSignupSuccess('Account created! You can now sign in.');
            setTimeout(() => {
                setShowSignup(false);
                setSignupSuccess('');
            }, 2000);
        }
    };

    return (
        <div className="login-bg">
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="login-container">
                <div className="glass-panel login-panel slide-up">
                    <div className="logo-container">
                        <div className="logo-icon">✨</div>
                        <h1>Style Draft</h1>
                        <p className="subtitle">AI-Assisted Smart Outfit Designer</p>
                    </div>

                    {/* Login Form */}
                    {!showSignup && (
                        <form className="login-form" onSubmit={handleLoginSubmit}>
                            {loginError && (
                                <div className="auth-error">{loginError}</div>
                            )}
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input type="checkbox" defaultChecked />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>

                            <button type="submit" className="primary-btn glow-effect" disabled={isLoading}>
                                <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                                {!isLoading && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                )}
                            </button>
                            <div className="signup-prompt">
                                <p>New to Style Draft? <a onClick={(e) => { e.preventDefault(); setShowSignup(true); setLoginError(''); }}>Create an account</a></p>
                            </div>
                        </form>
                    )}

                    {/* Signup Form */}
                    {showSignup && (
                        <form className="login-form slide-up" onSubmit={handleSignupSubmit}>
                            {signupError && (
                                <div className="auth-error">{signupError}</div>
                            )}
                            {signupSuccess && (
                                <div className="auth-success">{signupSuccess}</div>
                            )}
                            <div className="input-group">
                                <label htmlFor="signupEmail">Email</label>
                                <input
                                    type="email"
                                    id="signupEmail"
                                    name="signupEmail"
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="signupPassword">Create Password</label>
                                <input
                                    type="password"
                                    id="signupPassword"
                                    name="signupPassword"
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button type="submit" className="primary-btn glow-effect" disabled={isLoading} style={{ marginTop: '1rem' }}>
                                <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                                {!isLoading && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line x1="20" y1="8" x2="20" y2="14"></line>
                                        <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                )}
                            </button>
                            <div className="signup-prompt">
                                <p>Already have an account? <a onClick={(e) => { e.preventDefault(); setShowSignup(false); setSignupError(''); setSignupSuccess(''); }}>Sign in here</a></p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
