import React from 'react';

interface LoadingSkeletonProps {
    count: number;
    type: 'featured' | 'grid';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count, type }) => {
    if (type === 'featured') {
        return (
            <>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="min-w-[300px] md:min-w-[340px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-20 bg-gray-100 rounded-lg mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </>
        );
    }

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-12 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-gray-100 rounded-lg mb-4"></div>
                    <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-20 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </>
    );
};
