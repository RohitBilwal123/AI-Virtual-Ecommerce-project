import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AppRole } from '@/types';

export function useUserRole() {
  const { user, isAuthenticated } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        const userRole = (data?.role as AppRole) || 'user';
        setRole(userRole);
        setIsAdmin(userRole === 'admin');
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setRole('user');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user]);

  return { role, isAdmin, loading, isAuthenticated };
}
