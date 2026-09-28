export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Garment {
  id: string;
  name: string;
  category: string;
  image_url: string;
  price: number;
  description: string | null;
  color: string | null;
  size: string | null;
  created_at: string;
}

export interface TryOnSession {
  id: string;
  user_id: string;
  garment_id: string;
  user_image_url: string;
  result_image_url: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  garment?: Garment;
}

export type AppRole = 'admin' | 'moderator' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  login_time: string;
  logout_time: string | null;
  session_duration_seconds: number | null;
  is_active: boolean;
  created_at: string;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  action: string;
  page: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export type ActivityAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'PAGE_VIEW'
  | 'TRY_ON_GENERATE'
  | 'ADD_TO_CART'
  | 'GARMENT_SELECT'
  | 'IMAGE_UPLOAD';

export interface UserAnalytics {
  user_id: string;
  email: string | null;
  full_name: string | null;
  total_logins: number;
  total_time_seconds: number;
  last_active: string | null;
  pages_visited: number;
  try_on_count: number;
  is_online: boolean;
}
