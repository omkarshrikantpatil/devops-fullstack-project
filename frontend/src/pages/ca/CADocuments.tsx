import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { caDashboardApi, ClientDocument, FinancialYear } from '@/api/caDashboardApi';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Share2
} from 'lucide-react';

// Document type definitions - the 6 predefined document types
const DOCUMENT_TYPES = [
  { key: 'Acknowledgement', label: 'Acknowledgement' },
  { key: 'Statement_of_Total_Income', label: 'Statement of Total Income' },
  { key: 'Balance_Sheet', label: 'Balance Sheet' },
  { key: 'Profit_Loss', label: 'Profit & Loss' },
  { key: 'Form_26AS', label: '26AS' },
  { key: 'Tax_Challan', label: 'Tax Challan' },
];

// Types
interface Document {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  type: string;
  size: number;
  financialYear: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  driveFileId?: string;
  fileUrl?: string;
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function CADocuments() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Get query params for client filtering from dashboard navigation
  const clientIdFromUrl = searchParams.get('clientId');
  const clientPanFromUrl = searchParams.get('clientPan');
  const yearFromUrl = searchParams.get('year');
  const financialYearIdFromUrl = searchParams.get('financialYearId');
  const isFiledFromUrl = searchParams.get('isFiled') === 'true';

  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // Financial years from API
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [financialYearsLoading, setFinancialYearsLoading] = useState(true);

  // Filing status toggle - use initial value from URL
  const [isClientFiled, setIsClientFiled] = useState<boolean>(isFiledFromUrl);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Year state
  const [selectedYear, setSelectedYear] = useState<string>(yearFromUrl || '');
  const [selectedYearId, setSelectedYearId] = useState<number | null>(
    financialYearIdFromUrl ? parseInt(financialYearIdFromUrl) : null
  );

  // Multi-select state
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Upload dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDocs, setDeletingDocs] = useState(false);

  // Fetch financial years on mount
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const years = await caDashboardApi.getClientFinancialYears();
        setFinancialYears(years);

        if (yearFromUrl) {
          // Year already set from URL
        } else if (financialYearIdFromUrl) {
          const parsedId = parseInt(financialYearIdFromUrl);
          const match = years.find(y => y.id === parsedId);
          if (match) {
            setSelectedYear(match.financialYear);
          }
        } else if (years.length > 0) {
          setSelectedYear(years[0].financialYear);
          setSelectedYearId(years[0].id);
        }
      } catch (error) {
        console.error('Error fetching financial years:', error);
      } finally {
        setFinancialYearsLoading(false);
      }
    };
    fetchFinancialYears();
  }, [yearFromUrl, financialYearIdFromUrl]);

  // Fetch documents when client and year are selected
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!clientIdFromUrl) return;

      let yearIdsToFetch: number[] = [];

      if (selectedYear) {
        const matches = financialYears.filter(fy => fy.financialYear === selectedYear);
        yearIdsToFetch = matches.map(fy => fy.id);
      }

      if (financialYearIdFromUrl) {
        const validId = parseInt(financialYearIdFromUrl);
        if (!yearIdsToFetch.includes(validId)) {
          yearIdsToFetch.push(validId);
        }
      }

      if (yearIdsToFetch.length === 0 && selectedYearId) {
        yearIdsToFetch.push(selectedYearId);
      }

      if (yearIdsToFetch.length === 0) {
        setDocuments([]);
        return;
      }

      setDocumentsLoading(true);
      try {
        const promises = yearIdsToFetch.map(id =>
          caDashboardApi.getClientDocuments(
            parseInt(clientIdFromUrl),
            id,
            0,
            1000
          ).catch(err => {
            console.error(`Failed to fetch for FY ID ${id}`, err);
            return null;
          })
        );

        const responses = await Promise.all(promises);

        let allDocs: Document[] = [];

        responses.forEach(response => {
          if (!response) return;

          const mapped: Document[] = response.content.map((doc) => ({
            id: doc.id.toString(),
            clientId: clientIdFromUrl,
            clientName: clientPanFromUrl || 'Client',
            name: doc.fileName,
            type: doc.documentType,
            size: doc.fileSize,
            financialYear: doc.financialYear,
            uploadedAt: doc.uploadedAt,
            status: (doc.status?.toLowerCase() as 'pending' | 'approved' | 'rejected') || (doc.isActive ? 'approved' : 'rejected'),
            fileUrl: doc.fileUrl,
          }));

          allDocs = [...allDocs, ...mapped];
        });

        const uniqueDocs = Array.from(new Map(allDocs.map(item => [item.id, item])).values());
        setDocuments(uniqueDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      } finally {
        setDocumentsLoading(false);
      }
    };

    if (!financialYearsLoading) {
      fetchDocuments();
    }
  }, [clientIdFromUrl, financialYearIdFromUrl, selectedYear, financialYears, financialYearsLoading, clientPanFromUrl]);

  // Handle filing status toggle
  const handleToggleFilingStatus = async () => {
    if (!clientIdFromUrl) {
      toast.error('Client ID not available');
      return;
    }

    setTogglingStatus(true);
    try {
      await caDashboardApi.toggleFilingStatus(parseInt(clientIdFromUrl), selectedYear);
      setIsClientFiled(!isClientFiled);
      toast.success(`Client marked as ${!isClientFiled ? 'Filed' : 'Not Filed'} for FY ${selectedYear}`);
    } catch (error) {
      console.error('Failed to toggle filing status:', error);
      toast.error('Failed to update filing status');
    } finally {
      setTogglingStatus(false);
    }
  };

  // Get document for a specific type
  const getDocumentByType = (docType: string): Document | undefined => {
    return documents.find(doc => doc.type === docType);
  };

  // Handle document type card click
  const handleCardClick = (docType: string) => {
    if (isSelectMode) {
      // Toggle selection
      if (selectedDocTypes.includes(docType)) {
        setSelectedDocTypes(selectedDocTypes.filter(t => t !== docType));
      } else {
        setSelectedDocTypes([...selectedDocTypes, docType]);
      }
    } else {
      // View or upload
      const doc = getDocumentByType(docType);
      if (doc && doc.fileUrl) {
        window.open(doc.fileUrl, '_blank');
      } else {
        // Open upload dialog for this type
        setUploadDocType(docType);
        setUploadDialogOpen(true);
      }
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (docType: string, checked: boolean) => {
    if (checked) {
      setSelectedDocTypes([...selectedDocTypes, docType]);
    } else {
      setSelectedDocTypes(selectedDocTypes.filter(t => t !== docType));
    }
  };

  // Toggle select mode
  const handleToggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedDocTypes([]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!uploadFile || !uploadDocType || !clientIdFromUrl) {
      toast.error('Please select a file');
      return;
    }

    const yearId = selectedYearId || (financialYearIdFromUrl ? parseInt(financialYearIdFromUrl) : null);
    if (!yearId) {
      toast.error('Financial year not available');
      return;
    }

    setUploading(true);
    try {
      await caDashboardApi.uploadClientDocument(
        parseInt(clientIdFromUrl),
        [uploadFile],
        uploadDocType,
        yearId
      );

      toast.success('Document uploaded successfully');
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadDocType('');

      // Refresh documents
      const response = await caDashboardApi.getClientDocuments(
        parseInt(clientIdFromUrl),
        yearId,
        0,
        1000
      );

      const mappedDocs: Document[] = response.content.map((doc) => ({
        id: doc.id.toString(),
        clientId: clientIdFromUrl,
        clientName: clientPanFromUrl || 'Client',
        name: doc.fileName,
        type: doc.documentType,
        size: doc.fileSize,
        financialYear: doc.financialYear,
        uploadedAt: doc.uploadedAt,
        status: (doc.status?.toLowerCase() as 'pending' | 'approved' | 'rejected') || (doc.isActive ? 'approved' : 'rejected'),
        fileUrl: doc.fileUrl,
      }));

      setDocuments(mappedDocs);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  // Handle bulk download
  const handleBulkDownload = () => {
    const docsToDownload = selectedDocTypes
      .map(docType => getDocumentByType(docType))
      .filter((doc): doc is Document => doc !== undefined && !!doc.fileUrl);

    if (docsToDownload.length === 0) {
      toast.error('No uploaded documents selected for download');
      return;
    }

    docsToDownload.forEach((doc, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = doc.fileUrl!;
        link.setAttribute('download', doc.name);
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500);
    });

    toast.success(`Downloading ${docsToDownload.length} document(s)`);
    setSelectedDocTypes([]);
    setIsSelectMode(false);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const docsToDelete = selectedDocTypes
      .map(docType => getDocumentByType(docType))
      .filter((doc): doc is Document => doc !== undefined);

    if (docsToDelete.length === 0) {
      toast.error('No uploaded documents selected for deletion');
      return;
    }

    setDeleteDialogOpen(true);
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    setDeletingDocs(true);
    try {
      const docsToDelete = selectedDocTypes
        .map(docType => getDocumentByType(docType))
        .filter((doc): doc is Document => doc !== undefined);

      // For now, remove from local state (API delete would need to be implemented)
      const idsToDelete = docsToDelete.map(d => d.id);
      setDocuments(documents.filter(d => !idsToDelete.includes(d.id)));

      toast.success(`Deleted ${docsToDelete.length} document(s)`);
      setSelectedDocTypes([]);
      setIsSelectMode(false);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete documents');
    } finally {
      setDeletingDocs(false);
    }
  };

  // Get label for doc type
  const getDocTypeLabel = (key: string): string => {
    return DOCUMENT_TYPES.find(dt => dt.key === key)?.label || key;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filing Status Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">
            {clientPanFromUrl ? `Client: ${clientPanFromUrl}` : 'Manage client documents'}
            {selectedYear && ` • FY ${selectedYear}`}
          </p>
        </div>
        
        {/* Filing Status Toggle */}
        {clientIdFromUrl && (
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2">
              {isClientFiled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-amber-600" />
              )}
              <span className="text-sm font-medium">
                Filing Status:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${!isClientFiled ? 'text-amber-600 font-medium' : 'text-muted-foreground'}`}>
                Not Filed
              </span>
              <Switch
                checked={isClientFiled}
                onCheckedChange={handleToggleFilingStatus}
                disabled={togglingStatus}
              />
              <span className={`text-sm ${isClientFiled ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                Filed
              </span>
              {togglingStatus && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload and Action Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Upload Section */}
            <div className="flex items-center gap-3">
              <span className="text-destructive font-medium">Upload file</span>
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => {
                  setUploadDocType('');
                  setUploadDialogOpen(true);
                }}
              >
                Upload here
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={isSelectMode ? "default" : "outline"}
                size="sm"
                onClick={handleToggleSelectMode}
                className="rounded-full px-6"
              >
                {isSelectMode ? 'Cancel' : 'Select'}
              </Button>
              
              {isSelectMode && selectedDocTypes.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBulkDelete}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBulkDownload}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Type Cards Grid */}
      {documentsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {DOCUMENT_TYPES.map((docType) => {
            const doc = getDocumentByType(docType.key);
            const hasDocument = !!doc;
            const isSelected = selectedDocTypes.includes(docType.key);

            return (
              <div
                key={docType.key}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-95' : 'hover:scale-105'
                }`}
                onClick={() => handleCardClick(docType.key)}
              >
                {/* Checkbox for select mode */}
                {isSelectMode && (
                  <div
                    className="absolute top-2 left-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleCheckboxChange(docType.key, !!checked)}
                      className="bg-background"
                    />
                  </div>
                )}

                {/* Document Card */}
                <Card className={`flex flex-col items-center p-6 transition-all ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                } ${hasDocument ? 'hover:shadow-lg' : 'opacity-80 hover:opacity-100'}`}>
                  {/* PDF Icon */}
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${
                    hasDocument ? 'bg-destructive' : 'bg-muted'
                  }`}>
                    <FileText className={`h-8 w-8 ${hasDocument ? 'text-destructive-foreground' : 'text-muted-foreground'}`} />
                  </div>

                  {/* Document Label */}
                  <p className="text-sm font-medium text-center line-clamp-2">
                    {docType.label}
                  </p>

                  {/* Status indicator */}
                  {hasDocument ? (
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <CheckCircle className="h-3 w-3" />
                      <span>Uploaded</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Upload className="h-3 w-3" />
                      <span>Not uploaded</span>
                    </div>
                  )}

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                    {hasDocument ? (
                      <>
                        <Button size="sm" variant="default" className="w-24" onClick={(e) => {
                          e.stopPropagation();
                          if (doc?.fileUrl) window.open(doc.fileUrl, '_blank');
                        }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="w-24" onClick={(e) => {
                          e.stopPropagation();
                          if (doc?.fileUrl) {
                            const link = document.createElement('a');
                            link.href = doc.fileUrl;
                            link.setAttribute('download', doc.name);
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="default" className="w-24" onClick={(e) => {
                        e.stopPropagation();
                        setUploadDocType(docType.key);
                        setUploadDialogOpen(true);
                      }}>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              {uploadDocType 
                ? `Upload ${getDocTypeLabel(uploadDocType)} document`
                : 'Select document type and upload file'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!uploadDocType && (
              <div className="space-y-2">
                <Label>Document Type *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DOCUMENT_TYPES.map((dt) => (
                    <Button
                      key={dt.key}
                      variant={uploadDocType === dt.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUploadDocType(dt.key)}
                      className="justify-start"
                    >
                      {dt.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>File *</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              {uploadFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadDialogOpen(false);
              setUploadFile(null);
              setUploadDocType('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !uploadFile || !uploadDocType}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Documents</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedDocTypes.length} selected document(s)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingDocs}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={deletingDocs}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingDocs ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
