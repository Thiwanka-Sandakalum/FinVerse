import React from 'react';
import { cn } from './cn';

export const Stepper: React.FC<{ steps: string[]; currentStep: number; className?: string }> = ({ steps, currentStep, className }) => {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <React.Fragment key={step}>
                            {/* Line Connector */}
                            {index > 0 && (
                                <div className={cn("flex-1 h-0.5 mx-4 transition-colors", isCompleted ? "bg-indigo-600" : "bg-slate-200")} />
                            )}

                            {/* Step Circle & Label */}
                            <div className="flex flex-col items-center relative">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors z-10",
                                    isCompleted ? "bg-indigo-600 border-indigo-600 text-white" :
                                        isCurrent ? "bg-white border-indigo-600 text-indigo-600" :
                                            "bg-white border-slate-200 text-slate-400"
                                )}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={cn(
                                    "absolute -bottom-6 text-xs font-medium whitespace-nowrap",
                                    isCurrent ? "text-indigo-600" : "text-slate-500"
                                )}>
                                    {step}
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
