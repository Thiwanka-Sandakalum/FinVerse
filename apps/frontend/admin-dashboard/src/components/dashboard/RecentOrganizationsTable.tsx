import React from 'react';
import { Badge, MoreHorizontal } from 'lucide-react';
import { MOCK_ORGS } from '@/constants';
import { Button } from '../ui/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/common/Card';

const RecentOrganizationsTable: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Organizations</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 font-medium">Organization Name</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Branches</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ORGS.map((org) => (
                            <tr key={org.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{org.name}</td>
                                <td className="px-4 py-3 text-slate-600">{org.type}</td>
                                <td className="px-4 py-3 text-slate-600">{org.branches}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={org.status === 'Active' ? 'success' : org.status === 'Pending' ? 'warning' : 'default'}>
                                        {org.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{org.createdDate}</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
);

export default RecentOrganizationsTable;
