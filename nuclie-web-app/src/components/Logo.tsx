import React from 'react';

interface LogoProps {
    className?: string;
    showName?: boolean;
}

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
                <linearGradient id="nucliePrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="nuclieSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
            </defs>
            {/* Glowing Geometric Core */}
            <path d="M12 2L2 7L2 17L12 22L22 17L22 7L12 2Z" stroke="url(#nucliePrimary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#nucliePrimary)" fillOpacity="0.1" />
                    <path d="M12 22L12 12L22 7" stroke="url(#nucliePrimary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12L2 7" stroke="url(#nucliePrimary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Inner Crystal */}
                    <polygon points="12,12 15,10.2 15,13.8" fill="url(#nuclieSecondary)" opacity="0.8" />
                    <polygon points="12,12 9,13.8 9,10.2" fill="url(#nuclieSecondary)" opacity="0.8" />
                    <polygon points="12,12 15,13.8 12,15.5 9,13.8" fill="url(#nucliePrimary)" opacity="0.9" />
                    <polygon points="12,12 9,10.2 12,8.5 15,10.2" fill="url(#nucliePrimary)" opacity="0.9" />
                </svg>
                );
};

                export const Logo: React.FC<LogoProps> = ({className = "w-8 h-8", showName = true}) => {
    return (
                    <div className={`flex items-center gap-2 ${className}`}>
                        <LogoIcon className="w-8 h-8 drop-shadow-md" />
                        {showName && (
                            <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                                NUCLIE
                            </span>
                        )}
                    </div>
                    );
};

