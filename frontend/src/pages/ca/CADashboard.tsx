import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/StatsCard';
import { caDashboardApi, BillingSummary, FilingSummary, FinancialYear } from '@/api/caDashboardApi';
import { ITFilingStats } from '@/types';
import { Users, IndianRupee, FileCheck, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiledClientsDialog } from '@/components/ca/FiledClientsDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CADashboard() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState<ITFilingStats | null>(null);
  const [dialogType, setDialogType] = useState<'filed' | 'notFiled'>('filed');
  const [showFiledDialog, setShowFiledDialog] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [financialYearsLoading, setFinancialYearsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [filingSummary, setFilingSummary] = useState<FilingSummary | null>(null);
  const [filingSummaryLoading, setFilingSummaryLoading] = useState(false);

  // Fetch financial years on mount
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const years = await caDashboardApi.getClientFinancialYears();
        // Get unique financial years
        const uniqueYears = years.reduce((acc: FinancialYear[], curr) => {
          if (!acc.find(y => y.financialYear === curr.financialYear)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setFinancialYears(uniqueYears);
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0].financialYear);
          setSelectedYearId(uniqueYears[0].id);
        }
      } catch (error) {
        console.error('Error fetching financial years:', error);
      } finally {
        setFinancialYearsLoading(false);
      }
    };
    fetchFinancialYears();
  }, []);

  // Fetch billing and counts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientCount, activeCount, billingSummary] = await Promise.all([
          caDashboardApi.getClientCount(),
          caDashboardApi.getActiveClientCount(),
          caDashboardApi.getBillingSummary(),
        ]);
        
        setTotalClients(clientCount);
        setActiveClients(activeCount);
        setBilling(billingSummary);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch filing summary when year changes
  useEffect(() => {
    if (!selectedYear) return;
    
    const fetchFilingSummary = async () => {
      setFilingSummaryLoading(true);
      try {
        const summary = await caDashboardApi.getFilingSummary(selectedYear);
        setFilingSummary(summary);
      } catch (error) {
        console.error('Error fetching filing summary:', error);
        setFilingSummary(null);
      } finally {
        setFilingSummaryLoading(false);
      }
    };
    fetchFilingSummary();
  }, [selectedYear]);

  const handleStatClick = (type: 'filed' | 'notFiled') => {
    if (!filingSummary) return;
    const stat: ITFilingStats = {
      financialYear: selectedYear,
      totalClients: filingSummary.totalClients,
      filed: filingSummary.filedClients,
      notFiled: filingSummary.notFiledClients,
    };
    setSelectedStat(stat);
    setDialogType(type);
    setShowFiledDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const filingRate = filingSummary && filingSummary.totalClients > 0
    ? ((filingSummary.filedClients / filingSummary.totalClients) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground">Income Tax Dashboard</p>
        </div>
        
        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {financialYearsLoading ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <Select 
              value={selectedYear} 
              onValueChange={(value) => {
                setSelectedYear(value);
                const fy = financialYears.find(y => y.financialYear === value);
                setSelectedYearId(fy?.id || null);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {financialYears.map((fy) => (
                  <SelectItem key={fy.id} value={fy.financialYear}>
                    FY {fy.financialYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Clients"
          value={totalClients}
          icon={Users}
          description="All registered clients"
        />
        <StatsCard 
          title="Active Clients"
          value={activeClients}
          icon={Users}
          description="Currently active"
        />
        <StatsCard 
          title="Bill Received"
          value={`₹${billing?.totalReceived?.toLocaleString('en-IN') || 0}`}
          icon={IndianRupee}
          description={`FY ${selectedYear}`}
          className="bg-green-50 dark:bg-green-950/20"
        />
        <StatsCard 
          title="Bill Pending"
          value={`₹${billing?.totalPending?.toLocaleString('en-IN') || 0}`}
          icon={IndianRupee}
          description={`FY ${selectedYear}`}
          className="bg-amber-50 dark:bg-amber-950/20"
        />
      </div>

      {/* Income Tax Filing Status for Selected Year */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Income Tax Filing Status - FY {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filingSummaryLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : filingSummary ? (
            <div className="grid gap-6 md:grid-cols-4">
              {/* Total Clients */}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Clients</p>
                <p className="text-3xl font-bold">{filingSummary.totalClients}</p>
              </div>
              
              {/* Filed */}
              <div 
                className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/30 transition-colors"
                onClick={() => handleStatClick('filed')}
              >
                <p className="text-sm text-muted-foreground mb-1">Filed</p>
                <p className="text-3xl font-bold text-green-600">{filingSummary.filedClients}</p>
                <Badge variant="default" className="mt-2 bg-green-600">
                  Click to view
                </Badge>
              </div>
              
              {/* Not Filed */}
              <div 
                className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                onClick={() => handleStatClick('notFiled')}
              >
                <p className="text-sm text-muted-foreground mb-1">Not Filed</p>
                <p className="text-3xl font-bold text-red-600">{filingSummary.notFiledClients}</p>
                <Badge variant="destructive" className="mt-2">
                  Click to view
                </Badge>
              </div>
              
              {/* Filing Rate */}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Filing Rate</p>
                <p className={`text-3xl font-bold ${parseFloat(filingRate) >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
                  {filingRate}%
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No data available for FY {selectedYear}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filed Clients Dialog */}
      {selectedStat && (
        <FiledClientsDialog
          open={showFiledDialog}
          onOpenChange={setShowFiledDialog}
          stat={selectedStat}
          type={dialogType}
          financialYearId={selectedYearId || undefined}
        />
      )}
    </div>
  );
}
