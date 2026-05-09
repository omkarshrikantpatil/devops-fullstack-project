// User roles
export type UserRole = 'master_admin' | 'ca' | 'sub_user' | 'client';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  pan?: string;
  firmId?: string; // For CA, Sub-User, Client
  avatar?: string;
  createdAt: string;
  isActive?: boolean;
}

// CA Firm
export interface CAFirm {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ownerId: string; // User ID of the CA owner
  subscriptionId: string;
  isActive: boolean;
  createdAt: string;
  clientCount: number;
  subUserCount: number;
  documentCount: number;
}

// Subscription Plan
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  maxClients: number;
  maxSubUsers: number;
  maxStorage: number; // in GB
  features: string[];
  isActive: boolean;
}

// Firm Subscription
export interface FirmSubscription {
  id: string;
  firmId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

// Client Profile
export interface Client {
  id: string;
  firmId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  mobile: string;
  panNumber: string;
  gstNumber?: string;
  dateOfBirth: string;
  address: string;
  pinCode: string;
  state: string;
  type: 'individual' | 'business';
  status: 'active' | 'inactive';
  createdAt: string;
  assignedSubUsers: string[]; // Sub-user IDs
  // Billing
  billingTotal: number;
  billingDiscount: number;
  billingReceived: number;
  billingPending: number;
}

// Sub-User (CA Staff)
export interface SubUser {
  id: string;
  firmId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  assignedClients: string[]; // Client IDs
  permissions: SubUserPermission[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export type SubUserPermission = 
  | 'view_clients'
  | 'edit_clients'
  | 'view_documents'
  | 'upload_documents'
  | 'delete_documents';

// Document Metadata
export interface Document {
  id: string;
  firmId: string;
  clientId: string;
  name: string;
  type: DocumentType;
  category: string;
  size: number; // in bytes
  uploadedBy: string; // User ID
  uploadedAt: string;
  financialYear: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
}

export type DocumentType = 
  | 'itr'
  | 'gst_return'
  | 'balance_sheet'
  | 'invoice'
  | 'bank_statement'
  | 'pan_card'
  | 'aadhar'
  | 'other';

// Audit Log
export interface AuditLog {
  id: string;
  firmId: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'client' | 'document' | 'sub_user' | 'subscription';
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

// Billing History
export interface BillingRecord {
  id: string;
  firmId: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentDate: string;
  invoiceNumber: string;
  paymentMethod: string;
}

// Dashboard Stats
export interface MasterAdminStats {
  totalFirms: number;
  activeFirms: number;
  totalRevenue: number;
  activeSubscriptions: number;
  newFirmsThisMonth: number;
}

export interface CADashboardStats {
  totalClients: number;
  activeClients: number;
  totalSubUsers: number;
  totalDocuments: number;
  pendingDocuments: number;
  subscriptionStatus: string;
  daysUntilRenewal: number;
}

// Income Tax Filing Stats per Financial Year
export interface ITFilingStats {
  financialYear: string;
  filed: number;
  notFiled: number;
  totalClients: number;
}

// Billing Summary for CA
export interface BillingSummary {
  totalReceived: number;
  totalPending: number;
  financialYear: string;
}

export interface SubUserDashboardStats {
  assignedClients: number;
  totalDocuments: number;
  pendingTasks: number;
}

export interface ClientDashboardStats {
  totalDocuments: number;
  pendingDocuments: number;
  lastUploadDate: string;
}
