import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Order, OrderItem, Address } from '@/types/ecommerce';
import { toast } from 'sonner';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const allOrders = JSON.parse(localStorage.getItem('aurafit_orders') || '{}');
    const userOrders = user ? (allOrders[user.id] || []) : [];

    setOrders(userOrders);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const createOrder = async (
    orderData: any,
    items: any[]
  ) => {
    if (!user) {
      toast.error('Please sign in to place order');
      return null;
    }

    const allOrders = JSON.parse(localStorage.getItem('aurafit_orders') || '{}');
    const userOrders = allOrders[user.id] || [];

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      order_number: generateOrderNumber(),
      ...orderData,
      items: items.map(item => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'placed'
    };

    userOrders.push(newOrder);
    allOrders[user.id] = userOrders;
    localStorage.setItem('aurafit_orders', JSON.stringify(allOrders));

    await fetchOrders();
    toast.success('Order placed successfully!');
    return newOrder;
  };

  return {
    orders,
    loading,
    createOrder,
    refetch: fetchOrders,
  };
}
