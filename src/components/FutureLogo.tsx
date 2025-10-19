import React from 'react';

interface FutureLogoProps {
    className?: string;
    size?: number;
    color?: string;
}

export const FutureLogo: React.FC<FutureLogoProps> = ({
                                                          className = '',
                                                          size = 24,
                                                          color = 'rgb(59, 130, 246)' // デフォルトは青色
                                                      }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g transform="translate(0,500) scale(0.1,-0.1)">
                <path
                    d="M1922 3655 l-384 -765 -569 0 -569 0 -195 -390 -195 -390 570 0 570 0 -380 -760 c-209 -418 -380 -761 -380 -763 0 -1 260 -3 578 -2 l577 0 383 763 382 762 768 0 767 0 193 379 c105 209 192 384 192 390 0 8 -225 11 -765 11 l-765 0 187 375 188 375 770 2 770 3 192 380 c105 209 192 383 192 388 1 4 -605 7 -1347 7 l-1347 0 -383 -765z"
                    fill={color}
                    stroke="none"
                />
            </g>
        </svg>
    );
};

export default FutureLogo;