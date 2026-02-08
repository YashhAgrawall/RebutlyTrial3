import { motion } from 'framer-motion';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

interface FormatCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  delay?: number;
}

const difficultyColors = {
  Beginner: 'text-success',
  Intermediate: 'text-warning',
  Advanced: 'text-destructive',
};

const FormatCard = ({ title, description, duration, difficulty, delay = 0 }: FormatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <div className="flex items-center gap-4 text-xs">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        {duration}
      </span>
      <span className={`flex items-center gap-1.5 ${difficultyColors[difficulty]}`}>
        <BookOpen className="w-3.5 h-3.5" />
        {difficulty}
      </span>
    </div>
  </motion.div>
);

export const DebateFormats = () => {
  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">Debate Formats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormatCard
          title="British Parliamentary"
          description="4-team format with dynamic roles and POIs"
          duration="45-60 min"
          difficulty="Advanced"
          delay={0.1}
        />
        <FormatCard
          title="Lincoln-Douglas"
          description="One-on-one value debate format"
          duration="30-45 min"
          difficulty="Intermediate"
          delay={0.15}
        />
        <FormatCard
          title="Public Forum"
          description="Team-based policy debate for all levels"
          duration="35-45 min"
          difficulty="Beginner"
          delay={0.2}
        />
      </div>
    </div>
  );
};
