import React from 'react';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [showSignup, setShowSignup] = React.useState(false);
    const [loginError, setLoginError] = React.useState('');
    const [signupError, setSignupError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError('');
        const formData = new FormData(e.currentTarget);
        const username = formData.get('email') as string;

        if (!username) {
            setLoginError('Please enter a username.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            onLogin(username);
        }, 800);
    };

    const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignupError('');
        const formData = new FormData(e.currentTarget);
        const username = formData.get('signupUsername') as string;

        if (!username) {
            setSignupError('Please enter a username.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            onLogin(username);
        }, 800);
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
                                <label htmlFor="email">Username</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="off"
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
                                <p>New to Style Draft? <a onClick={(e) => { e.preventDefault(); setShowSignup(true); }}>Create an account</a></p>
                            </div>
                        </form>
                    )}

                    {/* Signup Form */}
                    {showSignup && (
                        <form className="login-form slide-up" onSubmit={handleSignupSubmit}>
                            {signupError && (
                                <div className="auth-error">{signupError}</div>
                            )}
                            <div className="input-group">
                                <label htmlFor="signupUsername">Choose Username</label>
                                <input
                                    type="text"
                                    id="signupUsername"
                                    name="signupUsername"
                                    placeholder="Enter a unique username"
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="signupPassword">Create Password</label>
                                <input
                                    type="password"
                                    id="signupPassword"
                                    name="signupPassword"
                                    placeholder="Enter your password"
                                    required
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
                                <p>Already have an account? <a onClick={(e) => { e.preventDefault(); setShowSignup(false); }}>Sign in here</a></p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
