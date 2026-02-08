import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  Zap,
  Clock,
  Users,
  Bot,
  ArrowLeft,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/browserClient';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import logo from '@/assets/rebutly-logo.png';

type DebateFormat = 'BP' | 'AP' | 'LD' | 'PF' | 'WSDC';
type MatchMode = 'ranked' | 'unranked';

interface MatchHistoryRecord {
  id: string;
  room_id: string;
  user_a_id: string;
  user_b_id: string | null;
  format: DebateFormat;
  mode: MatchMode;
  played_at: string;
  winner_user_id: string | null;
  is_draw: boolean;
  rating_before_a: number | null;
  rating_after_a: number | null;
  rating_before_b: number | null;
  rating_after_b: number | null;
  duration_seconds: number | null;
}

interface Room {
  id: string;
  format: DebateFormat;
  mode: MatchMode;
  is_ai_opponent: boolean;
  created_at: string;
  ended_at: string | null;
  ended_reason: string | null;
}

interface Participant {
  id: string;
  user_id: string | null;
  is_ai: boolean;
  role: string | null;
  profile?: {
    display_name: string | null;
    elo_by_format: Record<string, number>;
  };
}

const RoomResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryRecord | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [rematchCopied, setRematchCopied] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const fetchResults = async () => {
      try {
        // Fetch room
        const { data: roomData, error: roomError } = await supabase
          .from('debate_rooms')
          .select('*')
          .eq('id', id)
          .single();

        if (roomError) throw roomError;
        setRoom(roomData as Room);

        // Fetch participants
        const { data: participantsData } = await supabase
          .from('debate_participants')
          .select('*')
          .eq('room_id', id);

        if (participantsData) {
          const userIds = participantsData.filter(p => p.user_id).map(p => p.user_id);
          let profilesMap: Record<string, any> = {};
          
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('user_id, display_name, elo_by_format')
              .in('user_id', userIds as string[]);
            
            if (profiles) {
              profilesMap = profiles.reduce((acc, p) => ({ ...acc, [p.user_id]: p }), {});
            }
          }
          
          const participantsWithProfiles = participantsData.map(p => ({
            ...p,
            profile: p.user_id ? profilesMap[p.user_id] : undefined,
          }));
          setParticipants(participantsWithProfiles as Participant[]);
        }

        // Fetch match history
        const { data: historyData } = await supabase
          .from('match_history')
          .select('*')
          .eq('room_id', id)
          .maybeSingle();

        if (historyData) setMatchHistory(historyData as MatchHistoryRecord);

        // Refresh profile to get updated ELO
        await refreshProfile();
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, user, refreshProfile]);

  const getOutcome = (): 'win' | 'loss' | 'draw' | 'abandoned' | null => {
    if (!room || !user) return null;

    if (room.ended_reason === 'disconnect' || room.ended_reason === 'abandoned') {
      return 'abandoned';
    }

    if (matchHistory?.is_draw) return 'draw';
    if (matchHistory?.winner_user_id === user.id) return 'win';
    if (matchHistory?.winner_user_id && matchHistory.winner_user_id !== user.id) return 'loss';

    return null;
  };

  const getRatingChange = (): number | null => {
    if (!matchHistory || !user) return null;

    if (matchHistory.user_a_id === user.id && matchHistory.rating_after_a && matchHistory.rating_before_a) {
      return matchHistory.rating_after_a - matchHistory.rating_before_a;
    }
    if (matchHistory.user_b_id === user.id && matchHistory.rating_after_b && matchHistory.rating_before_b) {
      return matchHistory.rating_after_b - matchHistory.rating_before_b;
    }

    return null;
  };

  const getDuration = (): string => {
    if (!room?.ended_at || !room?.created_at) return '--:--';

    const start = new Date(room.created_at).getTime();
    const end = new Date(room.ended_at).getTime();
    const seconds = Math.floor((end - start) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRematch = async () => {
    if (!user || !room) return;

    try {
      // Create new private room with same settings
      const { data: newRoom, error: roomError } = await supabase
        .from('debate_rooms')
        .insert({
          format: room.format,
          mode: room.mode,
          status: 'reserved',
          is_private: true,
          reserved_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add creator as participant
      await supabase.from('debate_participants').insert({
        room_id: newRoom.id,
        user_id: user.id,
        is_ai: false,
        role: room.format === 'LD' ? 'affirmative' : 'proposition',
        speaking_order: 1,
      });

      // Generate invite code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create invite
      await supabase.from('invites').insert({
        invite_code: code,
        room_id: newRoom.id,
        created_by_user_id: user.id,
      });

      // Copy to clipboard
      const link = `${window.location.origin}/invite/${code}`;
      navigator.clipboard.writeText(link);
      setRematchCopied(true);
      toast.success('Rematch link copied! Share with your opponent.');

      setTimeout(() => {
        navigate(`/room/${newRoom.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating rematch:', err);
      toast.error('Failed to create rematch');
    }
  };

  const handleQueueAgain = () => {
    navigate('/play', {
      state: {
        format: room?.format,
        mode: room?.mode,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const outcome = getOutcome();
  const ratingChange = getRatingChange();
  const opponent = participants.find(p => p.user_id !== user?.id || p.is_ai);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-8 text-center">
          {/* Outcome Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              outcome === 'win' ? 'bg-success/20' :
              outcome === 'loss' ? 'bg-destructive/20' :
              outcome === 'draw' ? 'bg-warning/20' :
              'bg-muted'
            }`}
          >
            {outcome === 'win' && <Trophy className="w-12 h-12 text-success" />}
            {outcome === 'loss' && <TrendingDown className="w-12 h-12 text-destructive" />}
            {outcome === 'draw' && <Minus className="w-12 h-12 text-warning" />}
            {outcome === 'abandoned' && <AlertTriangle className="w-12 h-12 text-muted-foreground" />}
          </motion.div>

          {/* Outcome Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl font-bold mb-2"
          >
            {outcome === 'win' && 'Victory!'}
            {outcome === 'loss' && 'Defeat'}
            {outcome === 'draw' && 'Draw'}
            {outcome === 'abandoned' && 'Match Abandoned'}
          </motion.h1>

          {/* Rating Change */}
          {ratingChange !== null && room?.mode === 'ranked' && !room?.is_ai_opponent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center gap-2 text-2xl font-bold mb-6 ${
                ratingChange > 0 ? 'text-success' :
                ratingChange < 0 ? 'text-destructive' :
                'text-muted-foreground'
              }`}
            >
              {ratingChange > 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              {ratingChange > 0 ? '+' : ''}{ratingChange} ELO
            </motion.div>
          )}

          {room?.is_ai_opponent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              AI matches don't affect your rating
            </motion.p>
          )}

          {outcome === 'abandoned' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              Opponent disconnected. No rating change.
            </motion.p>
          )}

          {/* Match Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-muted/50 rounded-lg p-4 mb-6"
          >
            <h3 className="font-semibold mb-3">Match Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Format:</span>
                <span className="font-medium">{room?.format}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-medium capitalize">{room?.mode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{getDuration()}</span>
              </div>
              <div className="flex items-center gap-2">
                {opponent?.is_ai ? (
                  <>
                    <Bot className="w-4 h-4 text-muted-foreground" />
                    <span>AI Opponent</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{opponent?.profile?.display_name || 'Opponent'}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Button
              onClick={handleQueueAgain}
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              <Zap className="w-4 h-4 mr-2" />
              Queue Again
            </Button>

            {!room?.is_ai_opponent && (
              <Button
                variant="outline"
                onClick={handleRematch}
                className="w-full"
              >
                {rematchCopied ? <Check className="w-4 h-4 mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                {rematchCopied ? 'Link Copied!' : 'Rematch'}
              </Button>
            )}

            <Link to="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomResults;
