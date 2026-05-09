import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { clientsApi } from '@/api/clientsApi';
import { documentsApi } from '@/api/documentsApi';
import { Client, Document } from '@/types';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const clientData = await clientsApi.getClientByUserId(user.id);
      if (clientData) {
        setClient(clientData);
        const docs = await documentsApi.getDocumentsByClient(clientData.id);
        setDocuments(docs);
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const columns = [
    { header: 'Document', accessorKey: 'name' as const },
    { header: 'Type', accessorKey: 'type' as const },
    { header: 'Category', accessorKey: 'category' as const },
    { header: 'Status', accessorKey: 'status' as const, cell: (row: Document) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'id' as const, cell: () => <Button variant="outline" size="sm">Download</Button> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h2 className="text-2xl font-bold">Welcome, {user?.name}</h2><p className="text-muted-foreground">Your document portal</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Documents" value={documents.length} icon={FileText} />
        <StatsCard title="Pending" value={documents.filter(d => d.status === 'pending').length} icon={Clock} />
        <StatsCard title="Approved" value={documents.filter(d => d.status === 'approved').length} icon={CheckCircle} />
      </div>
      {client && (
        <Card>
          <CardHeader><CardTitle>Your Profile</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">PAN:</span><span>{client.panNumber}</span></div>
            {client.gstNumber && <div className="flex justify-between"><span className="text-muted-foreground">GST:</span><span>{client.gstNumber}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span>{client.email}</span></div>
          </CardContent>
        </Card>
      )}
      <div><h3 className="text-lg font-semibold mb-4">My Documents</h3><DataTable data={documents} columns={columns} searchPlaceholder="Search documents..." /></div>
    </div>
  );
}
