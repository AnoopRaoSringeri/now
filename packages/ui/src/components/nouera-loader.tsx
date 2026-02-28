export const NoueraLoader = () => {
    return (
        <>
            <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="70" x2="90" y2="70" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <path
                    className="animate-aurora-rise [stroke-dasharray:200]"
                    d="M30 70V30L70 70V30"
                    stroke="#818cf8"
                    strokeWidth="10"
                    strokeLinecap="butt"
                    fill="none"
                />
                <defs>
                    <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
                <rect x="10" y="70" width="80" height="20" fill="url(#auroraGrad)" opacity="0.3" />
            </svg>
        </>
    );
};
