import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserAnalytics } from '@/types';

export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name');

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setAnalytics([]);
        setTotalUsers(0);
        setOnlineUsers(0);
        setLoading(false);
        return;
      }

      // Fetch all sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id, login_time, logout_time, session_duration_seconds, is_active');

      if (sessionsError) throw sessionsError;

      // Fetch all activity logs
      const { data: activityLogs, error: logsError } = await supabase
        .from('user_activity_logs')
        .select('user_id, action, page, created_at');

      if (logsError) throw logsError;

      // Aggregate data per user
      const analyticsMap: Record<string, UserAnalytics> = {};

      profiles.forEach((profile) => {
        analyticsMap[profile.user_id] = {
          user_id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name,
          total_logins: 0,
          total_time_seconds: 0,
          last_active: null,
          pages_visited: 0,
          try_on_count: 0,
          is_online: false,
        };
      });

      // Process sessions
      sessions?.forEach((session) => {
        if (analyticsMap[session.user_id]) {
          analyticsMap[session.user_id].total_logins += 1;
          analyticsMap[session.user_id].total_time_seconds += session.session_duration_seconds || 0;
          
          if (session.is_active) {
            analyticsMap[session.user_id].is_online = true;
          }

          const sessionTime = session.logout_time || session.login_time;
          if (!analyticsMap[session.user_id].last_active || 
              new Date(sessionTime) > new Date(analyticsMap[session.user_id].last_active!)) {
            analyticsMap[session.user_id].last_active = sessionTime;
          }
        }
      });

      // Process activity logs
      activityLogs?.forEach((log) => {
        if (analyticsMap[log.user_id]) {
          if (log.action === 'PAGE_VIEW') {
            analyticsMap[log.user_id].pages_visited += 1;
          }
          if (log.action === 'TRY_ON_GENERATE') {
            analyticsMap[log.user_id].try_on_count += 1;
          }

          if (!analyticsMap[log.user_id].last_active || 
              new Date(log.created_at) > new Date(analyticsMap[log.user_id].last_active!)) {
            analyticsMap[log.user_id].last_active = log.created_at;
          }
        }
      });

      const analyticsArray = Object.values(analyticsMap);
      const online = analyticsArray.filter(a => a.is_online).length;

      setAnalytics(analyticsArray);
      setTotalUsers(analyticsArray.length);
      setOnlineUsers(online);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up realtime subscriptions
  useEffect(() => {
    fetchAnalytics();

    // Subscribe to realtime updates
    const sessionsChannel = supabase
      .channel('admin-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_sessions' },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    const activityChannel = supabase
      .channel('admin-activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_activity_logs' },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(activityChannel);
    };
  }, [fetchAnalytics]);

  return { analytics, loading, totalUsers, onlineUsers, refresh: fetchAnalytics };
}
