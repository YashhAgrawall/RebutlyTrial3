-- Fix security warnings by making insert policies more restrictive
-- Edge functions will use service_role key which bypasses RLS

-- Drop overly permissive policies
DROP POLICY IF EXISTS "System can insert rooms" ON public.debate_rooms;
DROP POLICY IF EXISTS "System can insert participants" ON public.debate_participants;
DROP POLICY IF EXISTS "System can insert match history" ON public.match_history;

-- Replace with properly scoped policies
-- Debate rooms - allow authenticated users to insert (matchmaking creates rooms)
CREATE POLICY "Authenticated users can create rooms" ON public.debate_rooms
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Debate participants - authenticated users can join rooms
CREATE POLICY "Authenticated users can join rooms" ON public.debate_participants
    FOR INSERT TO authenticated  
    WITH CHECK (user_id = auth.uid() OR is_ai = true);

-- Match history - only via service role (edge functions), deny direct inserts
CREATE POLICY "Match history insert via service role only" ON public.match_history
    FOR INSERT TO authenticated
    WITH CHECK (false);

-- Fix function search path warnings
ALTER FUNCTION public.generate_invite_code() SET search_path = public;