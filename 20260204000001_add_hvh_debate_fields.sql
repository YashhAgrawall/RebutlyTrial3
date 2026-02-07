-- Add topic and hvh_format to debate_rooms for human vs human debates
ALTER TABLE public.debate_rooms ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE public.debate_rooms ADD COLUMN IF NOT EXISTS hvh_format TEXT DEFAULT 'standard';

-- Add topic to match_queue_entries so we can pass it through matchmaking
ALTER TABLE public.match_queue_entries ADD COLUMN IF NOT EXISTS topic TEXT;

-- Add current_phase to debate_rooms for synchronized phase tracking
ALTER TABLE public.debate_rooms ADD COLUMN IF NOT EXISTS current_phase TEXT DEFAULT 'waiting';

-- Function to update room phase (called by either participant, first one wins)
CREATE OR REPLACE FUNCTION public.advance_debate_phase(
  p_room_id UUID,
  p_current_phase TEXT,
  p_next_phase TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated BOOLEAN := FALSE;
BEGIN
  -- Only advance if current phase matches (prevents race conditions)
  UPDATE debate_rooms 
  SET current_phase = p_next_phase
  WHERE id = p_room_id 
    AND current_phase = p_current_phase;
  
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

-- Function to get room with participants (reduces round trips)
CREATE OR REPLACE FUNCTION public.get_room_with_participants(p_room_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'room', row_to_json(r),
    'participants', (
      SELECT json_agg(
        json_build_object(
          'id', dp.id,
          'room_id', dp.room_id,
          'user_id', dp.user_id,
          'is_ai', dp.is_ai,
          'role', dp.role,
          'speaking_order', dp.speaking_order,
          'connected_at', dp.connected_at,
          'profile', CASE 
            WHEN dp.user_id IS NOT NULL THEN (
              SELECT json_build_object(
                'username', p.username,
                'display_name', p.display_name,
                'avatar_url', p.avatar_url,
                'elo_by_format', p.elo_by_format
              )
              FROM profiles p WHERE p.user_id = dp.user_id
            )
            ELSE NULL
          END
        )
      )
      FROM debate_participants dp 
      WHERE dp.room_id = p_room_id
    )
  ) INTO v_result
  FROM debate_rooms r
  WHERE r.id = p_room_id;
  
  RETURN v_result;
END;
$$;
