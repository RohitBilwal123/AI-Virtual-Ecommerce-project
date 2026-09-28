import { Layout } from '@/components/layout/Layout';
import { useTryOnSessions } from '@/hooks/useTryOnSessions';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, ImageIcon, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Gallery() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: sessions, isLoading } = useTryOnSessions();

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your Try-On Gallery
          </h1>
          <p className="mt-2 text-muted-foreground">
            View all your virtual try-on sessions
          </p>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="mt-16 text-center">
            <div className="mx-auto w-fit rounded-full bg-muted p-6">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Sign in to view your gallery</h2>
            <p className="mt-2 text-muted-foreground">
              Your try-on history will appear here after you sign in
            </p>
            <Button className="mt-6 gradient-bg" asChild>
              <Link to="/auth">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <div className="mx-auto w-fit rounded-full bg-muted p-6">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No try-ons yet</h2>
            <p className="mt-2 text-muted-foreground">
              Start creating your virtual try-ons to see them here
            </p>
            <Button className="mt-6 gradient-bg" asChild>
              <Link to="/try-on">
                Try On Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

interface SessionCardProps {
  session: {
    id: string;
    user_image_url: string;
    result_image_url: string | null;
    status: string;
    created_at: string;
    garment?: {
      name: string;
      category: string;
    };
  };
}

function SessionCard({ session }: SessionCardProps) {
  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-600', label: 'Pending' },
    processing: { icon: Loader2, color: 'bg-blue-500/10 text-blue-600', label: 'Processing' },
    completed: { icon: CheckCircle, color: 'bg-green-500/10 text-green-600', label: 'Completed' },
    failed: { icon: XCircle, color: 'bg-red-500/10 text-red-600', label: 'Failed' },
  };

  const status = statusConfig[session.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={session.result_image_url || session.user_image_url}
          alt="Try-on result"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
          <Badge variant="secondary" className={status.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{session.garment?.name || 'Unknown Garment'}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
