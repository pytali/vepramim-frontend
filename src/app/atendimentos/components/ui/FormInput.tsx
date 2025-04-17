import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    touched?: boolean;
    label?: string;
}

export default function FormInput({ error, touched, label, className = '', ...props }: FormInputProps) {
    const baseClasses = "w-full px-4 py-3 bg-gray-900/5 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out placeholder:text-gray-500";
    const validationClasses = touched
        ? error
            ? "ring-2 ring-red-500/50 bg-red-500/5"
            : "ring-2 ring-green-500/50 bg-green-500/5"
        : "hover:bg-gray-900/10";

    return (
        <div className="w-full space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`${baseClasses} ${validationClasses} ${className}`}
                    {...props}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
            {touched && error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
} 