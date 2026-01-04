import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/common/DataTable';
import { OrganizationsService, Organization } from '@/src/api/users';
import { Plus, Search, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Status } from '../../../types';
import DirectoryLayout from '../shared/DirectoryLayout';
import { Button } from '@/src/components/ui/common/Button';
import { CardHeader, CardTitle, CardContent } from '@/src/components/ui/common/Card';
import { Badge } from '@/src/components/ui/common/Badge';
import { DropdownMenu } from '@/src/components/ui/common/DropdownMenu';
import { Input } from '@/src/components/ui/common/Input';
import { Select } from '@/src/components/ui/common/Select';
import { Spinner, Skeleton } from '@/src/components/ui/common/Loading';
import { useToast } from '@/src/components/ui/common/Toast';

const OrgList: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [totalOrgs, setTotalOrgs] = useState(0);
    const perPage = 20;

    useEffect(() => {
        fetchOrganizations();
    }, [page, searchQuery]);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const response = await OrganizationsService.listOrganizations(
                undefined,
                page,
                perPage,
                searchQuery || undefined
            );

            const data = response.data || response;
            setOrganizations(Array.isArray(data.items) ? data.items : []);
            setTotalOrgs(data.pagination?.total ? Number(data.pagination.total) : (Array.isArray(data.items) ? data.items.length : 0));
        } catch (error) {
            console.error('Failed to fetch organizations:', error);
            showToast('Failed to load organizations', 'error');
            setOrganizations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(0);
    };

    const handleReset = () => {
        setSearchQuery('');
        setTypeFilter('all');
        setStatusFilter('all');
        setPage(0);
    };

    const filteredOrgs = organizations.filter(org => {
        const matchesType = typeFilter === 'all' || (org.metadata as any)?.type === typeFilter || org.metadata?.industryType === typeFilter;
        const matchesStatus = statusFilter === 'all' || (org.metadata as any)?.status === statusFilter;
        return matchesType && matchesStatus;
    });

    return (
        <DirectoryLayout
            title="Organizations"
            subtitle="Manage financial institutions and partners."
            actions={
                <Button onClick={() => navigate('/organizations/create')}>
                    <Plus className="mr-2 h-4 w-4" /> Create Organization
                </Button>
            }
        >
            <CardHeader>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <CardTitle className="shrink-0">Organization Directory</CardTitle>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 z-10" />
                            <Input
                                placeholder="Search name..."
                                className="pl-9 w-full"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Select
                                className="w-full sm:w-40"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                options={[
                                    { label: 'All Types', value: 'all' },
                                    { label: 'Bank', value: 'bank' },
                                    { label: 'Microfinance', value: 'micro' },
                                    { label: 'Fintech', value: 'fintech' }
                                ]}
                            />
                            <Select
                                className="w-full sm:w-40"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { label: 'All Status', value: 'all' },
                                    { label: 'Active', value: 'active' },
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Suspended', value: 'suspended' }
                                ]}
                            />
                            <Button variant="outline" size="md" onClick={handleReset} leftIcon={<RefreshCw className="w-4 h-4" />}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg">
                                <Skeleton width="40px" height="40px" className="rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton width="180px" height="16px" />
                                    <Skeleton width="120px" height="12px" />
                                </div>
                                <Skeleton width="80px" height="20px" className="rounded-md" />
                                <Skeleton width="120px" height="20px" />
                                <Skeleton width="60px" height="20px" />
                                <Skeleton width="80px" height="24px" className="rounded-full" />
                                <Skeleton width="80px" height="24px" className="rounded-full" />
                                <Skeleton width="32px" height="32px" className="rounded" />
                            </div>
                        ))}
                    </div>
                ) : filteredOrgs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No organizations found</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first organization'}
                        </p>
                        {!searchQuery && (
                            <Button onClick={() => navigate('/organizations/create')}>
                                <Plus className="mr-2 h-4 w-4" /> Create Organization
                            </Button>
                        )}
                    </div>
                ) : (
                    <DataTable<Organization>
                        columns={[
                            {
                                key: 'name',
                                header: 'Organization',
                                render: (org: Organization) => (
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/organizations/${org.id}`)}>
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100">
                                            {(org.display_name || org.name).charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {org.display_name || org.name}
                                            </div>
                                            <div className="text-xs text-slate-500">{org.id}</div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: 'type',
                                header: 'Type',
                                render: (org: Organization) => <span className="text-slate-600 capitalize">{(org.metadata as any)?.type || org.metadata?.industryType || 'N/A'}</span>,
                            },
                            {
                                key: 'location',
                                header: 'Location',
                                render: (org: Organization) => (
                                    <div className="flex items-center gap-1">
                                        <span className="truncate max-w-[100px]">
                                            {(org.metadata as any)?.city || 'N/A'}, {org.metadata?.country || 'N/A'}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                key: 'branches',
                                header: 'Branches',
                                render: (org: Organization) => <span className="text-slate-600">{(org.metadata as any)?.branches || 0}</span>,
                            },
                            {
                                key: 'activeProducts',
                                header: 'Products',
                                render: (org: Organization) => <Badge variant="info">{(org.metadata as any)?.activeProducts || 0}</Badge>,
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (org: Organization) => (
                                    <Badge
                                        variant={
                                            (org.metadata as any)?.status === 'active' ? 'success' :
                                                (org.metadata as any)?.status === 'pending' ? 'warning' :
                                                    'default'
                                        }
                                    >
                                        {(org.metadata as any)?.status || 'Active'}
                                    </Badge>
                                ),
                            },
                            {
                                key: 'actions',
                                header: '',
                                render: (org: Organization) => (
                                    <DropdownMenu
                                        trigger={
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        }
                                        items={[
                                            {
                                                label: 'View Details',
                                                onClick: () => navigate(`/organizations/${org.id}`)
                                            },
                                            {
                                                label: 'Edit',
                                                onClick: () => navigate(`/organizations/${org.id}/edit`)
                                            },
                                            {
                                                label: 'Delete',
                                                onClick: () => console.log('Delete org', org.id),
                                                variant: 'danger'
                                            }
                                        ]}
                                    />
                                ),
                            },
                        ]}
                        data={filteredOrgs}
                        emptyMessage="No organizations found"
                    />
                )}

                {!loading && filteredOrgs.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 mt-4">
                        <div className="text-sm text-slate-600">
                            Showing {page * perPage + 1}-{Math.min((page + 1) * perPage, totalOrgs)} of {totalOrgs}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={(page + 1) * perPage >= totalOrgs}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </DirectoryLayout>
    );
};

export default OrgList;
