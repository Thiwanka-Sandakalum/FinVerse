
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { OrganizationsService } from '@/src/api/users';
import { usePermission } from '@/src/hooks/usePermission';
import { UserRole } from '@/src/types/rbac.types';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent } from '@/src/components/ui/common/Card';
import { Input } from '@/src/components/ui/common/Input';
import { Select } from '@/src/components/ui/common/Select';
import { useToast } from '@/src/components/ui/common/Toast';
import { Skeleton } from '@/src/components/ui/common/Loading';

const OrgForm: React.FC = () => {
    const navigate = useNavigate();
    const { orgId } = useParams<{ orgId?: string }>();
    const location = useLocation();
    const { showToast } = useToast();
    const { orgId: userOrgId, userRole } = usePermission();
    const isEdit = Boolean(orgId) && location.pathname.endsWith('/edit');

    // Permission check: OrgAdmin can only edit their own organization
    useEffect(() => {
        if (isEdit && orgId && userRole === UserRole.ORG_ADMIN && orgId !== userOrgId) {
            showToast('You can only edit your own organization', 'error');
            navigate('/organization');
        }
    }, [orgId, userRole, userOrgId, isEdit, navigate, showToast]);

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            display_name: '',
            type: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            address: '',
            branches: '',
            year: '',
            status: 'active',
        }
    });

    useEffect(() => {
        if (isEdit && orgId) {
            fetchOrganization();
        }
    }, [orgId, isEdit]);

    const fetchOrganization = async () => {
        try {
            setLoading(true);
            const response = await OrganizationsService.getOrganization(orgId!);
            const data = response.data || response;
            const org = data.organization || data;

            reset({
                name: org.name || '',
                display_name: org.display_name || '',
                type: org.metadata?.type || '',
                email: org.metadata?.contactEmail || '',
                phone: org.metadata?.contactPhone || '',
                country: org.metadata?.country || '',
                city: org.metadata?.city || '',
                address: org.metadata?.address || '',
                branches: org.metadata?.branches?.toString() || '',
                year: org.metadata?.yearEstablished?.toString() || '',
                status: org.metadata?.status || 'active',
            });
        } catch (error) {
            console.error('Failed to fetch organization:', error);
            showToast('Failed to load organization', 'error');
            navigate('/organizations');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (formData: any) => {
        try {
            setSubmitting(true);

            const requestBody = {
                name: formData.name,
                display_name: formData.display_name || formData.name,
                metadata: {
                    type: formData.type,
                    contactEmail: formData.email,
                    contactPhone: formData.phone,
                    country: formData.country,
                    city: formData.city,
                    address: formData.address,
                    branches: formData.branches ? parseInt(formData.branches) : 0,
                    yearEstablished: formData.year ? parseInt(formData.year) : undefined,
                    status: formData.status,
                }
            };

            if (isEdit && orgId) {
                await OrganizationsService.updateOrganization(orgId, {
                    display_name: requestBody.display_name,
                    metadata: requestBody.metadata,
                });
                showToast('Organization updated successfully', 'success');
                navigate(`/organizations/${orgId}`);
            } else {
                const response = await OrganizationsService.createOrganization(requestBody);
                const data = response.data || response;
                const newOrgId = data.organization?.id || data.id;
                showToast('Organization created successfully', 'success');
                navigate(newOrgId ? `/organizations/${newOrgId}` : '/organizations');
            }
        } catch (error: any) {
            console.error('Failed to save organization:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to save organization',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton width="80px" height="36px" className="rounded-md" />
                    <div className="space-y-2">
                        <Skeleton width="200px" height="28px" />
                        <Skeleton width="300px" height="16px" />
                    </div>
                </div>
                <Card>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array.from({ length: 12 }).map((_, idx) => (
                                <div key={idx} className="space-y-2">
                                    <Skeleton width="120px" height="14px" />
                                    <Skeleton width="100%" height="40px" className="rounded-md" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <Skeleton width="100px" height="40px" className="rounded-md" />
                            <Skeleton width="140px" height="40px" className="rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Organization' : 'Create Organization'}</h1>
                    <p className="text-slate-500">{isEdit ? 'Update organization details.' : 'Onboard a new financial partner.'}</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-8 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Organization Name (Unique ID)"
                                {...register('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                                helperText="Unique identifier for the organization"
                                disabled={isEdit}
                            />
                            <Input
                                label="Display Name"
                                {...register('display_name')}
                                error={errors.display_name?.message}
                                helperText="Public facing name"
                            />
                            <Select
                                label="Organization Type"
                                {...register('type', { required: 'Type is required' })}
                                options={[
                                    { label: 'Select Type', value: '' },
                                    { label: 'Commercial Bank', value: 'bank' },
                                    { label: 'Microfinance', value: 'micro' },
                                    { label: 'Fintech', value: 'fintech' },
                                    { label: 'Leasing Company', value: 'lease' }
                                ]}
                                error={errors.type?.message}
                            />
                            <Input
                                label="Year Established"
                                type="number"
                                {...register('year')}
                            />
                            <Input
                                label="Official Email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                error={errors.email?.message}
                            />
                            <Input
                                label="Phone Number"
                                {...register('phone')}
                            />
                            <Input
                                label="Country"
                                {...register('country')}
                            />
                            <Input
                                label="City"
                                {...register('city')}
                            />
                            <Input
                                label="Registered Address"
                                {...register('address')}
                                className="md:col-span-2"
                            />
                            <Input
                                label="Branch Count"
                                type="number"
                                {...register('branches')}
                            />
                            <Select
                                label="Status"
                                {...register('status')}
                                options={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Suspended', value: 'suspended' }
                                ]}
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                                loading={submitting}
                            >
                                {isEdit ? 'Save Changes' : 'Create Organization'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrgForm;
