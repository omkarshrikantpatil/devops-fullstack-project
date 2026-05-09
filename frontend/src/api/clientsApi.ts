import { Client } from '@/types';
import { mockClients } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let clients = [...mockClients];

export const clientsApi = {
  // Get all clients for a firm
  getClientsByFirm: async (firmId: string): Promise<Client[]> => {
    await delay(500);
    return clients.filter(c => c.firmId === firmId);
  },

  // Get clients assigned to a sub-user
  getClientsBySubUser: async (subUserId: string): Promise<Client[]> => {
    await delay(500);
    return clients.filter(c => c.assignedSubUsers.includes(subUserId));
  },

  // Get client by ID
  getClientById: async (clientId: string): Promise<Client | null> => {
    await delay(300);
    return clients.find(c => c.id === clientId) || null;
  },

  // Get client by user ID
  getClientByUserId: async (userId: string): Promise<Client | null> => {
    await delay(300);
    return clients.find(c => c.userId === userId) || null;
  },

  // Create new client
  createClient: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    await delay(500);
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    clients.push(newClient);
    return newClient;
  },

  // Update client
  updateClient: async (clientId: string, updates: Partial<Client>): Promise<Client | null> => {
    await delay(500);
    const index = clients.findIndex(c => c.id === clientId);
    if (index === -1) return null;
    
    clients[index] = { ...clients[index], ...updates };
    return clients[index];
  },

  // Delete client
  deleteClient: async (clientId: string): Promise<boolean> => {
    await delay(500);
    const index = clients.findIndex(c => c.id === clientId);
    if (index === -1) return false;
    
    clients.splice(index, 1);
    return true;
  },

  // Toggle client status
  toggleClientStatus: async (clientId: string): Promise<Client | null> => {
    await delay(300);
    const index = clients.findIndex(c => c.id === clientId);
    if (index === -1) return null;
    
    clients[index].status = clients[index].status === 'active' ? 'inactive' : 'active';
    return clients[index];
  },

  // Assign sub-user to client
  assignSubUser: async (clientId: string, subUserId: string): Promise<Client | null> => {
    await delay(300);
    const index = clients.findIndex(c => c.id === clientId);
    if (index === -1) return null;
    
    if (!clients[index].assignedSubUsers.includes(subUserId)) {
      clients[index].assignedSubUsers.push(subUserId);
    }
    return clients[index];
  },

  // Remove sub-user from client
  removeSubUser: async (clientId: string, subUserId: string): Promise<Client | null> => {
    await delay(300);
    const index = clients.findIndex(c => c.id === clientId);
    if (index === -1) return null;
    
    clients[index].assignedSubUsers = clients[index].assignedSubUsers.filter(id => id !== subUserId);
    return clients[index];
  },
};
