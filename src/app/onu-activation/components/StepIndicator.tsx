import { Check } from "lucide-react";
import { StepIndicatorProps } from "../types";

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-1000 ease-in-out transform
                            ${currentStep > index + 1
                                ? "bg-green-500 text-white font-bold shadow-md scale-105"
                                : currentStep === index + 1
                                    ? "bg-blue-600 text-white font-bold shadow-md scale-105"
                                    : "bg-slate-600 text-white shadow-md"}`}
                    >
                        {currentStep > index + 1 ? (
                            <Check className="h-6 w-6 transition-all duration-1000 ease-in-out" />
                        ) : (
                            <span className="text-lg transition-all duration-1000 ease-in-out">{index + 1}</span>
                        )}
                    </div>
                    {index < totalSteps - 1 && (
                        <div
                            className={`w-16 h-1.5 transition-all duration-1000 ease-in-out ${currentStep > index + 1
                                ? "bg-green-500"
                                : currentStep === index + 1 && index + 2 <= totalSteps
                                    ? "bg-blue-300"
                                    : "bg-slate-600"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
} 