import { AuditLog } from '@/types';
import { mockAuditLogs } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let auditLogs = [...mockAuditLogs];

export const auditApi = {
  // Get audit logs for a firm
  getAuditLogsByFirm: async (firmId: string): Promise<AuditLog[]> => {
    await delay(500);
    return auditLogs
      .filter(log => log.firmId === firmId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // Get audit logs by user
  getAuditLogsByUser: async (userId: string): Promise<AuditLog[]> => {
    await delay(500);
    return auditLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // Create new audit log entry
  createAuditLog: async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> => {
    await delay(300);
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    auditLogs.unshift(newLog);
    return newLog;
  },

  // Get recent activity (last N entries)
  getRecentActivity: async (firmId: string, limit: number = 10): Promise<AuditLog[]> => {
    await delay(300);
    return auditLogs
      .filter(log => log.firmId === firmId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
};
