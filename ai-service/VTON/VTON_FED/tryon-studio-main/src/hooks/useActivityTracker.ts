import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ActivityAction } from '@/types';

export function useActivityTracker() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const sessionIdRef = useRef<string | null>(null);
  const loginTimeRef = useRef<Date | null>(null);

  // Log an activity
  const logActivity = useCallback(async (action: ActivityAction, page?: string, metadata?: Record<string, any>) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          action,
          page: page || location.pathname,
          metadata: metadata || null,
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, [user, location.pathname]);

  // Start a new session on login
  const startSession = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          login_time: new Date().toISOString(),
          is_active: true,
        })
        .select('id')
        .single();

      if (error) throw error;
      
      sessionIdRef.current = data.id;
      loginTimeRef.current = new Date();

      // Log login activity
      await logActivity('LOGIN');
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [user, logActivity]);

  // End current session
  const endSession = useCallback(async (isUnload = false) => {
    if (!sessionIdRef.current || !user) return;

    const sessionId = sessionIdRef.current;
    const loginTime = loginTimeRef.current;
    const logoutTime = new Date();
    const durationSeconds = loginTime 
      ? Math.floor((logoutTime.getTime() - loginTime.getTime()) / 1000) 
      : 0;

    try {
      // Use sendBeacon for unload events for reliability
      if (isUnload && navigator.sendBeacon) {
        const payload = JSON.stringify({
          sessionId,
          userId: user.id,
          logoutTime: logoutTime.toISOString(),
          durationSeconds,
        });
        navigator.sendBeacon(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/end-session`,
          payload
        );
      } else {
        await supabase
          .from('user_sessions')
          .update({
            logout_time: logoutTime.toISOString(),
            session_duration_seconds: durationSeconds,
            is_active: false,
          })
          .eq('id', sessionId);

        // Log logout activity
        await logActivity('LOGOUT');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      sessionIdRef.current = null;
      loginTimeRef.current = null;
    }
  }, [user, logActivity]);

  // Track page views
  useEffect(() => {
    if (isAuthenticated && user) {
      logActivity('PAGE_VIEW', location.pathname);
    }
  }, [location.pathname, isAuthenticated, user, logActivity]);

  // Handle session lifecycle
  useEffect(() => {
    if (isAuthenticated && user && !sessionIdRef.current) {
      startSession();
    }

    // Handle tab close / unload
    const handleBeforeUnload = () => {
      endSession(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionIdRef.current) {
        // Update session when tab becomes hidden (potential close)
        endSession(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, startSession, endSession]);

  return { logActivity, endSession };
}
