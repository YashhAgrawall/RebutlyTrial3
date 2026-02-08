import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  /** If true, only allow unauthenticated users (redirect authenticated to redirectTo) */
  requireGuest?: boolean;
  /** Where to redirect if guard condition fails */
  redirectTo?: string;
}

/**
 * AuthGuard component for protecting routes based on authentication state
 * 
 * Usage:
 * - <AuthGuard> - Requires authentication, redirects to /auth if not logged in
 * - <AuthGuard requireGuest redirectTo="/play"> - Only for guests, redirects to /play if logged in
 */
export const AuthGuard = ({ 
  children, 
  requireGuest = false,
  redirectTo
}: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (requireGuest) {
      // Guest-only route: redirect authenticated users away
      if (user) {
        navigate(redirectTo || '/play', { replace: true });
      }
    } else {
      // Protected route: redirect unauthenticated users to auth
      if (!user) {
        navigate(redirectTo || '/auth', { replace: true });
      }
    }
  }, [user, loading, requireGuest, redirectTo, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // For guest routes, only render if not authenticated
  if (requireGuest && user) {
    return null;
  }

  // For protected routes, only render if authenticated
  if (!requireGuest && !user) {
    return null;
  }

  return <>{children}</>;
};
