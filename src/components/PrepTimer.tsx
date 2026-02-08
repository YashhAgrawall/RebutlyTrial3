import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, FileText, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrepTimerProps {
  totalSeconds: number;
  topic: string;
  userSide: 'proposition' | 'opposition';
  onComplete: () => void;
  onSkip: () => void;
  /** Server-authoritative remaining time (when provided, syncs display) */
  serverTimeLeft?: number | null;
}

export function PrepTimer({ 
  totalSeconds, 
  topic, 
  userSide, 
  onComplete,
  onSkip,
  serverTimeLeft: serverTimeProp,
}: PrepTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);

  // Sync with server time when provided
  useEffect(() => {
    if (serverTimeProp !== undefined && serverTimeProp !== null && Math.abs(timeLeft - serverTimeProp) > 1) {
      setTimeLeft(serverTimeProp);
    }
  }, [serverTimeProp, timeLeft]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const getSideLabel = () => {
    return userSide === 'proposition' 
      ? 'You are arguing FOR the motion' 
      : 'You are arguing AGAINST the motion';
  };

  const getColor = () => {
    return userSide === 'proposition' ? 'text-success' : 'text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 max-w-lg w-full text-center"
    >
      <div className="mb-6">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Preparation Time</span>
      </div>

      {/* Timer Circle */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray={364.4}
            strokeDashoffset={364.4 * (1 - progress / 100)}
            initial={{ strokeDashoffset: 364.4 }}
            animate={{ strokeDashoffset: 364.4 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono text-3xl font-bold ${timeLeft <= 30 ? 'text-destructive' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Topic */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium mb-2">Motion:</p>
        <p className="font-display text-primary text-lg">"{topic}"</p>
        <p className={`text-sm mt-2 font-medium ${getColor()}`}>
          {getSideLabel()}
        </p>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-warning" />
          Preparation Tips
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Identify 2-3 strong arguments for your side</li>
          <li>• Think of potential counterarguments to address</li>
          <li>• Find examples or evidence to support your points</li>
          <li>• Plan your opening statement structure</li>
          <li>• Use the notes panel to organize your thoughts</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setIsPaused(!isPaused)}
          className="flex-1"
        >
          <Clock className="w-4 h-4 mr-2" />
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button 
          onClick={onSkip}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          I'm Ready - Skip
        </Button>
      </div>
    </motion.div>
  );
}
