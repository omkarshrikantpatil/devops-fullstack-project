import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { subUsersApi } from '@/api/subUsersApi';
import { clientsApi } from '@/api/clientsApi';
import { Client, SubUser } from '@/types';
import { Users, FileText, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [subUser, setSubUser] = useState<SubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const subUserData = await subUsersApi.getSubUserByUserId(user.id);
      if (subUserData) {
        setSubUser(subUserData);
        const clientsData = await clientsApi.getClientsBySubUser(subUserData.id);
        setClients(clientsData);
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const columns = [
    { header: 'Name', accessorKey: 'name' as const },
    { header: 'Email', accessorKey: 'email' as const },
    { header: 'Type', accessorKey: 'type' as const },
    { header: 'Status', accessorKey: 'status' as const, cell: (row: Client) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'id' as const, cell: () => <Button variant="outline" size="sm">View</Button> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h2 className="text-2xl font-bold">Welcome, {user?.name}</h2><p className="text-muted-foreground">{subUser?.designation || 'Staff Member'}</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Assigned Clients" value={clients.length} icon={Users} />
        <StatsCard title="Documents to Review" value={5} icon={FileText} />
        <StatsCard title="Pending Tasks" value={3} icon={ClipboardList} />
      </div>
      <div><h3 className="text-lg font-semibold mb-4">My Clients</h3><DataTable data={clients} columns={columns} searchPlaceholder="Search clients..." /></div>
    </div>
  );
}
