import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UsersService, RolesService, InvitationsService } from '@/src/api/users';
import { usePermission } from '@/src/hooks/usePermission';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@/src/components/ui/common/Toast';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent } from '@/src/components/ui/common/Card';
import { Input } from '@/src/components/ui/common/Input';
import { Select } from '@/src/components/ui/common/Select';
import { Skeleton, FullPageLoader } from '@/src/components/ui/common/Loading';

const UserForm: React.FC = () => {
    const { userId } = useParams<{ userId?: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { orgId } = usePermission();
    const { user: auth0User } = useAuth0();

    const isEdit = !!userId;

    // State management
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [roles, setRoles] = useState<any[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: '',
            email: '',
            role: '',
        }
    });

    // Fetch user data on edit mode
    useEffect(() => {
        if (isEdit && userId) {
            fetchUser(userId);
        } else {
            setLoading(false);
        }
        fetchRoles();
    }, [userId, isEdit]);

    const fetchUser = async (id: string) => {
        try {
            setLoading(true);
            const response: any = await UsersService.getUserById(id);
            const data = response.data || response;
            const userData = data.user || data;
            setUser(userData);
            // Populate form with user data
            setValue('name', userData.name || '');
            setValue('email', userData.email || '');
            setValue('role', userData.role || '');
        } catch (error) {
            console.error('Failed to fetch user:', error);
            showToast('Failed to load user', 'error');
            navigate('/users');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            setRolesLoading(true);
            const response = await RolesService.listRoles(undefined, 0, 50);
            const data = response.data || response;
            const rolesList = data.items || [];
            setRoles(rolesList);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            setRoles([]);
        } finally {
            setRolesLoading(false);
        }
    };

    const onSubmit = async (formData: any) => {
        try {
            setSubmitting(true);

            if (isEdit && userId) {
                // Update user - only name can be updated
                const response = await UsersService.updateUser(userId, {
                    user_id: userId,
                    name: formData.name,
                    email: user?.email || formData.email,
                });
                console.log('User updated:', response);
                showToast('User updated successfully', 'success');
                setTimeout(() => navigate(`/users/${userId}`), 500);
            } else {
                // Create new user via invitation
                const response = await InvitationsService.createOrganizationInvitation(
                    orgId!,
                    {
                        inviter: {
                            name: auth0User?.name || 'Admin'
                        },
                        invitee: {
                            email: formData.email
                        },
                        roles: formData.role ? [formData.role] : ['member']
                    }
                );
                console.log('Invitation sent:', response);
                showToast('User invitation sent successfully', 'success');
                setTimeout(() => navigate('/users'), 500);
            }
        } catch (error: any) {
            console.error('Failed to save user:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to save user',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton width="150px" height="36px" className="rounded-md" />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="200px" height="28px" />
                        <Skeleton width="300px" height="16px" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-6">
                            <div>
                                <Skeleton width="100px" height="16px" className="mb-2" />
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                            </div>
                            <div>
                                <Skeleton width="100px" height="16px" className="mb-2" />
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                            </div>
                            <div>
                                <Skeleton width="100px" height="16px" className="mb-2" />
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Skeleton width="80px" height="40px" className="rounded-md" />
                            <Skeleton width="120px" height="40px" className="rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isEdit ? navigate(`/users/${userId}`) : navigate('/users')}
                    disabled={submitting}
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit User' : 'Create User'}
                    </h1>
                    <p className="text-slate-500">
                        {isEdit ? 'Update user account details and role.' : 'Add a new user to the system.'}
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="p-8 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                                disabled={submitting}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format'
                                    }
                                })}
                                disabled={isEdit || submitting}
                                className={isEdit ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}
                                error={errors.email?.message}
                            />

                            <div>
                                <label className="text-sm font-medium leading-none text-slate-700 mb-2 block">
                                    Role
                                </label>
                                {rolesLoading ? (
                                    <Skeleton width="100%" height="40px" className="rounded-md" />
                                ) : (
                                    <Select
                                        {...register('role')}
                                        disabled={submitting}
                                        options={roles.map(role => ({
                                            label: role.name || role.id || 'N/A',
                                            value: role.id || role.name || ''
                                        }))}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => isEdit ? navigate(`/users/${userId}`) : navigate('/users')}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                loading={submitting}
                            >
                                {isEdit ? 'Save Changes' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {submitting && <FullPageLoader message="Processing..." />}
        </div>
    );
};

export default UserForm;