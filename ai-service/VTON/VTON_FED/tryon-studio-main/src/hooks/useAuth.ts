import { useAuthContext, LocalUser } from '@/contexts/AuthContext';

export type { LocalUser };

export function useAuth() {
  return useAuthContext();
}
