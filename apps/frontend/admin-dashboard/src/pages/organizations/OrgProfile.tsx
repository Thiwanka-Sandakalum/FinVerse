
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Globe, Edit2, Mail, Phone, Building, CreditCard, Activity, Users as UsersIcon, ArrowLeft, Badge, Trash2, Lock, Unlock, ExternalLink } from 'lucide-react';
import { OrganizationsService, MembersService, InvitationsService } from '@/src/api/users';
import { usePermission } from '@/src/hooks/usePermission';
import { UserRole } from '@/src/types/rbac.types';
import { MOCK_ACTIVITIES } from '../../../constants';
import { Button } from '@/src/components/ui/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/common/Card';
import { Tabs } from '@/src/components/ui/common/Tabs';
import { useToast } from '@/src/components/ui/common/Toast';
import { Skeleton, FullPageLoader } from '@/src/components/ui/common/Loading';
import { Modal } from '@/src/components/ui/common/Modal';

const OrgProfile: React.FC = () => {
    const navigate = useNavigate();
    const { orgId: paramOrgId } = useParams<{ orgId: string }>();
    const { orgId: contextOrgId, userRole } = usePermission();
    const { showToast } = useToast();

    // Use orgId from URL params if available, otherwise use from auth context
    const orgId = paramOrgId || contextOrgId;
    const isStandalone = !paramOrgId; // True when used from sidebar (no URL param)

    // OrgAdmin can only edit their own org (when accessed via sidebar)
    // SuperAdmin can edit any org (when accessed via organizations directory)
    const canEdit = userRole === UserRole.SUPER_ADMIN || !isStandalone === false;
    const canDelete = userRole === UserRole.SUPER_ADMIN || !isStandalone === false;

    const [organization, setOrganization] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSuspended, setIsSuspended] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [invitationsLoading, setInvitationsLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRoles, setInviteRoles] = useState<string[]>(['member']);

    useEffect(() => {
        if (orgId) {
            fetchOrganization();
        }
    }, [orgId]);

    const fetchOrganization = async () => {
        try {
            setLoading(true);
            const response = await OrganizationsService.getOrganization(orgId!);
            const data = response.data || response;
            const org = data.organization || data;
            setOrganization(org);
            setIsSuspended(org.metadata?.status === 'suspended');
            // Fetch members and invitations for this organization
            fetchOrgMembers(orgId!);
            fetchOrgInvitations(orgId!);
        } catch (error) {
            console.error('Failed to fetch organization:', error);
            showToast('Failed to load organization', 'error');
            navigate('/organizations');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrgMembers = async (orgId: string) => {
        try {
            setMembersLoading(true);
            const response = await MembersService.getOrganizationMembers(orgId, undefined);
            const data = response.data || response;
            const membersList = data.items || [];
            setMembers(membersList);
        } catch (error) {
            console.error('Failed to fetch organization members:', error);
            setMembers([]);
        } finally {
            setMembersLoading(false);
        }
    };

    const fetchOrgInvitations = async (orgId: string) => {
        try {
            setInvitationsLoading(true);
            const response = await InvitationsService.listOrganizationInvitations(orgId, undefined, 0, 10);
            const data = response.data || response;
            const invitationsList = data.items || [];
            setInvitations(invitationsList);
        } catch (error) {
            console.error('Failed to fetch organization invitations:', error);
            setInvitations([]);
        } finally {
            setInvitationsLoading(false);
        }
    };

    const handleSendInvitation = async () => {
        if (!orgId || !inviteEmail.trim()) {
            showToast('Please enter an email address', 'warning');
            return;
        }
        try {
            setSubmitting(true);
            const response = await InvitationsService.createOrganizationInvitation(orgId, {
                inviter: {
                    name: 'Admin',
                },
                invitee: {
                    email: inviteEmail.trim(),
                },
                roles: inviteRoles,
            });
            console.log('Invitation created:', response);
            showToast(`Invitation sent to ${inviteEmail}`, 'success');
            setInviteEmail('');
            setInviteRoles(['member']);
            setShowInviteModal(false);
            // Refresh invitations list
            fetchOrgInvitations(orgId);
        } catch (error: any) {
            console.error('Failed to send invitation:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to send invitation',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteInvitation = async (invitationId: string) => {
        if (!orgId) return;
        try {
            setSubmitting(true);
            await InvitationsService.deleteOrganizationInvitation(orgId, invitationId);
            showToast('Invitation cancelled', 'success');
            fetchOrgInvitations(orgId);
        } catch (error: any) {
            console.error('Failed to delete invitation:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to cancel invitation',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        console.log('Initiating delete for organization:', orgId);
        if (!orgId) return;
        try {
            setSubmitting(true);
            console.log('Deleting organization:', orgId);
            const response = await OrganizationsService.deleteOrganization(orgId);
            console.log('Delete response:', response);

            // Handle different response structures
            const data = response.data || response;
            const success = data.success !== false; // If no success field, assume success

            if (success) {
                showToast('Organization deleted successfully', 'success');
                // Navigate after a short delay to let toast show
                setTimeout(() => {
                    navigate('/organizations');
                }, 800);
            } else {
                showToast('Failed to delete organization', 'error');
            }
        } catch (error: any) {
            console.error('Failed to delete organization:', error);
            console.error('Error details:', {
                message: error?.message,
                body: error?.body,
                status: error?.status,
                response: error?.response,
            });
            showToast(
                error?.body?.error || error?.body?.message || error?.message || 'Failed to delete organization',
                'error'
            );
        } finally {
            setSubmitting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleSuspendToggle = async () => {
        if (!orgId || !organization) return;
        try {
            setSubmitting(true);
            const newStatus = isSuspended ? 'active' : 'suspended';
            console.log('Updating organization status to:', newStatus);
            const response = await OrganizationsService.updateOrganization(orgId, {
                metadata: {
                    ...organization.metadata,
                    status: newStatus,
                },
            });
            console.log('Update response:', response);

            setIsSuspended(!isSuspended);
            showToast(
                isSuspended ? 'Organization reactivated successfully' : 'Organization suspended successfully',
                'success'
            );
            // Refresh organization data
            fetchOrganization();
        } catch (error: any) {
            console.error('Failed to update organization status:', error);
            console.error('Error details:', {
                message: error?.message,
                body: error?.body,
                status: error?.status,
            });
            showToast(
                error?.body?.error || error?.body?.message || error?.message || 'Failed to update organization',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Back button skeleton */}
                <div className="flex items-center gap-4 mb-2">
                    <Skeleton width="150px" height="36px" className="rounded-md" />
                </div>

                {/* Header Banner Skeleton */}
                <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                    <Skeleton height="128px" className="rounded-none" />
                    <div className="px-8 pb-8 flex flex-col md:flex-row items-start md:items-end -mt-10 gap-6">
                        <Skeleton width="96px" height="96px" className="rounded-xl" />
                        <div className="flex-1 pt-2 md:pt-0 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton width="250px" height="32px" />
                                <Skeleton width="80px" height="24px" className="rounded-full" />
                                <Skeleton width="100px" height="24px" className="rounded-full" />
                            </div>
                            <Skeleton width="300px" height="16px" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton width="100px" height="40px" className="rounded-md" />
                            <Skeleton width="130px" height="40px" className="rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Content Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <Card key={idx}>
                                    <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                                        <Skeleton width="24px" height="24px" className="rounded" />
                                        <Skeleton width="60px" height="32px" />
                                        <Skeleton width="80px" height="12px" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Users Table Skeleton */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <Skeleton width="120px" height="24px" />
                                <Skeleton width="80px" height="32px" className="rounded-md" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-3">
                                        <Skeleton width="100%" height="20px" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Activity Log Skeleton */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <Skeleton width="140px" height="24px" />
                                <Skeleton width="80px" height="32px" className="rounded-md" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <Skeleton width="40px" height="40px" className="rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton width="200px" height="16px" />
                                            <Skeleton width="300px" height="14px" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Quick Actions Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton width="150px" height="24px" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                                <Skeleton width="100%" height="40px" className="rounded-md" />
                            </CardContent>
                        </Card>

                        {/* Organization Info Skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton width="200px" height="24px" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Business Details Skeleton */}
                                <div className="space-y-3 pb-6 border-b border-slate-200">
                                    <Skeleton width="120px" height="14px" />
                                    <div className="space-y-3">
                                        <Skeleton width="100%" height="16px" />
                                        <Skeleton width="100%" height="16px" />
                                        <Skeleton width="100%" height="16px" />
                                    </div>
                                </div>

                                {/* Contact Details Skeleton */}
                                <div className="space-y-3 pb-6 border-b border-slate-200">
                                    <Skeleton width="120px" height="14px" />
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <Skeleton width="16px" height="16px" className="rounded" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="60px" height="12px" />
                                                <Skeleton width="100%" height="14px" />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Skeleton width="16px" height="16px" className="rounded" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="60px" height="12px" />
                                                <Skeleton width="100%" height="14px" />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Skeleton width="16px" height="16px" className="rounded" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="60px" height="12px" />
                                                <Skeleton width="100%" height="14px" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata Skeleton */}
                                <div className="space-y-3">
                                    <Skeleton width="120px" height="14px" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                                            <Skeleton width="80px" height="12px" />
                                            <Skeleton width="100%" height="16px" />
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                                            <Skeleton width="80px" height="12px" />
                                            <Skeleton width="100%" height="16px" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">Organization not found</p>
                <Button variant="primary" onClick={() => navigate('/organizations')} className="mt-4">
                    Back to Organizations
                </Button>
            </div>
        );
    }

    const metadata = organization.metadata || {};

    return (
        <div className="space-y-6">
            {paramOrgId && (
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/organizations')}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
                    </Button>
                </div>
            )}

            {/* Header Banner */}
            <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <div
                    className="h-32 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww)',
                    }}
                >
                    <div className="w-full h-full bg-black/30"></div>
                </div>
                <div className="px-8 pb-8 flex flex-col md:flex-row items-start md:items-end -mt-10 gap-6">
                    <div className="w-24 h-24 rounded-xl bg-white p-0 shadow-lg ring-4 ring-white overflow-hidden">
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/business-banking-profile-illustration-svg-download-png-3266035.png"
                            alt={organization.display_name || organization.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%2364748b%22 font-family=%22system-ui%22 font-size=%2240%22 font-weight=%22bold%22%3E' + (organization.display_name || organization.name).charAt(0).toUpperCase() + '%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                    <div className="flex-1 pt-2 md:pt-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900">{organization.display_name || organization.name}</h1>
                            <Badge variant="success">{metadata.industryType || 'Organization'}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">{metadata.description || 'No description available'}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-4 flex-wrap">
                            <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {metadata.country || 'N/A'}
                            </span>
                            <span className="flex items-center">
                                <Globe className="w-3 h-3 mr-1" /> {organization.id}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2 mb-1">
                        <Button
                            variant={isSuspended ? 'success' : 'outline'}
                            onClick={handleSuspendToggle}
                            disabled={submitting}
                            loading={submitting}
                            leftIcon={isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                        </Button>
                        {canEdit && (
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/organizations/${organization.id}/edit`)}
                                disabled={submitting}
                            >
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="danger"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={submitting}
                                leftIcon={<Trash2 className="w-4 h-4" />}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs content */}
            <Tabs className="w-full">

                {/* Mocking the tab selection logic visually for the prompt since Tabs component is simplified */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center">
                                    <UsersIcon className="w-6 h-6 text-indigo-500 mb-2" />
                                    <span className="text-2xl font-bold">{metadata.activeUsers || 0}</span>
                                    <span className="text-xs text-slate-500">Active Users</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center">
                                    <CreditCard className="w-6 h-6 text-green-500 mb-2" />
                                    <span className="text-2xl font-bold">{metadata.activeProducts || 0}</span>
                                    <span className="text-xs text-slate-500">Products</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center">
                                    <Building className="w-6 h-6 text-orange-500 mb-2" />
                                    <span className="text-2xl font-bold">{metadata.branches || 0}</span>
                                    <span className="text-xs text-slate-500">Branches</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex flex-col items-center text-center">
                                    <Activity className="w-6 h-6 text-blue-500 mb-2" />
                                    <span className="text-2xl font-bold">{metadata.uptime || '99.9%'}</span>
                                    <span className="text-xs text-slate-500">Uptime</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Members Table Snippet */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Organization Members</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => navigate('/organizations/' + organization.id + '/members')}>View All</Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {membersLoading ? (
                                    <div className="space-y-3 p-6">
                                        <Skeleton width="100%" height="20px" />
                                        <Skeleton width="100%" height="20px" />
                                        <Skeleton width="100%" height="20px" />
                                    </div>
                                ) : members.length > 0 ? (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Member</th>
                                                <th className="px-6 py-3">Email</th>
                                                <th className="px-6 py-3">User ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {members.slice(0, 3).map(member => (
                                                <tr key={member.user_id}>
                                                    <td className="px-6 py-3 font-medium">
                                                        <div className="flex items-center gap-3">
                                                            {member.picture && (
                                                                <img
                                                                    src={member.picture}
                                                                    alt={member.name}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                            )}
                                                            {member.name || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-slate-500 truncate">{member.email || 'N/A'}</td>
                                                    <td className="px-6 py-3 text-slate-600 text-xs font-mono truncate">{member.user_id?.split('|')[1] || member.user_id || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-6 text-center text-slate-500">
                                        <p className="text-sm">No members found for this organization</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Activity Log Snippet */}
                        <Card>
                            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {MOCK_ACTIVITIES.map(log => (
                                        <div key={log.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-slate-300 my-1"></div>
                                                <div className="w-0.5 h-full bg-slate-100"></div>
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-sm text-slate-900 font-medium">{log.action}</p>
                                                <p className="text-xs text-slate-500">{log.details} by {log.performedBy} &bull; {log.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pending Invitations */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Pending Invitations</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setShowInviteModal(true)}>Send Invite</Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {invitationsLoading ? (
                                    <div className="space-y-3 p-6">
                                        <Skeleton width="100%" height="20px" />
                                        <Skeleton width="100%" height="20px" />
                                        <Skeleton width="100%" height="20px" />
                                    </div>
                                ) : invitations.length > 0 ? (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Email</th>
                                                <th className="px-6 py-3">Roles</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {invitations.slice(0, 3).map(invitation => (
                                                <tr key={invitation.id}>
                                                    <td className="px-6 py-3 font-medium">{invitation.email || invitation.invitee?.email || 'N/A'}</td>
                                                    <td className="px-6 py-3 text-slate-500 text-xs">
                                                        {(invitation.roles || []).join(', ') || 'member'}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <Badge variant="warning" className="scale-90">
                                                            Pending
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteInvitation(invitation.id)}
                                                            disabled={submitting}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-6 text-center text-slate-500">
                                        <p className="text-sm">No pending invitations</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setShowInviteModal(true)}
                                >
                                    <Mail className="w-4 h-4 mr-2" /> Invite Member
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate('/products/create')}
                                >
                                    <CreditCard className="w-4 h-4 mr-2" /> Create Product
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Comprehensive Organization Information */}
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Organization Information</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                {/* Business Details Section */}
                                <div className="space-y-3 pb-6 border-b border-slate-200">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Business Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-slate-600 font-medium">Industry</span>
                                            <span className="text-sm font-semibold text-slate-900">{metadata.industryType || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-slate-600 font-medium">Website</span>
                                            {metadata.website ? (
                                                <a href={metadata.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold inline-flex items-center gap-1">
                                                    {metadata.website.replace('https://', '').replace('http://', '')} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-sm">N/A</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm text-slate-600 font-medium">Registration #</span>
                                            <span className="text-sm font-semibold text-slate-900 font-mono">{metadata.registration_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details Section */}
                                <div className="space-y-3 pb-6 border-b border-slate-200">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Contact Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-500 font-medium">Email</p>
                                                <p className="text-sm font-semibold text-slate-900 break-all">{metadata.contactEmail || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 font-medium">Phone</p>
                                                <p className="text-sm font-semibold text-slate-900">{metadata.contactPhone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 font-medium">Headquarters</p>
                                                <p className="text-sm font-semibold text-slate-900">{metadata.headquarters_address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Organization Metadata Section */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Metadata</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Created</p>
                                            <p className="text-sm font-semibold text-slate-900">{metadata.created_at ? new Date(metadata.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <p className="text-xs text-slate-500 font-medium mb-1">Created By</p>
                                            <p className="text-sm font-semibold text-slate-900 truncate">{metadata.created_by ? metadata.created_by.split('|')[1] || metadata.created_by : 'System'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Tabs>

            {/* Send Invitation Modal */}
            {showInviteModal && (
                <Modal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    title="Send Invitation"
                    size="sm"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Role
                            </label>
                            <select
                                value={inviteRoles[0] || 'member'}
                                onChange={(e) => setInviteRoles([e.target.value])}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={submitting}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowInviteModal(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSendInvitation}
                                disabled={submitting}
                                loading={submitting}
                            >
                                Send Invitation
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <Modal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    title="Delete Organization"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-slate-600">
                            Are you sure you want to delete <strong>"{organization.display_name || organization.name}"</strong>?
                        </p>
                        <p className="text-sm text-slate-500">
                            This action cannot be undone. All associated data will be permanently removed.
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
                                Delete Organization
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Loading Overlay for Async Operations */}
            {submitting && <FullPageLoader message="Processing..." />}
        </div>
    );
};

export default OrgProfile;
