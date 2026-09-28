import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { CartItem } from '@/types/ecommerce';
import { toast } from 'sonner';

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    const allCarts = JSON.parse(localStorage.getItem('aurafit_carts') || '{}');
    const userCart = user ? (allCarts[user.id] || []) : [];

    setCartItems(userCart);
    setCartCount(userCart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item: any) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return false;
    }

    const allCarts = JSON.parse(localStorage.getItem('aurafit_carts') || '{}');
    const userCart = allCarts[user.id] || [];

    const existingItemIndex = userCart.findIndex((i: any) =>
      i.product_name === item.product_name && i.selected_size === item.selected_size
    );

    if (existingItemIndex > -1) {
      userCart[existingItemIndex].quantity += item.quantity;
    } else {
      userCart.push({
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        ...item,
        created_at: new Date().toISOString()
      });
    }

    allCarts[user.id] = userCart;
    localStorage.setItem('aurafit_carts', JSON.stringify(allCarts));

    await fetchCart();
    toast.success('Added to cart successfully');
    return true;
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    if (quantity < 1) return removeFromCart(itemId);

    const allCarts = JSON.parse(localStorage.getItem('aurafit_carts') || '{}');
    const userCart = allCarts[user.id] || [];

    const itemIndex = userCart.findIndex((i: any) => i.id === itemId);
    if (itemIndex > -1) {
      userCart[itemIndex].quantity = quantity;
      allCarts[user.id] = userCart;
      localStorage.setItem('aurafit_carts', JSON.stringify(allCarts));
      await fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    const allCarts = JSON.parse(localStorage.getItem('aurafit_carts') || '{}');
    const userCart = allCarts[user.id] || [];

    const newUserCart = userCart.filter((i: any) => i.id !== itemId);
    allCarts[user.id] = newUserCart;
    localStorage.setItem('aurafit_carts', JSON.stringify(allCarts));

    await fetchCart();
    toast.success('Item removed from cart');
  };

  const clearCart = async () => {
    if (!user) return;
    const allCarts = JSON.parse(localStorage.getItem('aurafit_carts') || '{}');
    allCarts[user.id] = [];
    localStorage.setItem('aurafit_carts', JSON.stringify(allCarts));

    setCartItems([]);
    setCartCount(0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    refetch: fetchCart,
  };
}
