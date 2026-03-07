import React from 'react';

interface LogoProps {
    className?: string;
    showName?: boolean;
}

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
                <linearGradient id="urjaPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="urjaSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
            </defs>
            {/* The 'U' Shape */}
            <path d="M5 4V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V4" stroke="url(#urjaPrimary)" strokeWidth="3" strokeLinecap="round" />
            {/* The Energy Bolt intersecting */}
            <path d="M14 2L9 11H14L10 22" stroke="url(#urjaSecondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", showName = true }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <LogoIcon className="w-8 h-8 drop-shadow-md" />
            {showName && (
                <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                    URJA
                </span>
            )}
        </div>
    );
};

