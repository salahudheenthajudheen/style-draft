import React from 'react';

const TREND_ITEMS = [
    { img: '/img/trends/trend_aline_maxi.png', title: 'A-Line Maxi' },
    { img: '/img/trends/trend_bishop.png', title: 'Bishop Sleeves' },
    { img: '/img/trends/trend_plunge.png', title: 'Plunge V-Neck' },
    { img: '/img/trends/trend_tiered.png', title: 'Tiered Ruffle Skirt' },
    { img: '/img/trends/trend_asymmetric.png', title: 'Asymmetric Drape' },
    { img: '/img/trends/trend_empire.png', title: 'Empire Waist Dress' },
    { img: '/img/trends/trend_mermaid.png', title: 'Mermaid Gown' },
    { img: '/img/trends/trend_shift.png', title: 'Shift Dress' },
    { img: '/img/trends/trend_peplum.png', title: 'Peplum Top' },
    { img: '/img/trends/trend_wideleg.png', title: 'Wide-Leg Trousers' },
    { img: '/img/trends/trend_halter.png', title: 'Halter Neckline' },
    { img: '/img/trends/trend_wrap.png', title: 'Wrap Dress' },
    { img: '/img/trends/trend_offshoulder.png', title: 'Off-Shoulder Blouse' },
    { img: '/img/trends/trend_slip.png', title: 'Slip Dress' },
    { img: '/img/trends/trend_pleated.png', title: 'Pleated Midi' },
    { img: '/img/trends/trend_highlow.png', title: 'High-Low Hem' },
    { img: '/img/trends/trend_corset.png', title: 'Corset Bodice' },
    { img: '/img/trends/trend_cowl.png', title: 'Cowl Neckline' },
    { img: '/img/trends/trend_palazzo.png', title: 'Palazzo Pants' },
    { img: '/img/trends/trend_bell.png', title: 'Bell Sleeves' },
    { img: '/img/trends/trend_keyhole.png', title: 'Keyhole Cutout' },
];

const INITIAL_LIMIT = 15;

interface TrendingSidebarProps {
    onTrendClick: (img: string, title: string) => void;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ onTrendClick }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const visibleItems = isExpanded ? TREND_ITEMS : TREND_ITEMS.slice(0, INITIAL_LIMIT);

    return (
        <aside className="glass-panel trending-panel slide-left delay-2">
            <h3>Trending Layouts</h3>
            <p className="subtitle-small">Based on Occasion</p>

            <div className="trending-list">
                {visibleItems.map((item, index) => (
                    <div
                        key={item.title}
                        className="trend-item"
                        onClick={() => onTrendClick(item.img, item.title)}
                        style={index >= INITIAL_LIMIT ? { animation: 'slideUpFade 0.3s forwards' } : undefined}
                    >
                        <div className="trend-info">
                            <h4>{item.title}</h4>
                        </div>
                    </div>
                ))}

                {TREND_ITEMS.length > INITIAL_LIMIT && (
                    <button
                        className="view-more-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <span>{isExpanded ? 'View Less' : 'View More'}</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={isExpanded ? { transform: 'rotate(180deg)', transition: 'transform 0.3s' } : { transition: 'transform 0.3s' }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </aside>
    );
};
