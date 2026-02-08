import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Clock,
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/browserClient';
import { Button } from '@/components/ui/button';
import logo from '@/assets/rebutly-logo.png';

interface QueueEntry {
  id: string;
  user_id: string;
  format: string;
  mode: string;
  region: string;
  elo: number;
  status: string;
  joined_at: string;
  last_heartbeat_at: string;
  profile?: {
    username: string | null;
    display_name: string | null;
  };
}

interface RecentMatch {
  id: string;
  format: string;
  mode: string;
  status: string;
  is_ai_opponent: boolean;
  created_at: string;
  ended_at: string | null;
  participant_count: number;
}

interface Stats {
  activeQueueCount: number;
  matchesToday: number;
  avgWaitTime: number;
  queueByFormat: Record<string, number>;
}

const AdminMatchmaking = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeQueueCount: 0,
    matchesToday: 0,
    avgWaitTime: 0,
    queueByFormat: {},
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (data) {
        setIsAdmin(true);
        await fetchData();
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Fetch active queue entries
      const { data: queueData } = await supabase
        .from('match_queue_entries')
        .select('*')
        .eq('status', 'waiting')
        .order('joined_at', { ascending: true });

      if (queueData) {
        // Fetch profiles for queue entries
        const userIds = queueData.map(e => e.user_id);
        let profilesMap: Record<string, any> = {};
        
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, username, display_name')
            .in('user_id', userIds);
          
          if (profiles) {
            profilesMap = profiles.reduce((acc, p) => ({ ...acc, [p.user_id]: p }), {});
          }
        }
        
        const entriesWithProfiles = queueData.map(e => ({
          ...e,
          profile: profilesMap[e.user_id],
        }));
        setQueueEntries(entriesWithProfiles as QueueEntry[]);
      }

      // Fetch recent matches
      const { data: roomsData } = await supabase
        .from('debate_rooms')
        .select('*, participants:debate_participants(count)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (roomsData) {
        setRecentMatches(
          roomsData.map((r) => ({
            ...r,
            participant_count: (r.participants as any)?.[0]?.count || 0,
          })) as RecentMatch[]
        );
      }

      // Calculate stats
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: matchesToday } = await supabase
        .from('debate_rooms')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      // Queue by format
      const queueByFormat: Record<string, number> = {};
      queueData?.forEach((entry) => {
        queueByFormat[entry.format] = (queueByFormat[entry.format] || 0) + 1;
      });

      setStats({
        activeQueueCount: queueData?.length || 0,
        matchesToday: matchesToday || 0,
        avgWaitTime: 0, // Would need more complex calculation
        queueByFormat,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWaitTime = (joinedAt: string) => {
    const seconds = Math.floor((Date.now() - new Date(joinedAt).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Rebutly.AI" className="w-8 h-8 rounded-lg" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-lg">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Matchmaking Overview</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeQueueCount}</p>
                <p className="text-sm text-muted-foreground">In Queue</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.matchesToday}</p>
                <p className="text-sm text-muted-foreground">Matches Today</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:col-span-2"
          >
            <p className="text-sm text-muted-foreground mb-2">Queue by Format</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.queueByFormat).map(([format, count]) => (
                <span
                  key={format}
                  className="px-2 py-1 rounded bg-muted text-sm"
                >
                  {format}: {count}
                </span>
              ))}
              {Object.keys(stats.queueByFormat).length === 0 && (
                <span className="text-muted-foreground">No active queue</span>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Queue ({queueEntries.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {queueEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No one in queue
                </p>
              ) : (
                queueEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                        {(entry.profile?.display_name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {entry.profile?.display_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.format} • {entry.mode} • ELO {entry.elo}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">{getWaitTime(entry.joined_at)}</p>
                      <p className="text-xs text-muted-foreground">{entry.region}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Matches
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentMatches.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recent matches
                </p>
              ) : (
                recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          match.status === 'live'
                            ? 'bg-success animate-pulse'
                            : match.status === 'completed'
                            ? 'bg-primary'
                            : match.status === 'abandoned'
                            ? 'bg-destructive'
                            : 'bg-muted-foreground'
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {match.format} • {match.mode}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {match.is_ai_opponent ? 'AI Match' : 'Human vs Human'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm capitalize">{match.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(match.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminMatchmaking;
