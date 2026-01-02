/**
 * Access Denied Component
 * Displayed when user lacks permission to access a resource
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent } from '@/src/components/ui/common/Card';
import { AccessDeniedProps } from '@/src/types/rbac.types';

export const AccessDenied: React.FC<AccessDeniedProps> = ({
    resource,
    action,
    onGoBack
}) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        } else {
            navigate(-1);
        }
    };

    const handleGoHome = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <Card className="max-w-md w-full">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-red-600" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>

                        {/* Message */}
                        <p className="text-slate-600">
                            {resource && action
                                ? `You don't have permission to ${action} ${resource}.`
                                : "You don't have permission to access this resource."}
                        </p>

                        {/* Help Text */}
                        <p className="text-sm text-slate-500">
                            If you believe this is an error, please contact your administrator.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                            <Button
                                variant="outline"
                                onClick={handleGoBack}
                                className="flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go Back
                            </Button>
                            <Button
                                onClick={handleGoHome}
                                className="flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Dashboard
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
