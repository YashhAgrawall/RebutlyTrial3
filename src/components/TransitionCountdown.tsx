import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Play, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type TransitionMode = 'tick' | 'auto' | 'both';

interface TransitionCountdownProps {
  isVisible: boolean;
  mode: TransitionMode;
  onComplete: () => void;
  nextSpeaker: 'user' | 'ai' | 'opponent'; // Added 'opponent' for HvH debates
  nextPhase: string;
}

export function TransitionCountdown({
  isVisible,
  mode,
  onComplete,
  nextSpeaker,
  nextPhase,
}: TransitionCountdownProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Reset state when visibility changes
  useEffect(() => {
    if (isVisible) {
      setConfirmed(false);
      setCountdown(10);
      setIsCountingDown(false);

      // Auto mode starts countdown immediately after a short delay
      if (mode === 'auto') {
        const autoStartTimer = setTimeout(() => {
          setIsCountingDown(true);
        }, 500);
        return () => clearTimeout(autoStartTimer);
      }
    }
  }, [isVisible, mode]);

  // Countdown logic
  useEffect(() => {
    if (!isCountingDown || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsCountingDown(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountingDown, countdown, onComplete]);

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
    if (mode === 'tick') {
      // Immediate transition
      onComplete();
    } else if (mode === 'both') {
      // Start countdown after confirmation
      setIsCountingDown(true);
    }
  }, [mode, onComplete]);

  const handleSkipCountdown = useCallback(() => {
    setIsCountingDown(false);
    onComplete();
  }, [onComplete]);

  if (!isVisible) return null;

  // Handle all three speaker types: 'user', 'ai', 'opponent'
  const speakerLabel = nextSpeaker === 'ai' ? 'AI Opponent' : nextSpeaker === 'opponent' ? 'Opponent' : 'You';
  const phaseLabel = nextPhase ? nextPhase.charAt(0).toUpperCase() + nextPhase.slice(1) : 'Speech';
  const SpeakerIcon = nextSpeaker === 'user' ? User : Bot; // Bot icon for both AI and human opponent

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ y: 20, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: -20, scale: 0.95 }}
          className="glass-card p-8 max-w-md text-center"
        >
          {isCountingDown ? (
            <>
              {/* Countdown display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-6 relative"
              >
                {/* Circular progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted/30"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="text-primary"
                    strokeDasharray={314}
                    strokeDashoffset={314 * (countdown / 10)}
                  />
                </svg>
                <motion.span
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-display font-bold text-primary"
                >
                  {countdown}
                </motion.span>
              </motion.div>
              
              <h3 className="font-display text-xl font-bold mb-2">Get Ready!</h3>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  nextSpeaker === 'user' ? 'bg-primary/20' : 'bg-accent/20'
                }`}>
                  <SpeakerIcon className={`w-4 h-4 ${nextSpeaker === 'user' ? 'text-primary' : 'text-accent'}`} />
                </div>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{speakerLabel}</span> {phaseLabel} begins in {countdown}s
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                <Clock className="w-4 h-4 animate-pulse" />
                Take a moment to prepare
              </div>

              <Button variant="outline" size="sm" onClick={handleSkipCountdown}>
                Skip countdown
              </Button>
            </>
          ) : (
            <>
              {/* Pre-countdown state */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              
              <h3 className="font-display text-xl font-bold mb-2">Round Complete!</h3>
              
              <p className="text-muted-foreground mb-6">
                Next up: <span className="font-semibold text-foreground">{speakerLabel}</span> {phaseLabel}
              </p>

              {mode === 'tick' && (
                <Button onClick={handleConfirm} className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Next Round
                </Button>
              )}

              {mode === 'both' && !confirmed && (
                <div className="space-y-4">
                  <Button onClick={handleConfirm} className="w-full" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    I'm Ready - Start Countdown
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    A 10-second countdown will begin when you click
                  </p>
                </div>
              )}

              {mode === 'auto' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Starting countdown automatically...
                  </p>
                  <Button variant="outline" onClick={onComplete}>
                    Skip to next round
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
