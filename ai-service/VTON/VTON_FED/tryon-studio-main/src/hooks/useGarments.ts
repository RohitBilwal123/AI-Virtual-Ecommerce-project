import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Garment } from '@/types';

export function useGarments(category?: string) {
  return useQuery({
    queryKey: ['garments', category],
    queryFn: async (): Promise<Garment[]> => {
      let query = supabase.from('garments').select('*').order('created_at', { ascending: false });
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Garment[];
    },
  });
}

export function useGarment(id: string | undefined) {
  return useQuery({
    queryKey: ['garment', id],
    queryFn: async (): Promise<Garment | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('garments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Garment;
    },
    enabled: !!id,
  });
}
