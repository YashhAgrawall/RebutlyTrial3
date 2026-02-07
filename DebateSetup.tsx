import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Shuffle, 
  Clock, 
  ArrowRight,
  Zap,
  Timer,
  Hourglass,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export type DebateSide = 'proposition' | 'opposition' | 'random';
export type DebateFormat = 'rapid' | 'standard' | 'extended';
export type TransitionMode = 'tick' | 'auto' | 'both';
export type AIVoiceGender = 'male' | 'female';

export interface FormatConfig {
  name: string;
  description: string;
  icon: React.ElementType;
  prepTime: number; // seconds
  constructiveTime: number; // seconds per speaker
  rebuttalTime: number; // seconds per speaker
}

export const DEBATE_FORMATS: Record<DebateFormat, FormatConfig> = {
  rapid: {
    name: '1-Minute Rapid Fire',
    description: 'Quick practice with 30s prep, 1min speeches, 1min rebuttals',
    icon: Zap,
    prepTime: 30,
    constructiveTime: 60,
    rebuttalTime: 60,
  },
  standard: {
    name: '3-Minute Standard',
    description: 'Balanced format with 1min prep, 3min speeches, 1min rebuttals',
    icon: Timer,
    prepTime: 60,
    constructiveTime: 180,
    rebuttalTime: 60,
  },
  extended: {
    name: '7-Minute Extended',
    description: 'Full practice with 15min prep, 7min speeches, 4min rebuttals',
    icon: Hourglass,
    prepTime: 900,
    constructiveTime: 420,
    rebuttalTime: 240,
  },
};

interface DebateSetupProps {
  topic: string;
  onStart: (config: {
    side: 'proposition' | 'opposition';
    format: DebateFormat;
    transitionMode: TransitionMode;
    aiVoiceGender: AIVoiceGender;
    audioEnabled: boolean;
    audioVolume: number;
  }) => void;
  onBack: () => void;
}

export function DebateSetup({ topic, onStart, onBack }: DebateSetupProps) {
  const [side, setSide] = useState<DebateSide>('random');
  const [format, setFormat] = useState<DebateFormat>('standard');
  const [transitionMode, setTransitionMode] = useState<TransitionMode>('both');
  const [aiVoiceGender, setAiVoiceGender] = useState<AIVoiceGender>('male');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioVolume, setAudioVolume] = useState(80); // 0-100

  const handleStart = () => {
    // Resolve random side
    const resolvedSide: 'proposition' | 'opposition' = 
      side === 'random' 
        ? (Math.random() > 0.5 ? 'proposition' : 'opposition')
        : side;

    onStart({
      side: resolvedSide,
      format,
      transitionMode,
      aiVoiceGender,
      audioEnabled,
      audioVolume: audioVolume / 100, // Convert to 0-1 range
    });
  };

  const formatConfig = DEBATE_FORMATS[format];

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}min`;
    }
    return `${seconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-xl font-bold mb-2">Debate Setup</h2>
        <p className="text-sm text-muted-foreground">Configure your debate before starting</p>
      </div>

      {/* Topic Display */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6 text-center">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Motion</span>
        <p className="font-display text-lg text-primary mt-1">"{topic}"</p>
      </div>

      <div className="space-y-6">
        {/* Side Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Choose Your Side</Label>
          <RadioGroup
            value={side}
            onValueChange={(v) => setSide(v as DebateSide)}
            className="grid grid-cols-3 gap-3"
          >
            <Label
              htmlFor="proposition"
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                side === 'proposition' 
                  ? 'border-success bg-success/10' 
                  : 'border-border hover:border-success/50'
              }`}
            >
              <RadioGroupItem value="proposition" id="proposition" className="sr-only" />
              <span className="text-lg mb-1">👍</span>
              <span className="font-medium text-sm">Proposition</span>
              <span className="text-xs text-muted-foreground">Argue FOR</span>
            </Label>

            <Label
              htmlFor="opposition"
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                side === 'opposition' 
                  ? 'border-destructive bg-destructive/10' 
                  : 'border-border hover:border-destructive/50'
              }`}
            >
              <RadioGroupItem value="opposition" id="opposition" className="sr-only" />
              <span className="text-lg mb-1">👎</span>
              <span className="font-medium text-sm">Opposition</span>
              <span className="text-xs text-muted-foreground">Argue AGAINST</span>
            </Label>

            <Label
              htmlFor="random"
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                side === 'random' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="random" id="random" className="sr-only" />
              <Shuffle className="w-5 h-5 mb-1 text-primary" />
              <span className="font-medium text-sm">Random</span>
              <span className="text-xs text-muted-foreground">Surprise me</span>
            </Label>
          </RadioGroup>
        </div>

        {/* AI Voice Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">AI Opponent Voice</Label>
          <RadioGroup
            value={aiVoiceGender}
            onValueChange={(v) => setAiVoiceGender(v as AIVoiceGender)}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="male-voice"
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                aiVoiceGender === 'male' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="male" id="male-voice" className="sr-only" />
              <User className="w-5 h-5 mb-1 text-primary" />
              <span className="font-medium text-sm">Male Voice</span>
              <span className="text-xs text-muted-foreground">Roger</span>
            </Label>

            <Label
              htmlFor="female-voice"
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                aiVoiceGender === 'female' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="female" id="female-voice" className="sr-only" />
              <User className="w-5 h-5 mb-1 text-accent" />
              <span className="font-medium text-sm">Female Voice</span>
              <span className="text-xs text-muted-foreground">Sarah</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Audio Settings */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <Label htmlFor="audio-enabled" className="text-sm font-medium">
                Enable AI Audio
              </Label>
            </div>
            <Switch
              id="audio-enabled"
              checked={audioEnabled}
              onCheckedChange={setAudioEnabled}
            />
          </div>
          
          {audioEnabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Label className="text-muted-foreground">Volume</Label>
                <span className="text-muted-foreground">{audioVolume}%</span>
              </div>
              <Slider
                value={[audioVolume]}
                onValueChange={([v]) => setAudioVolume(v)}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Format Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Debate Format</Label>
          <RadioGroup
            value={format}
            onValueChange={(v) => setFormat(v as DebateFormat)}
            className="space-y-2"
          >
            {Object.entries(DEBATE_FORMATS).map(([key, config]) => {
              const Icon = config.icon;
              const isSelected = format === key;
              
              return (
                <Label
                  key={key}
                  htmlFor={key}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={key} id={key} className="mt-1" />
                  <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <span className="font-medium block">{config.name}</span>
                    <span className="text-xs text-muted-foreground">{config.description}</span>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        {/* Format Summary */}
        <Card className="bg-muted/30">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatConfig.name} - Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Prep Time</span>
                <span className="font-bold">{formatTime(formatConfig.prepTime)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Constructive</span>
                <span className="font-bold">{formatTime(formatConfig.constructiveTime)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Rebuttal</span>
                <span className="font-bold">{formatTime(formatConfig.rebuttalTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transition Mode */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Round Transition Mode</Label>
          <p className="text-xs text-muted-foreground mb-3">
            How should the next round start after your speech ends?
          </p>
          <RadioGroup
            value={transitionMode}
            onValueChange={(v) => setTransitionMode(v as TransitionMode)}
            className="grid grid-cols-3 gap-2"
          >
            <Label
              htmlFor="tick"
              className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all text-center ${
                transitionMode === 'tick' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="tick" id="tick" className="sr-only" />
              <span className="text-xs font-medium">Manual Only</span>
              <span className="text-[10px] text-muted-foreground">Click to proceed</span>
            </Label>

            <Label
              htmlFor="auto"
              className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all text-center ${
                transitionMode === 'auto' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="auto" id="auto" className="sr-only" />
              <span className="text-xs font-medium">Auto (10s)</span>
              <span className="text-[10px] text-muted-foreground">Auto countdown</span>
            </Label>

            <Label
              htmlFor="both"
              className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all text-center ${
                transitionMode === 'both' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="both" id="both" className="sr-only" />
              <span className="text-xs font-medium">Confirm + 10s</span>
              <span className="text-[10px] text-muted-foreground">Click then countdown</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={handleStart} className="flex-1 bg-gradient-to-r from-primary to-secondary">
            Start Debate
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
