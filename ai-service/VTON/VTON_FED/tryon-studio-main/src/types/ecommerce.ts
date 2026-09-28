// E-commerce types

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string;
  tryon_image_url: string | null;
  selected_size: string;
  selected_color: string | null;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string;
  tryon_image_url: string | null;
  price: number;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  mobile: string;
  pincode: string;
  state: string;
  city: string;
  full_address: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  address_id: string | null;
  delivery_name: string;
  delivery_mobile: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_pincode: string;
  delivery_type: 'standard' | 'express';
  payment_method: 'cod' | 'upi' | 'card';
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  status: OrderStatus;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string;
  tryon_image_url: string | null;
  selected_size: string;
  selected_color: string | null;
  quantity: number;
  price: number;
  created_at: string;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface ProductDetails {
  id: string;
  name: string;
  category: string;
  gender: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sizes: string[];
  colors: { name: string; hex: string }[];
  fabric: string;
  fit: string;
  washCare: string;
  occasion: string;
  description: string;
  imageUrl: string;
  tryonImageUrl?: string;
}
