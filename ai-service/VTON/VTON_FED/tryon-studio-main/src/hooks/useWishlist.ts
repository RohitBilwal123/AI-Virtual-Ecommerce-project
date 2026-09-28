import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { WishlistItem } from '@/types/ecommerce';
import { toast } from 'sonner';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlistItems(data as WishlistItem[]);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return false;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          ...item,
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('Item already in wishlist');
          return false;
        }
        throw error;
      }

      await fetchWishlist();
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchWishlist();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlist,
  };
}
