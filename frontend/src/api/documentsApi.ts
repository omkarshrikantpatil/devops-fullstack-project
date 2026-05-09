import { Document } from '@/types';
import { mockDocuments } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let documents = [...mockDocuments];

export const documentsApi = {
  // Get all documents for a firm
  getDocumentsByFirm: async (firmId: string): Promise<Document[]> => {
    await delay(500);
    return documents.filter(d => d.firmId === firmId);
  },

  // Get documents for a client
  getDocumentsByClient: async (clientId: string): Promise<Document[]> => {
    await delay(500);
    return documents.filter(d => d.clientId === clientId);
  },

  // Get documents for multiple clients (for sub-users)
  getDocumentsByClients: async (clientIds: string[]): Promise<Document[]> => {
    await delay(500);
    return documents.filter(d => clientIds.includes(d.clientId));
  },

  // Get document by ID
  getDocumentById: async (documentId: string): Promise<Document | null> => {
    await delay(300);
    return documents.find(d => d.id === documentId) || null;
  },

  // Create new document (metadata only)
  createDocument: async (document: Omit<Document, 'id' | 'uploadedAt'>): Promise<Document> => {
    await delay(500);
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    documents.push(newDocument);
    return newDocument;
  },

  // Update document
  updateDocument: async (documentId: string, updates: Partial<Document>): Promise<Document | null> => {
    await delay(500);
    const index = documents.findIndex(d => d.id === documentId);
    if (index === -1) return null;
    
    documents[index] = { ...documents[index], ...updates };
    return documents[index];
  },

  // Delete document
  deleteDocument: async (documentId: string): Promise<boolean> => {
    await delay(500);
    const index = documents.findIndex(d => d.id === documentId);
    if (index === -1) return false;
    
    documents.splice(index, 1);
    return true;
  },

  // Update document status
  updateDocumentStatus: async (documentId: string, status: Document['status']): Promise<Document | null> => {
    await delay(300);
    const index = documents.findIndex(d => d.id === documentId);
    if (index === -1) return null;
    
    documents[index].status = status;
    return documents[index];
  },

  // Get document stats for a firm
  getDocumentStats: async (firmId: string): Promise<{ total: number; pending: number; approved: number; rejected: number }> => {
    await delay(300);
    const firmDocs = documents.filter(d => d.firmId === firmId);
    return {
      total: firmDocs.length,
      pending: firmDocs.filter(d => d.status === 'pending').length,
      approved: firmDocs.filter(d => d.status === 'approved').length,
      rejected: firmDocs.filter(d => d.status === 'rejected').length,
    };
  },
};
