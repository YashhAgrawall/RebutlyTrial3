import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/browserClient';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import logo from '@/assets/rebutly-logo.png';

type InviteStatus = 'active' | 'consumed' | 'expired';
type RoomStatus = 'reserved' | 'live' | 'completed' | 'abandoned';
type DebateFormat = 'BP' | 'AP' | 'LD' | 'PF' | 'WSDC';
type MatchMode = 'ranked' | 'unranked';

interface Invite {
  id: string;
  invite_code: string;
  room_id: string;
  created_by_user_id: string;
  created_at: string;
  expires_at: string;
  status: InviteStatus;
  room?: {
    id: string;
    format: DebateFormat;
    mode: MatchMode;
    status: RoomStatus;
  };
  creator?: {
    display_name: string | null;
    username: string | null;
  };
}

const Invite = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchInvite = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('invites')
          .select(`
            *,
            room:debate_rooms (
              id,
              format,
              mode,
              status
            )
          `)
          .eq('invite_code', code)
          .single();

        if (fetchError) throw fetchError;

        // Fetch creator profile separately
        const { data: creatorProfile } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('user_id', data.created_by_user_id)
          .single();

        const inviteData = { ...data, creator: creatorProfile } as Invite;

        // Check if expired
        if (new Date(inviteData.expires_at) < new Date()) {
          setError('This invite has expired');
          // Update status
          await supabase
            .from('invites')
            .update({ status: 'expired' })
            .eq('id', inviteData.id);
        } else if (inviteData.status !== 'active') {
          setError(
            inviteData.status === 'consumed'
              ? 'This invite has already been used'
              : 'This invite is no longer valid'
          );
        } else {
          setInvite(inviteData);
        }
      } catch (err) {
        console.error('Error fetching invite:', err);
        setError('Invite not found');
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [code]);

  const handleJoin = async () => {
    if (!user || !invite) return;

    // Can't join your own invite
    if (invite.created_by_user_id === user.id) {
      toast.error("You can't join your own debate");
      return;
    }

    setJoining(true);
    try {
      // Add as participant
      const { error: participantError } = await supabase
        .from('debate_participants')
        .insert({
          room_id: invite.room_id,
          user_id: user.id,
          is_ai: false,
          role: invite.room?.format === 'LD' ? 'negative' : 'opposition',
          speaking_order: 2,
          connected_at: new Date().toISOString(),
        });

      if (participantError) throw participantError;

      // Update invite status
      await supabase
        .from('invites')
        .update({
          status: 'consumed',
          consumed_at: new Date().toISOString(),
          consumed_by_user_id: user.id,
        })
        .eq('id', invite.id);

      // Update room to live
      await supabase
        .from('debate_rooms')
        .update({
          status: 'live',
          started_at: new Date().toISOString(),
        })
        .eq('id', invite.room_id);

      toast.success('Joined debate!');
      navigate(`/room/${invite.room_id}`);
    } catch (err) {
      console.error('Error joining debate:', err);
      toast.error('Failed to join debate');
    } finally {
      setJoining(false);
    }
  };

  const getTimeRemaining = () => {
    if (!invite) return '';

    const expires = new Date(invite.expires_at).getTime();
    const now = Date.now();
    const diff = expires - now;

    if (diff <= 0) return 'Expired';

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.floor(minutes / 60)} hours`;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <img src={logo} alt="Rebutly.AI" className="w-16 h-16 rounded-xl mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Sign in to join</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to join this debate
          </p>
          <Link to={`/auth?redirect=/invite/${code}`}>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              Sign In / Sign Up
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Invalid Invite</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/play">
            <Button className="w-full">Find a New Match</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!invite) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="Rebutly.AI" className="w-12 h-12 rounded-xl" />
          <div>
            <h1 className="font-display font-bold text-xl">
              Rebutly<span className="text-primary">.AI</span>
            </h1>
          </div>
        </div>

        {/* Invite card */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">You're Invited!</h2>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {invite.creator?.display_name || invite.creator?.username || 'Someone'}
            </span>{' '}
            wants to debate you
          </p>
        </div>

        {/* Room details */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format</span>
            <span className="font-medium">{invite.room?.format}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-medium capitalize">{invite.room?.mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expires in</span>
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {getTimeRemaining()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-gradient-to-r from-primary to-secondary"
          >
            {joining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Join Debate
              </>
            )}
          </Button>
          <Link to="/play">
            <Button variant="ghost" className="w-full">
              Decline & Find Another Match
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Invite;
