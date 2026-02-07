-- Add timer_state JSON column to debate_rooms for server-authoritative timing
ALTER TABLE public.debate_rooms ADD COLUMN IF NOT EXISTS timer_state jsonb DEFAULT NULL;

-- Helper function: set timer state (called from edge function)
CREATE OR REPLACE FUNCTION public.set_timer_state(p_room_id uuid, p_timer_state jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE debate_rooms SET timer_state = p_timer_state WHERE id = p_room_id;
END;
$$;

-- Helper function: get timer state (called from edge function)
CREATE OR REPLACE FUNCTION public.get_timer_state(p_room_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_state jsonb;
BEGIN
  SELECT timer_state INTO v_state FROM debate_rooms WHERE id = p_room_id;
  RETURN v_state;
END;
$$;
