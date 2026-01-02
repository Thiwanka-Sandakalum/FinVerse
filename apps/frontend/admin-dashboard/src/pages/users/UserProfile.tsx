import React, { useState, useEffect } from 'react';
import { History, ArrowLeft, Mail, Shield, Key, Badge, Lock, Unlock, Trash2, Pencil, Check, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { UsersService } from '@/src/api/users';
import { useToast } from '@/src/components/ui/common/Toast';
import { Avatar } from '@/src/components/ui/common/Avatar';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/common/Card';
import { Skeleton, FullPageLoader } from '@/src/components/ui/common/Loading';
import { Modal } from '@/src/components/ui/common/Modal';
import { Input } from '@/src/components/ui/common/Input';
import { MOCK_USER_ACTIVITIES } from '../../../constants';

const UserProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // State management
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId]);

    const fetchUser = async (id: string) => {
        try {
            setLoading(true);
            const response: any = await UsersService.getUserById(id);
            const data = response.data || response;
            const userData = data.user || data;
            setUser(userData);
            setEditedName(userData.name || '');
            setIsSuspended(false);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            showToast('Failed to load user', 'error');
            navigate('/users');
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendToggle = async () => {
        if (!userId || !user) return;
        try {
            setSubmitting(true);
            // Note: Email-based API doesn't support suspension
            // This would need a different endpoint if implemented
            showToast('Suspension not supported in current API', 'warning');
            setIsSuspended(!isSuspended);
        } catch (error: any) {
            console.error('Failed to update user status:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to update user',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!userId) return;
        try {
            setSubmitting(true);
            const response = await UsersService.deleteUser(userId);
            console.log('User deleted:', response);
            showToast('User deleted successfully', 'success');
            setTimeout(() => navigate('/users'), 800);
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to delete user',
                'error'
            );
        } finally {
            setSubmitting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleSaveName = async () => {
        if (!userId || !editedName.trim()) {
            showToast('Name cannot be empty', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            const response = await UsersService.updateUser(userId, {
                user_id: user.user_id,
                name: editedName.trim(),
                email: user.email,
            });
            console.log('User name updated:', response);
            setUser({ ...user, name: editedName.trim() });
            setIsEditingName(false);
            showToast('User name updated successfully', 'success');
        } catch (error: any) {
            console.error('Failed to update user name:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to update user name',
                'error'
            );
            // Reset to original name on error
            setEditedName(user.name || '');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedName(user.name || '');
        setIsEditingName(false);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <Skeleton width="150px" height="36px" className="rounded-md" />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Skeleton width="120px" height="120px" className="rounded-lg" />
                        <div className="flex-1 space-y-3 w-full">
                            <div className="flex gap-3">
                                <Skeleton width="200px" height="28px" />
                                <Skeleton width="80px" height="28px" className="rounded-full" />
                            </div>
                            <Skeleton width="300px" height="16px" />
                            <div className="flex gap-3">
                                <Skeleton width="100px" height="40px" className="rounded-md" />
                                <Skeleton width="100px" height="40px" className="rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Skeleton width="100%" height="200px" className="rounded-lg" />
                    <Skeleton width="100%" height="200px" className="rounded-lg" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">User not found</p>
                <Button variant="primary" onClick={() => navigate('/users')} className="mt-4">
                    Back to Users
                </Button>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Users
                </Button>
            </div>

            {/* Header Banner */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar initials={user.name?.charAt(0) || 'U'} size="xl" className="border-4 border-slate-50" />
                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
                        {isEditingName ? (
                            <div className="flex gap-2 items-center w-full md:w-auto">
                                <Input
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    placeholder="Enter user name"
                                    disabled={submitting}
                                    className="text-2xl font-bold h-10"
                                />
                                <button
                                    onClick={handleSaveName}
                                    disabled={submitting}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                    title="Save"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={submitting}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Cancel"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-slate-900">{user.name || 'N/A'}</h1>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    disabled={submitting}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                    title="Rename user"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        <Badge variant={isSuspended ? 'warning' : 'success'}>
                            {isSuspended ? 'Suspended' : 'Active'}
                        </Badge>
                    </div>
                    <div className="text-sm text-slate-500 flex flex-col md:flex-row gap-4 items-center md:items-start">
                        <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email || 'N/A'}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isSuspended ? 'success' : 'outline'}
                        onClick={handleSuspendToggle}
                        disabled={submitting}
                        loading={submitting}
                        leftIcon={isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    >
                        {isSuspended ? 'Reactivate' : 'Suspend'}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={submitting}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                                <p className="text-sm font-bold text-slate-900 truncate">{user.email || 'N/A'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-xs text-slate-500 uppercase font-semibold">User ID</p>
                                <p className="text-sm font-bold text-slate-900 font-mono truncate">{user.user_id?.split('|')[1] || user.user_id || 'N/A'}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {MOCK_USER_ACTIVITIES && MOCK_USER_ACTIVITIES.length > 0 ? (
                                    MOCK_USER_ACTIVITIES.slice(0, 3).map(log => (
                                        <div key={log.id} className="flex gap-4">
                                            <div className="mt-1"><History className="w-4 h-4 text-slate-400" /></div>
                                            <div className="pb-4 border-b border-slate-100 last:border-0 w-full">
                                                <p className="text-sm text-slate-900 font-medium">{log.action}</p>
                                                <p className="text-xs text-slate-500">{log.details}</p>
                                                <p className="text-xs text-slate-400 mt-1">{log.timestamp}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No recent activity found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-700">Status</span>
                                </div>
                                <Badge variant={isSuspended ? 'warning' : 'success'}>
                                    {isSuspended ? 'Suspended' : 'Active'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-700">Provider</span>
                                </div>
                                <span className="text-sm font-medium">{user.user_id?.split('|')[0] || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
                        <CardContent className="text-xs text-slate-500 space-y-2">
                            <div className="flex justify-between">
                                <span>Created</span>
                                <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Email Verified</span>
                                <span className="font-medium">{user.email_verified ? 'Yes' : 'No'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <Modal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    title="Delete User"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-slate-600">
                            Are you sure you want to delete <strong>"{user.name}"</strong>?
                        </p>
                        <p className="text-sm text-slate-500">
                            This action cannot be undone. The user account will be permanently removed.
                        </p>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={submitting}
                                loading={submitting}
                            >
                                Delete User
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Loading Overlay */}
            {submitting && <FullPageLoader message="Processing..." />}
        </div>
    );

};


export default UserProfile;