import { SubscriptionPlan, FirmSubscription, BillingRecord } from '@/types';
import { mockPlans, mockSubscriptions, mockBillingRecords } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let plans = [...mockPlans];
let subscriptions = [...mockSubscriptions];
let billingRecords = [...mockBillingRecords];

export const plansApi = {
  // Get all plans
  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    await delay(500);
    return [...plans];
  },

  // Get active plans only
  getActivePlans: async (): Promise<SubscriptionPlan[]> => {
    await delay(500);
    return plans.filter(p => p.isActive);
  },

  // Get plan by ID
  getPlanById: async (planId: string): Promise<SubscriptionPlan | null> => {
    await delay(300);
    return plans.find(p => p.id === planId) || null;
  },

  // Create new plan (Master Admin)
  createPlan: async (plan: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> => {
    await delay(500);
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
    };
    plans.push(newPlan);
    return newPlan;
  },

  // Update plan
  updatePlan: async (planId: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> => {
    await delay(500);
    const index = plans.findIndex(p => p.id === planId);
    if (index === -1) return null;
    
    plans[index] = { ...plans[index], ...updates };
    return plans[index];
  },

  // Toggle plan active status
  togglePlanStatus: async (planId: string): Promise<SubscriptionPlan | null> => {
    await delay(300);
    const index = plans.findIndex(p => p.id === planId);
    if (index === -1) return null;
    
    plans[index].isActive = !plans[index].isActive;
    return plans[index];
  },

  // Get subscription by firm ID
  getSubscriptionByFirm: async (firmId: string): Promise<FirmSubscription | null> => {
    await delay(300);
    return subscriptions.find(s => s.firmId === firmId) || null;
  },

  // Update subscription (upgrade/downgrade)
  updateSubscription: async (subscriptionId: string, newPlanId: string): Promise<FirmSubscription | null> => {
    await delay(500);
    const index = subscriptions.findIndex(s => s.id === subscriptionId);
    if (index === -1) return null;
    
    subscriptions[index].planId = newPlanId;
    return subscriptions[index];
  },

  // Get billing history for a firm
  getBillingHistory: async (firmId: string): Promise<BillingRecord[]> => {
    await delay(500);
    return billingRecords.filter(b => b.firmId === firmId);
  },

  // Get all billing records (Master Admin)
  getAllBillingRecords: async (): Promise<BillingRecord[]> => {
    await delay(500);
    return [...billingRecords];
  },
};
