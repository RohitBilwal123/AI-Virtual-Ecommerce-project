import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/try-on" replace />;
  }

  return (
    <Layout>
      <AuthForm />
    </Layout>
  );
}
