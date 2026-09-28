import { createContext, useContext, ReactNode } from 'react';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { ActivityAction } from '@/types';

interface ActivityContextType {
  logActivity: (action: ActivityAction, page?: string, metadata?: Record<string, any>) => Promise<void>;
  endSession: (isUnload?: boolean) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const tracker = useActivityTracker();

  return (
    <ActivityContext.Provider value={tracker}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
