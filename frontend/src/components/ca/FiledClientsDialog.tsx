import { useState, useEffect } from 'react';
import { ITFilingStats } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileText, User, FolderOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { caDashboardApi, FilingClient, FinancialYear } from '@/api/caDashboardApi';

interface FiledClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stat: ITFilingStats;
  type: 'filed' | 'notFiled';
  financialYearId?: number;
}

export function FiledClientsDialog({
  open,
  onOpenChange,
  stat,
  type,
  financialYearId,
}: FiledClientsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<FilingClient[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch clients when dialog opens
  useEffect(() => {
    if (open) {
      const fetchClients = async () => {
        setLoading(true);
        try {
          const data = type === 'filed' 
            ? await caDashboardApi.getFiledClients(stat.financialYear)
            : await caDashboardApi.getNotFiledClients(stat.financialYear);
          setClients(data);
        } catch (error) {
          console.error('Error fetching clients:', error);
          setClients([]);
        } finally {
          setLoading(false);
        }
      };
      fetchClients();
    }
  }, [open, type, stat.financialYear]);

  // Filter clients based on search
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleManageDocuments = (client: FilingClient) => {
    console.log('Navigating to documents with client:', client);
    onOpenChange(false);
    navigate(`/ca/documents?clientId=${client.id}&clientPan=${encodeURIComponent(client.pan)}&year=${stat.financialYear}&financialYearId=${financialYearId || ''}&isFiled=${type === 'filed'}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'filed' ? (
              <Badge className="bg-green-600">Filed</Badge>
            ) : (
              <Badge variant="destructive">Not Filed</Badge>
            )}
            Clients - FY {stat.financialYear}
          </DialogTitle>
          <DialogDescription>
            {type === 'filed' 
              ? `${stat.filed} clients have filed their Income Tax returns`
              : `${stat.notFiled} clients have not filed their Income Tax returns`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, PAN, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Clients Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading clients...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No clients found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client, index) => (
                  <TableRow key={`${client.pan}-${index}`} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{client.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{client.pan}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {client.clientType === 'INDIVIDUAL' ? 'Individual' : client.clientType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleManageDocuments(client)}
                        className="gap-2"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Manage Documents
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
