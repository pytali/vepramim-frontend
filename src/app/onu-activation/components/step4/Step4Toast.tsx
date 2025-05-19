import { Check, AlertTriangle } from "lucide-react";
import React from "react";

interface Step4ToastProps {
    toastMessage: string | null;
    toastType: 'success' | 'error';
}

export function Step4Toast({ toastMessage, toastType }: Step4ToastProps) {
    if (!toastMessage) return null;
    return (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg z-50 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <div className="flex items-center gap-2">
                {toastType === 'success' ? (
                    <Check className="h-5 w-5" />
                ) : (
                    <AlertTriangle className="h-5 w-5" />
                )}
                {toastMessage}
            </div>
        </div>
    );
} 