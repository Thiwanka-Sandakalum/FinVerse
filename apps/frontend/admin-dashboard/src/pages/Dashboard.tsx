import React from 'react';
import { Building2, Users, CreditCard, Activity, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import { UserRole } from '../types/rbac.types';
import ActivityOverviewChart from '../components/dashboard/ActivityOverviewChart';
import ProductDistributionChart from '../components/dashboard/ProductDistributionChart';
import RecentOrganizationsTable from '../components/dashboard/RecentOrganizationsTable';
import StatCard from '../components/dashboard/StatCard';
import { Button } from '../components/ui/common/Button';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = usePermission();

  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isOrgAdmin = userRole === UserRole.ORG_ADMIN;
  const isMember = userRole === UserRole.MEMBER;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          {isSuperAdmin && (
            <p className="text-slate-500">System-wide overview and management.</p>
          )}
          {isOrgAdmin && (
            <p className="text-slate-500">Organization overview and management.</p>
          )}
          {isMember && (
            <p className="text-slate-500">Your products and activity.</p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> System Normal
          </span>

          {/* SuperAdmin: Can create everything */}
          {isSuperAdmin && (
            <>
              <Button onClick={() => navigate('/organizations/create')} variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-50">
                + Organization
              </Button>
              <Button onClick={() => navigate('/users/create')} variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-50">
                + User
              </Button>
              <Button onClick={() => navigate('/products/create')} variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-50">
                + Product
              </Button>
              <Button>Download Report</Button>
            </>
          )}

          {/* OrgAdmin: Can create users and products in their org */}
          {isOrgAdmin && (
            <>
              <Button onClick={() => navigate('/users/create')} variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-50">
                + User
              </Button>
              <Button onClick={() => navigate('/products/create')} variant="outline" className="border-indigo-500 text-indigo-700 hover:bg-indigo-50">
                + Product
              </Button>
            </>
          )}

          {/* Member: Can't create anything */}
          {isMember && (
            <Button disabled>Download Report</Button>
          )}
        </div>
      </div>

      {/* SuperAdmin Dashboard: System-wide metrics */}
      {isSuperAdmin && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Organizations" value="1,284" trend="+12.5%" trendUp={true} icon={Building2} />
            <StatCard title="Total Users" value="45.2k" trend="+5.2%" trendUp={true} icon={Users} />
            <StatCard title="Active Products" value="3,402" trend="+18.2%" trendUp={true} icon={CreditCard} />
            <StatCard title="Pending Requests" value="12" trend="-4.5%" trendUp={false} icon={Activity} />
          </div>

          <div className="grid gap-6 lg:grid-cols-7">
            <ActivityOverviewChart />
            <ProductDistributionChart />
          </div>

          <RecentOrganizationsTable />
        </>
      )}

      {/* OrgAdmin Dashboard: Organization-specific metrics */}
      {isOrgAdmin && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Organization Members" value="124" trend="+8.2%" trendUp={true} icon={Users} />
            <StatCard title="Products" value="45" trend="+3.1%" trendUp={true} icon={ShoppingCart} />
            <StatCard title="Active Users" value="98" trend="+5.2%" trendUp={true} icon={Users} />
            <StatCard title="Pending Actions" value="5" trend="-2.3%" trendUp={false} icon={Activity} />
          </div>

          <div className="grid gap-6 lg:grid-cols-7">
            <ActivityOverviewChart />
            <ProductDistributionChart />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use the Users tab to manage team members and the Products tab to manage your organization's products.
            </p>
          </div>
        </>
      )}

      {/* Member Dashboard: Personal metrics */}
      {isMember && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Your Products" value="12" trend="+2.1%" trendUp={true} icon={ShoppingCart} />
            <StatCard title="Recent Activity" value="28" trend="+4.5%" trendUp={true} icon={Activity} />
            <StatCard title="Resources Used" value="68%" trend="+1.2%" trendUp={true} icon={CreditCard} />
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm text-indigo-800">
              <strong>Welcome!</strong> You can browse and interact with products. For more capabilities, contact your organization admin.
            </p>
          </div>

          <ProductDistributionChart />
        </>
      )}
    </div>
  );
};
