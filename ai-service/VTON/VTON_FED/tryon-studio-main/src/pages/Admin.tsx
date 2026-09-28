import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Activity,
  RefreshCw,
  Shield,
  BarChart3,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading, isAuthenticated } = useUserRole();
  const { analytics, loading, totalUsers, onlineUsers, refresh } = useAdminAnalytics();

  useEffect(() => {
    if (!roleLoading && !isAuthenticated) {
      navigate('/auth');
    }
    if (!roleLoading && isAuthenticated && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, isAuthenticated, navigate]);

  if (roleLoading || loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6">
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Shield className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Real-time user analytics and activity tracking
            </p>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Online Now
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{onlineUsers}</div>
              <p className="text-xs text-muted-foreground">Active sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Logins
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.reduce((sum, a) => sum + a.total_logins, 0)}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Try-On Uses
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.reduce((sum, a) => sum + a.try_on_count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total generations</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              User Activity
            </CardTitle>
            <CardDescription>
              Real-time tracking of user engagement and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">No users yet</p>
                <p className="text-sm text-muted-foreground">
                  User analytics will appear here when users sign up
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Logins</TableHead>
                      <TableHead className="text-right">Time Spent</TableHead>
                      <TableHead className="text-right">Pages</TableHead>
                      <TableHead className="text-right">Try-Ons</TableHead>
                      <TableHead className="text-right">Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.full_name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_online ? 'default' : 'secondary'}>
                            {user.is_online ? 'Online' : 'Offline'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {user.total_logins}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatDuration(user.total_time_seconds)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {user.pages_visited}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {user.try_on_count}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {user.last_active
                            ? formatDistanceToNow(new Date(user.last_active), { addSuffix: true })
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
