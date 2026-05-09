import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { firmsApi } from '@/api/firmsApi';
import { CAFirm, MasterAdminStats } from '@/types';
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [stats, setStats] = useState<MasterAdminStats | null>(null);
  const [firms, setFirms] = useState<CAFirm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, firmsData] = await Promise.all([
        firmsApi.getMasterAdminStats(),
        firmsApi.getAllFirms(),
      ]);
      setStats(statsData);
      setFirms(firmsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const columns = [
    { header: 'Firm Name', accessorKey: 'name' as const },
    { header: 'Email', accessorKey: 'email' as const },
    { header: 'Clients', accessorKey: 'clientCount' as const },
    { header: 'Status', accessorKey: 'isActive' as const, cell: (row: CAFirm) => <StatusBadge status={row.isActive ? 'active' : 'inactive'} /> },
    { header: 'Actions', accessorKey: 'id' as const, cell: (row: CAFirm) => <Button variant="outline" size="sm">View</Button> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h2 className="text-2xl font-bold">Dashboard Overview</h2><p className="text-muted-foreground">Platform-wide statistics and management</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total CA Firms" value={stats?.totalFirms || 0} icon={Building2} trend={{ value: 12, isPositive: true }} />
        <StatsCard title="Active Firms" value={stats?.activeFirms || 0} icon={Users} />
        <StatsCard title="Monthly Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} icon={TrendingUp} trend={{ value: 8, isPositive: true }} />
        <StatsCard title="Active Subscriptions" value={stats?.activeSubscriptions || 0} icon={CreditCard} />
      </div>
      <div><h3 className="text-lg font-semibold mb-4">CA Firms</h3><DataTable data={firms} columns={columns} searchPlaceholder="Search firms..." /></div>
    </div>
  );
}
