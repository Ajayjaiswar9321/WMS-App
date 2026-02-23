import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'light' | 'dark' | 'color';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", variant = 'color' }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect x="10" y="10" width="80" height="80" rx="24" className="fill-emerald-600" fillOpacity={variant === 'dark' ? 0 : 1} />
            {/* Abstract C shape for Comprint */}
            <path
                d="M65 35H45C39.4772 35 35 39.4772 35 45V55C35 60.5228 39.4772 65 45 65H65"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
                className={variant === 'light' ? 'stroke-current' : 'stroke-white'}
            />
            {/* Tech/Check dot */}
            <circle cx="65" cy="45" r="6" fill="white" className={variant === 'light' ? 'fill-current' : 'fill-white'} />
        </svg>
    );
};

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
            className="fill-emerald-600"
        />
        <path
            d="M15 9H11C9.89543 9 9 9.89543 9 11V13C9 14.1046 9.89543 15 11 15H15"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
        <circle cx="15" cy="11" r="1.5" fill="white" />
    </svg>
);
