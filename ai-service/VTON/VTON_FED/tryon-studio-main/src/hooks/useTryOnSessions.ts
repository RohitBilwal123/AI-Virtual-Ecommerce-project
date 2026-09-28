import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { TryOnSession } from '@/types';

export function useTryOnSessions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['try-on-sessions', user?.id],
    queryFn: async (): Promise<TryOnSession[]> => {
      if (!user) return [];
      const allSessions = JSON.parse(localStorage.getItem('aurafit_tryons') || '{}');
      return allSessions[user.id] || [];
    },
    enabled: !!user
  });
}

export function useCreateTryOnSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      garmentId,
      userImageUrl,
      tryonImageUrl,
    }: {
      garmentId: string;
      userImageUrl: string;
      tryonImageUrl?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const allSessions = JSON.parse(localStorage.getItem('aurafit_tryons') || '{}');
      const userSessions = allSessions[user.id] || [];

      const newSession = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        garment_id: garmentId,
        user_image_url: userImageUrl,
        tryon_image_url: tryonImageUrl,
        status: tryonImageUrl ? 'completed' : 'pending',
        created_at: new Date().toISOString()
      };

      userSessions.unshift(newSession);
      allSessions[user.id] = userSessions;
      localStorage.setItem('aurafit_tryons', JSON.stringify(allSessions));

      return newSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['try-on-sessions', user?.id] });
    },
  });
}
