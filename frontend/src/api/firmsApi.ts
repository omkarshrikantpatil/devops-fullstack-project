import { CAFirm, FirmSubscription, MasterAdminStats } from '@/types';
import { mockFirms, mockSubscriptions, mockPlans } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state for mock CRUD operations
let firms = [...mockFirms];
let subscriptions = [...mockSubscriptions];

export const firmsApi = {
  // Get all firms (for Master Admin)
  getAllFirms: async (): Promise<CAFirm[]> => {
    await delay(500);
    return [...firms];
  },

  // Get firm by ID
  getFirmById: async (firmId: string): Promise<CAFirm | null> => {
    await delay(300);
    return firms.find(f => f.id === firmId) || null;
  },

  // Get firm by owner ID
  getFirmByOwnerId: async (ownerId: string): Promise<CAFirm | null> => {
    await delay(300);
    return firms.find(f => f.ownerId === ownerId) || null;
  },

  // Create new firm
  createFirm: async (firm: Omit<CAFirm, 'id' | 'createdAt' | 'clientCount' | 'subUserCount' | 'documentCount'>): Promise<CAFirm> => {
    await delay(500);
    const newFirm: CAFirm = {
      ...firm,
      id: `firm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      clientCount: 0,
      subUserCount: 0,
      documentCount: 0,
    };
    firms.push(newFirm);
    return newFirm;
  },

  // Update firm
  updateFirm: async (firmId: string, updates: Partial<CAFirm>): Promise<CAFirm | null> => {
    await delay(500);
    const index = firms.findIndex(f => f.id === firmId);
    if (index === -1) return null;
    
    firms[index] = { ...firms[index], ...updates };
    return firms[index];
  },

  // Toggle firm active status
  toggleFirmStatus: async (firmId: string): Promise<CAFirm | null> => {
    await delay(300);
    const index = firms.findIndex(f => f.id === firmId);
    if (index === -1) return null;
    
    firms[index].isActive = !firms[index].isActive;
    return firms[index];
  },

  // Get firm subscription
  getFirmSubscription: async (firmId: string): Promise<FirmSubscription | null> => {
    await delay(300);
    const firm = firms.find(f => f.id === firmId);
    if (!firm) return null;
    return subscriptions.find(s => s.id === firm.subscriptionId) || null;
  },

  // Get master admin stats
  getMasterAdminStats: async (): Promise<MasterAdminStats> => {
    await delay(500);
    const activeFirms = firms.filter(f => f.isActive);
    const totalRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, sub) => {
        const plan = mockPlans.find(p => p.id === sub.planId);
        return sum + (plan?.price || 0);
      }, 0);

    const currentMonth = new Date().getMonth();
    const newFirmsThisMonth = firms.filter(f => {
      const firmMonth = new Date(f.createdAt).getMonth();
      return firmMonth === currentMonth;
    }).length;

    return {
      totalFirms: firms.length,
      activeFirms: activeFirms.length,
      totalRevenue,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      newFirmsThisMonth,
    };
  },
};
