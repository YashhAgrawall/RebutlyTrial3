-- Fix: allow users to cancel/search multiple times, while still enforcing one ACTIVE queue entry
ALTER TABLE public.match_queue_entries
  DROP CONSTRAINT IF EXISTS one_active_queue_per_user;

-- Safety: drop any leftover index with the old name
DROP INDEX IF EXISTS public.one_active_queue_per_user;

-- Enforce: one active (waiting) queue entry per user
CREATE UNIQUE INDEX IF NOT EXISTS one_active_queue_per_user_waiting
  ON public.match_queue_entries (user_id)
  WHERE status = 'waiting'::queue_status;

-- Enable realtime for matchmaking + room state updates
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.match_queue_entries;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.debate_rooms;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.debate_participants;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END$$;