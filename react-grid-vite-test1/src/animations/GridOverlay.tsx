import React from 'react';

type GridOverlayProps = { children: React.ReactNode; color: string };

const GridOverlay = ({ children, color }: GridOverlayProps) => {
    const gridWipeAnimationKeyframes = `
        @keyframes gridWipeAnimation {
            0% {
                width: 0px;
                height: 0px;
            }
            100% {
                width: 100%;
                height: 100%;
            }
        }
    `;

    return (
        <div
            style={{
                animation: 'gridWipeAnimation 1s linear',
                zIndex: -1,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                content: '""',
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                                  linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                                  linear-gradient(${color} 2px, transparent 2px),
                                  linear-gradient(90deg, ${color} 2px, transparent 2px),
                                  linear-gradient(${color} 2px, transparent 2px),
                                  linear-gradient(90deg, ${color} 2px, transparent 2px)`,
                backgroundSize: '100px 40px, 63px 100px, 100px 40px, 63px 100px, 100px 160px, 381px 100px, 100px 160px, 381px 100px',
                backgroundPosition: '10px 10px, 17px 0px, 10px 39px, 136px 0px, 10px 10px, 10px 0px, 10px 159px, 379px 0px'
            }}
        >
            {children}
            <style>{gridWipeAnimationKeyframes}</style>
        </div>
    );
};

export default GridOverlay;
