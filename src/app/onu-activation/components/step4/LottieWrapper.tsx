import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

interface LottieWrapperProps {
    src: string;
    lottieError: boolean;
    className?: string;
}

export function LottieWrapper({ src, lottieError, className }: LottieWrapperProps) {
    if (lottieError) {
        return (
            <div className={`flex items-center justify-center ${className || 'h-32 w-32'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    try {
        return (
            <DotLottieReact
                src={src}
                loop
                autoplay
                renderConfig={{ autoResize: true }}
            />
        );
    } catch {
        return (
            <div className={`flex items-center justify-center ${className || 'h-32 w-32'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
} 