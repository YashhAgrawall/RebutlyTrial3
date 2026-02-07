import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const app = new Hono();

// Handle CORS preflight
app.options('*', (c) => {
  return new Response(null, { headers: corsHeaders });
});

app.post('/', async (c) => {
  try {
    const { roomId } = await c.req.json();
    
    if (!roomId) {
      return c.json({ error: 'roomId required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log(`Processing ELO update for room ${roomId}`);

    // Get the room
    const { data: room, error: roomError } = await supabase
      .from('debate_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      console.error('Room not found:', roomError);
      return c.json({ error: 'Room not found' }, 404);
    }

    // Only process ranked, human vs human matches
    if (room.mode !== 'ranked' || room.is_ai_opponent) {
      console.log('Not a ranked human match, skipping ELO update');
      return c.json({ message: 'ELO update not required' }, 200);
    }

    // Get result submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('match_result_submissions')
      .select('*')
      .eq('room_id', roomId);

    if (submissionsError || !submissions || submissions.length < 2) {
      console.error('Not enough submissions:', submissionsError);
      return c.json({ error: 'Not enough result submissions' }, 400);
    }

    // Check for consistent results
    const results = submissions.map(s => s.submitted_result);
    const hasWin = results.includes('win');
    const hasLoss = results.includes('loss');
    const allDraw = results.every(r => r === 'draw');

    if (!((hasWin && hasLoss) || allDraw)) {
      console.log('Inconsistent results, skipping ELO update');
      return c.json({ error: 'Inconsistent results' }, 400);
    }

    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('debate_participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_ai', false);

    if (participantsError || !participants || participants.length < 2) {
      console.error('Participants not found:', participantsError);
      return c.json({ error: 'Participants not found' }, 400);
    }

    // Get profiles for ELO
    const userIds = participants.map(p => p.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', userIds);

    if (profilesError || !profiles || profiles.length < 2) {
      console.error('Profiles not found:', profilesError);
      return c.json({ error: 'Profiles not found' }, 400);
    }

    // Determine winner
    let winnerUserId: string | null = null;
    let isDraw = false;

    if (allDraw) {
      isDraw = true;
    } else {
      const winnerSubmission = submissions.find(s => s.submitted_result === 'win');
      winnerUserId = winnerSubmission?.user_id || null;
    }

    const userA = profiles[0];
    const userB = profiles[1];
    const format = room.format;

    const ratingA = (userA.elo_by_format as Record<string, number>)?.[format] || 1200;
    const ratingB = (userB.elo_by_format as Record<string, number>)?.[format] || 1200;

    console.log(`User A (${userA.user_id}): ${ratingA}, User B (${userB.user_id}): ${ratingB}`);

    // Calculate expected scores
    const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));

    // Determine actual scores
    let scoreA: number, scoreB: number;
    
    if (isDraw) {
      scoreA = 0.5;
      scoreB = 0.5;
    } else if (winnerUserId === userA.user_id) {
      scoreA = 1;
      scoreB = 0;
    } else {
      scoreA = 0;
      scoreB = 1;
    }

    // Calculate K-factor
    const getKFactor = (rating: number) => {
      if (rating < 1200) return 40;
      if (rating < 2000) return 20;
      return 10;
    };

    const kA = getKFactor(ratingA);
    const kB = getKFactor(ratingB);

    // Calculate new ratings
    const newRatingA = Math.round(ratingA + kA * (scoreA - expectedA));
    const newRatingB = Math.round(ratingB + kB * (scoreB - expectedB));

    console.log(`New ratings: A=${newRatingA} (${newRatingA - ratingA > 0 ? '+' : ''}${newRatingA - ratingA}), B=${newRatingB} (${newRatingB - ratingB > 0 ? '+' : ''}${newRatingB - ratingB})`);

    // Update profiles
    const newEloA = { ...userA.elo_by_format, [format]: newRatingA };
    const newEloB = { ...userB.elo_by_format, [format]: newRatingB };

    await supabase
      .from('profiles')
      .update({ 
        elo_by_format: newEloA,
        total_debates: (userA.total_debates || 0) + 1,
        total_wins: scoreA === 1 ? (userA.total_wins || 0) + 1 : userA.total_wins,
        current_streak: scoreA === 1 ? (userA.current_streak || 0) + 1 : 0,
      })
      .eq('id', userA.id);

    await supabase
      .from('profiles')
      .update({ 
        elo_by_format: newEloB,
        total_debates: (userB.total_debates || 0) + 1,
        total_wins: scoreB === 1 ? (userB.total_wins || 0) + 1 : userB.total_wins,
        current_streak: scoreB === 1 ? (userB.current_streak || 0) + 1 : 0,
      })
      .eq('id', userB.id);

    // Calculate duration
    const startTime = room.started_at ? new Date(room.started_at).getTime() : new Date(room.created_at).getTime();
    const endTime = room.ended_at ? new Date(room.ended_at).getTime() : Date.now();
    const durationSeconds = Math.floor((endTime - startTime) / 1000);

    // Create match history record
    await supabase.from('match_history').insert({
      room_id: roomId,
      user_a_id: userA.user_id,
      user_b_id: userB.user_id,
      format: room.format,
      mode: room.mode,
      winner_user_id: winnerUserId,
      is_draw: isDraw,
      rating_before_a: ratingA,
      rating_after_a: newRatingA,
      rating_before_b: ratingB,
      rating_after_b: newRatingB,
      duration_seconds: durationSeconds,
    });

    console.log('ELO update complete!');

    return c.json(
      { 
        message: 'ELO updated successfully',
        ratingChangeA: newRatingA - ratingA,
        ratingChangeB: newRatingB - ratingB,
      },
      200,
      corsHeaders
    );

  } catch (error) {
    console.error('ELO update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);
