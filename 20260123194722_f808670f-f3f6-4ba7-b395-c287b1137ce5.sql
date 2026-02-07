-- Add is_public column to profiles (defaults to false for privacy)
ALTER TABLE public.profiles 
ADD COLUMN is_public boolean NOT NULL DEFAULT false;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new policy: authenticated users can see all profiles, 
-- unauthenticated can only see public profiles
CREATE POLICY "Users can view profiles based on visibility" 
ON public.profiles 
FOR SELECT 
USING (
  -- Authenticated users can see all profiles
  auth.uid() IS NOT NULL 
  OR 
  -- Unauthenticated users can only see public profiles
  is_public = true
);