import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { Copy, LogOut, Shield, User, Calendar, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/common/Card';
import { useToast } from '@/src/components/ui/common/Toast';
import { Avatar } from '@/src/components/ui/common/Avatar';
import { Badge } from '@/src/components/ui/common/Badge';
import { Skeleton } from '@/src/components/ui/common/Loading';
import { Modal } from '@/src/components/ui/common/Modal';
import { usePermission } from '@/src/hooks/usePermission';
import { UserRole } from '@/src/types/rbac.types';
import OrgProfile from './organizations/OrgProfile';

export const Settings: React.FC = () => {
    const { user, logout, isLoading } = useAuth0();
    const { showToast } = useToast();
    const { userRole, orgId } = usePermission();
    const [activeTab, setActiveTab] = useState('profile');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showOrgPanel, setShowOrgPanel] = useState(false);

    const isOrgAdmin = userRole === UserRole.ORG_ADMIN;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        showToast(`${label} copied to clipboard`, 'success');
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    if (isLoading) {
        return (
            <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                    <p className="text-slate-500">Manage account settings and preferences.</p>
                </div>
                <Card>
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            <Skeleton height={40} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-slate-600">Unable to load user settings</p>
            </div>
        );
    }

    const emailVerified = user.email_verified || false;
    const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Unknown';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account settings and security preferences.</p>
            </div>

            {/* Tabs */}
            <div className="w-full">
                <div className="flex border-b border-slate-200 bg-transparent p-0 mb-6 gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`rounded-none border-b-2 px-6 py-2 focus:outline-none transition-colors ${activeTab === 'profile'
                            ? 'border-indigo-600 text-indigo-600 bg-transparent shadow-none'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Profile
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className={`rounded-none border-b-2 px-6 py-2 focus:outline-none transition-colors ${activeTab === 'security'
                            ? 'border-indigo-600 text-indigo-600 bg-transparent shadow-none'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Security
                        </div>
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* User Avatar & Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-6">
                                    <div className="flex-shrink-0">
                                        <Avatar
                                            src={user.picture}
                                            alt={user.name}
                                            size="lg"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Full Name</p>
                                            <p className="text-lg font-semibold text-slate-900">{user.name || 'Not set'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Email Address</p>
                                            <div className="flex items-center gap-3">
                                                <p className="text-lg font-semibold text-slate-900">{user.email || 'Not set'}</p>
                                                <button
                                                    onClick={() => copyToClipboard(user.email || '', 'Email')}
                                                    className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${copiedField === 'Email' ? 'text-green-600' : 'text-slate-400'}`}
                                                    title="Copy email"
                                                >
                                                    {copiedField === 'Email' ? (
                                                        <CheckCircle className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Email Verification */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            {emailVerified ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900">Email Verification</p>
                                                <p className="text-sm text-slate-500">
                                                    {emailVerified ? 'Your email is verified' : 'Email not verified'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={emailVerified ? 'success' : 'warning'}>
                                            {emailVerified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                    </div>

                                    {/* Account Creation Date */}
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900">Member Since</p>
                                            <p className="text-sm text-slate-500">{createdAt}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User ID */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Identifier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-500">Auth0 User ID</p>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs break-all">
                                        <span className="text-slate-600">{user.sub}</span>
                                        <button
                                            onClick={() => copyToClipboard(user.sub || '', 'User ID')}
                                            className={`ml-auto p-1.5 rounded hover:bg-slate-100 transition-colors flex-shrink-0 ${copiedField === 'User ID' ? 'text-green-600' : 'text-slate-400'}`}
                                            title="Copy User ID"
                                        >
                                            {copiedField === 'User ID' ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organization Button for OrgAdmin */}
                        {isOrgAdmin && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 mb-4">
                                        View and manage your organization details
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowOrgPanel(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        View Organization
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        {/* Auth0 Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Authentication</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-indigo-900">Secure Authentication</p>
                                                <p className="text-sm text-indigo-700 mt-1">
                                                    Your account is protected by Auth0 enterprise-grade security. Password changes and security updates can be managed through your Auth0 account settings.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-sm font-medium text-slate-900 mb-3">Authentication Provider</p>
                                        <p className="text-sm text-slate-600">Auth0 (Enterprise SSO)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Session Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Sign out from this device. You can sign in again anytime with your credentials.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Side Panel for Organization */}
            {showOrgPanel && isOrgAdmin && orgId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex">
                    <div className="ml-auto w-full max-w-4xl bg-white overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-slate-900">Organization Management</h2>
                            <button
                                onClick={() => setShowOrgPanel(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <OrgProfile />
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                title="Sign Out"
                message="Are you sure you want to sign out? You'll need to sign in again to access your account."
                actions={[
                    {
                        label: 'Cancel',
                        onClick: () => setShowLogoutConfirm(false),
                        variant: 'outline'
                    },
                    {
                        label: 'Sign Out',
                        onClick: handleLogout,
                        variant: 'danger'
                    }
                ]}
            />
        </div>
    );
};
