import { useState, useEffect } from 'react';
import { caDashboardApi, ApiClient, BillingSummary, ClientFormData, ClientBilling, Payment } from '@/api/caDashboardApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Plus,
  Edit,
  IndianRupee,
  Users,
  Phone,
  CreditCard,
  Mail,
  Plus as PlusIcon,
  Calendar,
  Receipt,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialFormData: ClientFormData = {
  name: '',
  dateOfBirth: '',
  pan: '',
  gstNumber: '',
  clientType: 'INDIVIDUAL',
  telephone: '',
  mobile: '',
  email: '',
  address: '',
  pinCode: '',
  state: '',
  status: true,
};

export default function CAClients() {
  const { toast } = useToast();
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<ApiClient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);
  const [billing, setBilling] = useState<BillingSummary | null>(null);

  // Add client dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<ClientFormData>(initialFormData);
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Edit client dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ApiClient | null>(null);
  const [editFormData, setEditFormData] = useState<ClientFormData>(initialFormData);
  const [isEditingClient, setIsEditingClient] = useState(false);

  // Billing dialog state
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);
  const [billingClient, setBillingClient] = useState<ApiClient | null>(null);
  const [clientBilling, setClientBilling] = useState<ClientBilling | null>(null);
  const [billingFormData, setBillingFormData] = useState({
    totalAmount: 0,
    discountAmount: 0,
  });
  const [isSavingBilling, setIsSavingBilling] = useState(false);
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  // Payments state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amountReceived: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI',
    referenceNo: '',
  });
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchQuery, clients]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clientCount, billingSummary, clientsResponse] = await Promise.all([
        caDashboardApi.getClientCount(),
        caDashboardApi.getBillingSummary(),
        caDashboardApi.getClients(),
      ]);
      
      setTotalClients(clientCount);
      setBilling(billingSummary);
      setClients(clientsResponse.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clients data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.pan.toLowerCase().includes(query) ||
        c.mobile.includes(query) ||
        c.clientType.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Open edit dialog with client data fetched from API
  const handleEditClient = async (client: ApiClient) => {
    setEditingClient(client);
    setEditDialogOpen(true);
    
    try {
      const fullClientData = await caDashboardApi.getClientById(client.id);
      console.log('Full client data from API:', fullClientData);
      
      // Handle both camelCase and other possible field name formats from API
      const apiData = fullClientData as unknown as Record<string, unknown>;
      setEditFormData({
        name: (apiData.name as string) || client.name,
        dateOfBirth: (apiData.dateOfBirth as string) || (apiData.dob as string) || (apiData.date_of_birth as string) || '',
        pan: (apiData.pan as string) || client.pan,
        gstNumber: (apiData.gstNumber as string) || (apiData.gst as string) || (apiData.gst_number as string) || '',
        clientType: (apiData.clientType as string) || (apiData.client_type as string) || client.clientType,
        telephone: (apiData.telephone as string) || (apiData.phone as string) || '',
        mobile: (apiData.mobile as string) || client.mobile,
        email: (apiData.email as string) || client.email || '',
        address: (apiData.address as string) || '',
        pinCode: (apiData.pinCode as string) || (apiData.pin_code as string) || (apiData.pincode as string) || '',
        state: (apiData.state as string) || '',
        status: (apiData.status as boolean) ?? client.status,
      });
    } catch (error) {
      console.error('Error fetching client details:', error);
      // Fallback to basic data from list
      setEditFormData({
        name: client.name,
        dateOfBirth: '',
        pan: client.pan,
        gstNumber: '',
        clientType: client.clientType,
        telephone: '',
        mobile: client.mobile,
        email: client.email || '',
        address: '',
        pinCode: '',
        state: '',
        status: client.status,
      });
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (!editingClient) return;
    setIsEditingClient(true);
    try {
      await caDashboardApi.updateClient(editingClient.id, editFormData);
      toast({
        title: 'Client Updated',
        description: `${editFormData.name}'s information has been updated successfully.`,
      });
      setEditDialogOpen(false);
      setEditingClient(null);
      loadData(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update client. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEditingClient(false);
    }
  };

  // Handle add form submission
  const handleAddSubmit = async () => {
    setIsAddingClient(true);
    try {
      await caDashboardApi.createClient(addFormData);
      toast({
        title: 'Client Added',
        description: `${addFormData.name} has been added successfully.`,
      });
      setAddDialogOpen(false);
      setAddFormData(initialFormData);
      loadData(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add client. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingClient(false);
    }
  };

  // Open billing dialog with client data
  const handleUpdateBilling = async (client: ApiClient) => {
    setBillingClient(client);
    setBillingDialogOpen(true);
    setIsBillingLoading(true);
    setClientBilling(null);
    setPayments([]);
    
    try {
      const billing = await caDashboardApi.getClientBilling(client.id);
      setClientBilling(billing);
      
      if (billing) {
        setBillingFormData({
          totalAmount: billing.totalAmount,
          discountAmount: billing.discountAmount,
        });
        
        // Fetch payments if billing exists
        setIsPaymentsLoading(true);
        const paymentsData = await caDashboardApi.getPayments(billing.id);
        setPayments(paymentsData);
        setIsPaymentsLoading(false);
      } else {
        setBillingFormData({
          totalAmount: client.billingTotal || 0,
          discountAmount: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching billing:', error);
      setBillingFormData({
        totalAmount: client.billingTotal || 0,
        discountAmount: 0,
      });
    } finally {
      setIsBillingLoading(false);
    }
  };

  // Handle billing form submission
  const handleBillingSubmit = async () => {
    if (!billingClient) return;
    
    setIsSavingBilling(true);
    try {
      await caDashboardApi.saveBilling({
        clientId: billingClient.id,
        totalAmount: billingFormData.totalAmount,
        discountAmount: billingFormData.discountAmount,
      });
      
      toast({
        title: 'Billing Updated',
        description: `${billingClient.name}'s billing has been updated successfully.`,
      });
      
      // Refresh billing data
      const updatedBilling = await caDashboardApi.getClientBilling(billingClient.id);
      setClientBilling(updatedBilling);
      
      // Refresh main data
      loadData();
    } catch (error) {
      console.error('Error saving billing:', error);
      toast({
        title: 'Error',
        description: 'Failed to update billing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingBilling(false);
    }
  };

  // Handle adding payment
  const handleAddPayment = async () => {
    if (!clientBilling) {
      toast({
        title: 'Save Billing First',
        description: 'Please save the billing details before adding payments.',
        variant: 'destructive',
      });
      return;
    }
    
    if (paymentFormData.amountReceived <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAddingPayment(true);
    try {
      await caDashboardApi.addPayment(clientBilling.id, paymentFormData);
      
      toast({
        title: 'Payment Added',
        description: `Payment of ₹${paymentFormData.amountReceived.toLocaleString('en-IN')} recorded successfully.`,
      });
      
      // Refresh payments list
      const updatedPayments = await caDashboardApi.getPayments(clientBilling.id);
      setPayments(updatedPayments);
      
      // Reset payment form
      setPaymentFormData({
        amountReceived: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMode: 'UPI',
        referenceNo: '',
      });
      
      // Refresh main data
      loadData();
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingPayment(false);
    }
  };

  // Calculate totals
  const totalReceived = payments.reduce((sum, p) => sum + p.amountReceived, 0);
  const netAmount = billingFormData.totalAmount - billingFormData.discountAmount;
  const pendingAmount = Math.max(0, netAmount - totalReceived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">
            Manage your clients and their billing
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => setAddDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, PAN, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <IndianRupee className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Billing</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(billing?.totalBilling || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <IndianRupee className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(billing?.totalReceived || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <IndianRupee className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(billing?.totalPending || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No clients found matching your search' : 'No clients yet. Add your first client!'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>PAN</TableHead>
                    <TableHead>Mobile</TableHead>
                  
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <p className="font-medium">{client.name}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono text-sm">{client.pan}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" /> {client.mobile}
                          </span>

                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" /> {client.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{client.clientType.toLowerCase()}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(client.billingTotal)}
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {formatCurrency(client.billingReceived)}
                      </TableCell>
                      <TableCell className="text-right text-orange-600 font-medium">
                        {formatCurrency(client.billingPending)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={client.status ? 'active' : 'inactive'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Client"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Update Billing"
                            onClick={() => handleUpdateBilling(client)}
                          >
                            <IndianRupee className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <p className="text-sm text-muted-foreground">Update client information</p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Row 1: Full Name + Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dob">Date of Birth *</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={editFormData.dateOfBirth}
                  onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            {/* Row 2: PAN + GST Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-pan">PAN *</Label>
                <Input
                  id="edit-pan"
                  value={editFormData.pan}
                  onChange={(e) => setEditFormData({ ...editFormData, pan: e.target.value.toUpperCase() })}
                  maxLength={10}
                  placeholder="ABCDE1234F"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gst">GST Number</Label>
                <Input
                  id="edit-gst"
                  value={editFormData.gstNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value.toUpperCase() })}
                  maxLength={15}
                  placeholder="27ABCDE1234F1Z5"
                />
              </div>
            </div>

            {/* Row 3: Client Type + Telephone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Client Type *</Label>
                <Select
                  value={editFormData.clientType}
                  onValueChange={(value) => setEditFormData({ ...editFormData, clientType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="HUF">HUF</SelectItem>
                    <SelectItem value="FIRM">Firm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-telephone">Telephone</Label>
                <Input
                  id="edit-telephone"
                  value={editFormData.telephone}
                  onChange={(e) => setEditFormData({ ...editFormData, telephone: e.target.value })}
                  placeholder="+91 11 2345 6789"
                />
              </div>
            </div>

            {/* Row 4: Mobile + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-mobile">Mobile *</Label>
                <Input
                  id="edit-mobile"
                  value={editFormData.mobile}
                  onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                  maxLength={10}
                  placeholder="9999911111"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="amit@example.com"
                />
              </div>
            </div>

            {/* Row 5: Address (full width) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                placeholder="101 Residential Complex, Mumbai"
              />
            </div>

            {/* Row 6: PIN Code + State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-pincode">PIN Code *</Label>
                <Input
                  id="edit-pincode"
                  value={editFormData.pinCode}
                  onChange={(e) => setEditFormData({ ...editFormData, pinCode: e.target.value })}
                  maxLength={6}
                  placeholder="400001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-state">State *</Label>
                <Select
                  value={editFormData.state}
                  onValueChange={(value) => setEditFormData({ ...editFormData, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Kerala">Kerala</SelectItem>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Bihar">Bihar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="gradient-primary" 
              onClick={handleEditSubmit}
              disabled={isEditingClient}
            >
              {isEditingClient ? 'Updating...' : 'Update Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Billing Dialog */}
      <Dialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Billing & Payments</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Manage billing for {billingClient?.name}
            </p>
          </DialogHeader>
          
          {isBillingLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <Tabs defaultValue="billing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
              </TabsList>
              
              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-4 pt-4">
                {/* Total Billing Amount */}
                <div className="grid gap-2">
                  <Label htmlFor="billing-total">Total Billing Amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="billing-total"
                      type="number"
                      value={billingFormData.totalAmount}
                      onChange={(e) => setBillingFormData({ ...billingFormData, totalAmount: Number(e.target.value) })}
                      className="pl-10"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Discount Amount */}
                <div className="grid gap-2">
                  <Label htmlFor="billing-discount">Discount Amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="billing-discount"
                      type="number"
                      value={billingFormData.discountAmount}
                      onChange={(e) => setBillingFormData({ ...billingFormData, discountAmount: Number(e.target.value) })}
                      className="pl-10"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  {billingFormData.discountAmount > 0 && billingFormData.totalAmount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Discount: {((billingFormData.discountAmount / billingFormData.totalAmount) * 100).toFixed(1)}% off
                    </p>
                  )}
                </div>

                {/* Billing Summary */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{formatCurrency(billingFormData.totalAmount)}</span>
                  </div>
                  {billingFormData.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="font-medium text-blue-600">-{formatCurrency(billingFormData.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Net Amount:</span>
                    <span className="font-semibold">{formatCurrency(netAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Received:</span>
                    <span className="font-medium text-green-600">{formatCurrency(totalReceived)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-bold text-orange-600">{formatCurrency(pendingAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setBillingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="gradient-primary" 
                    onClick={handleBillingSubmit}
                    disabled={isSavingBilling}
                  >
                    {isSavingBilling ? 'Saving...' : 'Save Billing'}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4 pt-4">
                {/* Add Payment Form */}
                <div className="p-4 rounded-lg border space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Add New Payment
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1">
                      <Label htmlFor="payment-amount" className="text-xs">Amount</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          id="payment-amount"
                          type="number"
                          value={paymentFormData.amountReceived || ''}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, amountReceived: Number(e.target.value) })}
                          className="pl-7 h-9"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      <Label htmlFor="payment-date" className="text-xs">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          id="payment-date"
                          type="date"
                          value={paymentFormData.paymentDate}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentDate: e.target.value })}
                          className="pl-7 h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      <Label htmlFor="payment-mode" className="text-xs">Mode</Label>
                      <Select
                        value={paymentFormData.paymentMode}
                        onValueChange={(value) => setPaymentFormData({ ...paymentFormData, paymentMode: value })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                          <SelectItem value="CHEQUE">Cheque</SelectItem>
                          <SelectItem value="CARD">Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-1">
                      <Label htmlFor="payment-ref" className="text-xs">Reference No.</Label>
                      <Input
                        id="payment-ref"
                        value={paymentFormData.referenceNo}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, referenceNo: e.target.value })}
                        className="h-9"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddPayment} 
                    disabled={isAddingPayment || !clientBilling}
                    className="w-full"
                    size="sm"
                  >
                    {isAddingPayment ? 'Adding...' : 'Add Payment'}
                  </Button>
                  
                  {!clientBilling && (
                    <p className="text-xs text-orange-600 text-center">
                      Please save billing details first before adding payments
                    </p>
                  )}
                </div>

                {/* Payments List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Payment History</h4>
                  {isPaymentsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No payments recorded yet
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {payments.map((payment) => (
                        <div key={payment.id} className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-600">{formatCurrency(payment.amountReceived)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.paymentDate).toLocaleDateString('en-IN')} • {payment.paymentMode}
                              {payment.referenceNo && ` • ${payment.referenceNo}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 flex justify-between items-center">
                  <span className="text-sm font-medium">Total Received</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(totalReceived)}</span>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <p className="text-sm text-muted-foreground">Enter client details to register</p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Row 1: Full Name + Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-name">Full Name *</Label>
                <Input
                  id="add-name"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-dob">Date of Birth *</Label>
                <Input
                  id="add-dob"
                  type="date"
                  value={addFormData.dateOfBirth}
                  onChange={(e) => setAddFormData({ ...addFormData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            {/* Row 2: PAN + GST Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-pan">PAN *</Label>
                <Input
                  id="add-pan"
                  value={addFormData.pan}
                  onChange={(e) => setAddFormData({ ...addFormData, pan: e.target.value.toUpperCase() })}
                  maxLength={10}
                  placeholder="E.G., ABCDE1234F"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-gst">GST Number</Label>
                <Input
                  id="add-gst"
                  value={addFormData.gstNumber}
                  onChange={(e) => setAddFormData({ ...addFormData, gstNumber: e.target.value.toUpperCase() })}
                  maxLength={15}
                  placeholder="ENTER GST NUMBER (OPTIONAL)"
                />
              </div>
            </div>

            {/* Row 3: Client Type + Telephone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-type">Client Type *</Label>
                <Select
                  value={addFormData.clientType}
                  onValueChange={(value) => setAddFormData({ ...addFormData, clientType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="HUF">HUF</SelectItem>
                    <SelectItem value="FIRM">Firm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-telephone">Telephone</Label>
                <Input
                  id="add-telephone"
                  value={addFormData.telephone}
                  onChange={(e) => setAddFormData({ ...addFormData, telephone: e.target.value })}
                  placeholder="Enter telephone number"
                />
              </div>
            </div>

            {/* Row 4: Mobile + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-mobile">Mobile *</Label>
                <Input
                  id="add-mobile"
                  value={addFormData.mobile}
                  onChange={(e) => setAddFormData({ ...addFormData, mobile: e.target.value })}
                  maxLength={10}
                  placeholder="9999911111"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
            </div>

            {/* Row 5: Address (full width) */}
            <div className="grid gap-2">
              <Label htmlFor="add-address">Address *</Label>
              <Input
                id="add-address"
                value={addFormData.address}
                onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>

            {/* Row 6: PIN Code + State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-pincode">PIN Code *</Label>
                <Input
                  id="add-pincode"
                  value={addFormData.pinCode}
                  onChange={(e) => setAddFormData({ ...addFormData, pinCode: e.target.value })}
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-state">State *</Label>
                <Select
                  value={addFormData.state}
                  onValueChange={(value) => setAddFormData({ ...addFormData, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Kerala">Kerala</SelectItem>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Bihar">Bihar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="gradient-primary" 
              onClick={handleAddSubmit}
              disabled={isAddingClient}
            >
              {isAddingClient ? 'Adding...' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
