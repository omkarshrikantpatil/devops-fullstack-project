const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
const AUTH_TOKEN_KEY = 'ca_platform_token';

const getAuthHeaders = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export interface BillingSummary {
  totalBilling: number;
  totalReceived: number;
  totalPending: number;
}

// Client Billing interfaces
export interface ClientBilling {
  id: number;
  clientId: number;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface BillingFormData {
  clientId: number;
  totalAmount: number;
  discountAmount: number;
}

// Payment interfaces
export interface Payment {
  id: number;
  billingId: number;
  amountReceived: number;
  paymentDate: string;
  paymentMode: string;
  referenceNo: string;
  createdAt: string;
}

export interface PaymentFormData {
  amountReceived: number;
  paymentDate: string;
  paymentMode: string;
  referenceNo: string;
}

export interface FilingSummary {
  userId: number;
  financialYear: string;
  totalClients: number;
  filedClients: number;
  notFiledClients: number;
}

export interface FilingClient {
  id: number;
  clientType: string;
  email: string;
  fullName: string;
  mobile: string;
  pan: string;
}

// Financial Year interface
export interface FinancialYear {
  id: number;
  financialYear: string;
  current: boolean;
}

// Client Document interfaces
export interface ClientDocument {
  id: number;
  fileName: string;
  mimeType: string;
  documentType: string;
  fileUrl: string;
  isActive: boolean;
  status: string;
  financialYear: string;
  uploadedAt: string;
  fileSize: number;
}

export interface ClientDocumentsResponse {
  content: ClientDocument[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiClient {
  id: number;
  name: string;
  pan: string;
  mobile: string;
  email: string;
  clientType: string;
  status: boolean;
  billingTotal: number;
  billingReceived: number;
  billingPending: number;
}

export interface ClientFormData {
  name: string;
  dateOfBirth: string;
  pan: string;
  gstNumber: string;
  clientType: string;
  telephone: string;
  mobile: string;
  email: string;
  address: string;
  pinCode: string;
  state: string;
  status: boolean;
}

export interface ClientsResponse {
  content: ApiClient[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const caDashboardApi = {
  getClientCount: async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch client count');
    }

    const data = await response.text();
    return parseInt(data, 10);
  },

  getActiveClientCount: async (): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients/active/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch active client count');
    }

    const data = await response.json();
    return data.activeClientCount;
  },

  getBillingSummary: async (): Promise<BillingSummary> => {
    const response = await fetch(`${API_BASE_URL}/ca/dashboard/billing-summary`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch billing summary');
    }

    return response.json();
  },

  getClients: async (): Promise<ClientsResponse> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }

    return response.json();
  },

  createClient: async (clientData: ClientFormData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create client');
    }

    // API may return empty response on success
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        // Response is not JSON, but request succeeded
      }
    }
  },

  updateClient: async (clientId: number, clientData: ClientFormData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients/${clientId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update client');
    }

    // API may return empty response on success
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        // Response is not JSON, but request succeeded
      }
    }
  },

  getClientById: async (clientId: number): Promise<ClientFormData> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients/${clientId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch client details');
    }

    return response.json();
  },

  getFilingSummary: async (financialYear: string): Promise<FilingSummary> => {
    const response = await fetch(`${API_BASE_URL}/api/clients/summary?financialYear=${financialYear}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch filing summary');
    }

    return response.json();
  },

  getFiledClients: async (financialYear: string): Promise<FilingClient[]> => {
    const response = await fetch(`${API_BASE_URL}/api/clients/filed?financialYear=${financialYear}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch filed clients');
    }

    return response.json();
  },

  getNotFiledClients: async (financialYear: string): Promise<FilingClient[]> => {
    const response = await fetch(`${API_BASE_URL}/api/clients/not-filed?financialYear=${financialYear}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch not filed clients');
    }

    return response.json();
  },

  toggleFilingStatus: async (clientId: number, financialYear: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/toggle-filing?financialYear=${financialYear}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle filing status');
    }
  },

  checkClientFilingStatus: async (pan: string, financialYear: string): Promise<boolean> => {
    try {
      const filedClients = await caDashboardApi.getFiledClients(financialYear);
      return filedClients.some(client => client.pan === pan);
    } catch {
      return false;
    }
  },

  // ========== Billing APIs ==========

  // Get billing details for a client
  getClientBilling: async (clientId: number): Promise<ClientBilling | null> => {
    const response = await fetch(`${API_BASE_URL}/ca/billing/client/${clientId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No billing record exists yet
      }
      throw new Error('Failed to fetch client billing');
    }

    return response.json();
  },

  // Create or update billing for a client
  saveBilling: async (billingData: BillingFormData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ca/billing`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(billingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to save billing');
    }
  },

  // ========== Payment APIs ==========

  // Get all payments for a billing record
  getPayments: async (billingId: number): Promise<Payment[]> => {
    const response = await fetch(`${API_BASE_URL}/ca/payments/${billingId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No payments exist yet
      }
      throw new Error('Failed to fetch payments');
    }

    return response.json();
  },

  // Add a new payment
  addPayment: async (billingId: number, paymentData: PaymentFormData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ca/payments/${billingId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to add payment');
    }
  },

  // ========== Financial Year APIs ==========

  getClientFinancialYears: async (): Promise<FinancialYear[]> => {
    const response = await fetch(`${API_BASE_URL}/api/client-financial-years`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch financial years');
    }

    return response.json();
  },

  // ========== Client Documents APIs ==========

  getClientDocuments: async (
    clientId: number,
    financialYearId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ClientDocumentsResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/ca/clients/${clientId}/documents?financialYearId=${financialYearId}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch client documents');
    }

    return response.json();
  },

  uploadClientDocument: async (
    clientId: number,
    files: File[],
    documentType: string,
    financialYearId: number
  ): Promise<void> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('documentType', documentType);
    formData.append('financialYearId', financialYearId.toString());

    const response = await fetch(`${API_BASE_URL}/ca/clients/${clientId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload document');
    }
  },

  updateClientDocument: async (
    clientId: number,
    documentId: string,
    data: { fileName: string; status: string }
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ca/clients/${clientId}/documents/${documentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update document');
    }
  },
};
