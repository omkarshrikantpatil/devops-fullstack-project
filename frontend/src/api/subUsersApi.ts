import { SubUser } from '@/types';
import { mockSubUsers } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let subUsers = [...mockSubUsers];

export const subUsersApi = {
  // Get all sub-users for a firm
  getSubUsersByFirm: async (firmId: string): Promise<SubUser[]> => {
    await delay(500);
    return subUsers.filter(s => s.firmId === firmId);
  },

  // Get sub-user by ID
  getSubUserById: async (subUserId: string): Promise<SubUser | null> => {
    await delay(300);
    return subUsers.find(s => s.id === subUserId) || null;
  },

  // Get sub-user by user ID
  getSubUserByUserId: async (userId: string): Promise<SubUser | null> => {
    await delay(300);
    return subUsers.find(s => s.userId === userId) || null;
  },

  // Create new sub-user
  createSubUser: async (subUser: Omit<SubUser, 'id' | 'createdAt'>): Promise<SubUser> => {
    await delay(500);
    const newSubUser: SubUser = {
      ...subUser,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    subUsers.push(newSubUser);
    return newSubUser;
  },

  // Update sub-user
  updateSubUser: async (subUserId: string, updates: Partial<SubUser>): Promise<SubUser | null> => {
    await delay(500);
    const index = subUsers.findIndex(s => s.id === subUserId);
    if (index === -1) return null;
    
    subUsers[index] = { ...subUsers[index], ...updates };
    return subUsers[index];
  },

  // Delete sub-user
  deleteSubUser: async (subUserId: string): Promise<boolean> => {
    await delay(500);
    const index = subUsers.findIndex(s => s.id === subUserId);
    if (index === -1) return false;
    
    subUsers.splice(index, 1);
    return true;
  },

  // Toggle sub-user status
  toggleSubUserStatus: async (subUserId: string): Promise<SubUser | null> => {
    await delay(300);
    const index = subUsers.findIndex(s => s.id === subUserId);
    if (index === -1) return null;
    
    subUsers[index].status = subUsers[index].status === 'active' ? 'inactive' : 'active';
    return subUsers[index];
  },

  // Assign client to sub-user
  assignClient: async (subUserId: string, clientId: string): Promise<SubUser | null> => {
    await delay(300);
    const index = subUsers.findIndex(s => s.id === subUserId);
    if (index === -1) return null;
    
    if (!subUsers[index].assignedClients.includes(clientId)) {
      subUsers[index].assignedClients.push(clientId);
    }
    return subUsers[index];
  },

  // Remove client from sub-user
  removeClient: async (subUserId: string, clientId: string): Promise<SubUser | null> => {
    await delay(300);
    const index = subUsers.findIndex(s => s.id === subUserId);
    if (index === -1) return null;
    
    subUsers[index].assignedClients = subUsers[index].assignedClients.filter(id => id !== clientId);
    return subUsers[index];
  },
};
