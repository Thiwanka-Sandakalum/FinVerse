import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/ui/common/DataTable';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UsersService } from '@/src/api/users';
import { useToast } from '@/src/components/ui/common/Toast';
import DirectoryLayout from '../shared/DirectoryLayout';
import DirectoryFilters from '@/src/components/ui/common/DirectoryFilters';
import { Avatar } from '@/src/components/ui/common/Avatar';
import { Button } from '@/src/components/ui/common/Button';
import { CardHeader, CardTitle, CardContent } from '@/src/components/ui/common/Card';
import { DropdownMenu } from '@/src/components/ui/common/DropdownMenu';
import { Badge } from '@/src/components/ui/common/Badge';
import { Skeleton, FullPageLoader } from '@/src/components/ui/common/Loading';
import { Modal } from '@/src/components/ui/common/Modal';
import { usePermission } from '@/src/hooks/usePermission';
import { UserRole } from '@/src/types/rbac.types';
import { useAuth0 } from '@auth0/auth0-react';



interface User {
    user_id: string;
    name: string;
    email: string;
    email_verified: boolean;
    created_at: string;
    updated_at?: string;
    picture?: string;
    nickname?: string;
    given_name?: string;
    family_name?: string;
    last_login?: string;
    logins_count?: number;
    org_id?: string;
}

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { userRole } = usePermission();
    const { user: auth0User } = useAuth0();

    // State management
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Get current user's org_id for filtering
    const currentOrgId = auth0User?.orgId;
    const isOrgAdmin = userRole === UserRole.ORG_ADMIN;

    // Fetch users with filters and pagination
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const pageNum = page - 1; // Convert 1-indexed to 0-indexed
            const response = await UsersService.listUsers(undefined, pageNum, perPage);

            // Handle the actual response structure from API
            // API returns: { success, message, data: [], meta: {} }
            let userList = response?.data || [];

            // Normalize user data - extract org_id from user_metadata
            userList = userList.map((user: any) => ({
                ...user,
                org_id: user.user_metadata?.org_id || user.org_id
            }));

            setTotalCount(userList.length);

            // Filter by org_id for OrgAdmin
            if (isOrgAdmin && currentOrgId) {
                userList = userList.filter((user: User) => user.org_id === currentOrgId);
            }

            // Apply search filters
            if (searchQuery) {
                userList = userList.filter((user: User) =>
                    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (statusFilter !== 'all') {
                userList = userList.filter((user: User) => {
                    const userStatus = user.email_verified ? 'verified' : 'unverified';
                    return userStatus === statusFilter.toLowerCase();
                });
            }

            setUsers(userList);
        } catch (error: any) {
            console.error('Failed to fetch users:', error);
            showToast('Failed to load users', 'error');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, searchQuery, statusFilter, roleFilter, showToast, isOrgAdmin, currentOrgId]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete?.user_id) return;

        try {
            setSubmitting(true);
            await UsersService.deleteUser(userToDelete.user_id);
            showToast('User deleted successfully', 'success');
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            showToast(
                error?.body?.error || error?.message || 'Failed to delete user',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        setPage(1);
    };

    return (
        <DirectoryLayout
            title="Users"
            subtitle={isOrgAdmin ? "Manage your organization's users." : "Manage platform users and access."}
            actions={
                <>
                    <Button variant="outline">Export Users</Button>
                    <Button onClick={() => navigate('/users/create')}>
                        <Plus className="mr-2 h-4 w-4" /> Invite User
                    </Button>
                </>
            }
        >
            <CardHeader>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <CardTitle className="shrink-0">User Directory</CardTitle>
                    <DirectoryFilters
                        searchPlaceholder="Search name, email..."
                        onSearchChange={handleSearch}
                        selects={[
                            {
                                value: statusFilter,
                                onChange: handleStatusChange,
                                options: [
                                    { label: 'All Status', value: 'all' },
                                    { label: 'Verified', value: 'verified' },
                                    { label: 'Unverified', value: 'unverified' },
                                ],
                            },
                        ]}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <DataTable<User>
                    isLoading={loading}
                    loadingRows={8}
                    columns={[
                        {
                            key: 'name',
                            header: 'User Name',
                            render: (user: User) => (
                                <div
                                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => navigate(`/users/${user.user_id}`)}
                                >
                                    <Avatar initials={user.name?.charAt(0) || 'U'} />
                                    <div>
                                        <div className="font-medium text-slate-900">{user.name || 'N/A'}</div>
                                        <div className="text-xs text-slate-500">{user.user_id?.split('|')[0] || 'N/A'}</div>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'email',
                            header: 'Email',
                            render: (user: User) => <span className="text-slate-600 truncate">{user.email || 'N/A'}</span>,
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (user: User) => {
                                const status = user.email_verified ? 'verified' : 'unverified';
                                const statusVariant = user.email_verified ? 'success' : 'warning';
                                return (
                                    <Badge variant={statusVariant}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Badge>
                                );
                            },
                        },
                        {
                            key: 'email_verified',
                            header: 'Email Verified',
                            render: (user: User) => (
                                <Badge variant={user.email_verified ? 'success' : 'warning'}>
                                    {user.email_verified ? 'Verified' : 'Unverified'}
                                </Badge>
                            ),
                        },
                        {
                            key: 'created_at',
                            header: 'Created',
                            render: (user: User) => (
                                <span className="text-slate-600 text-sm">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </span>
                            ),
                        },
                        {
                            key: 'actions',
                            header: <span className="text-right block">Actions</span>,
                            className: 'text-right',
                            render: (user: User) => (
                                <DropdownMenu
                                    trigger={
                                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    }
                                    items={[
                                        { label: 'View Profile', onClick: () => navigate(`/users/${user.user_id}`) },
                                        { label: 'Edit User', onClick: () => navigate(`/users/${user.user_id}/edit`) },
                                        { label: 'Delete User', onClick: () => handleDeleteClick(user), danger: true },
                                    ]}
                                />
                            ),
                        },
                    ]}
                    data={users}
                    emptyMessage="No users found."
                    footer={
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                            <div className="text-xs text-slate-500">
                                Showing {users.length > 0 ? (page - 1) * perPage + 1 : 0}-{Math.min(page * perPage, totalCount)} of {totalCount}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                >
                                    Previous
                                </Button>
                                <span className="px-3 py-1 text-xs text-slate-600">Page {page}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page * perPage >= totalCount}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    }
                />
            </CardContent>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && userToDelete && (
                <Modal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setUserToDelete(null);
                    }}
                    title="Delete User"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-slate-600">
                            Are you sure you want to delete <strong>"{userToDelete.name}"</strong>?
                        </p>
                        <p className="text-sm text-slate-500">
                            This action cannot be undone. The user account will be permanently removed.
                        </p>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setUserToDelete(null);
                                }}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleConfirmDelete}
                                disabled={submitting}
                                loading={submitting}
                            >
                                Delete User
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {submitting && <FullPageLoader message="Processing..." />}
        </DirectoryLayout>
    );
};

export default UserList;