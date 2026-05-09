
// Mock imports
const React = { useState: () => { }, useEffect: () => { } };

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

interface Client {
    id: string;
    name: string;
    pan?: string;
}

// Document type labels
const documentTypeLabels: Record<string, string> = {
    // ITR: 'ITR',
    // FORM16: 'Form 16',
    // PAN_CARD: 'PAN Card',
    // AADHAR: 'Aadhar Card',
    // BANK_STATEMENT: 'Bank Statement',
    // INVESTMENT_PROOF: 'Investment Proof',
    // TDS_CERTIFICATE: 'TDS Certificate',
    // GST: 'GST Return',
    // AUDIT_REPORT: 'Audit Report',
    Acknowledgement: 'Acknowledgement',
    Profit_Loss: 'Profit & Loss',
    Statement_of_Total_Income: 'Statement of Total Income',
    Balance_Sheet: 'Balance Sheet',
    Form_26AS: '26AS',
    Tax_Challan: 'Tax Challan',
    OTHER: 'Other',
};
