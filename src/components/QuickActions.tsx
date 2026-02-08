import { motion } from 'framer-motion';
import { Zap, Clock, Users, Bot, Globe, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: 'primary' | 'accent' | 'success';
  onClick?: () => void;
  delay?: number;
}

const badgeColors = {
  primary: 'bg-primary/20 text-primary border-primary/30',
  accent: 'bg-accent/20 text-accent border-accent/30',
  success: 'bg-success/20 text-success border-success/30',
};

const ActionCard = ({ icon: Icon, title, description, badge, badgeColor = 'primary', onClick, delay = 0 }: ActionCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="action-card group cursor-pointer"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 group-hover:border-primary/40 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </motion.div>
);

export const QuickActions = () => {
  const navigate = useNavigate();

  const goToPlay = () => navigate('/play');

  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">Quick Play</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          icon={Zap}
          title="Ranked Debate"
          description="Match with opponents at your skill level"
          badge="ELO +/-"
          badgeColor="primary"
          delay={0.1}
          onClick={goToPlay}
        />
        <ActionCard
          icon={Clock}
          title="Quick 5-min Round"
          description="Fast-paced debates for busy schedules"
          badge="Popular"
          badgeColor="success"
          delay={0.15}
          onClick={goToPlay}
        />
        <ActionCard
          icon={Bot}
          title="AI Sparring"
          description="Practice against adaptive AI opponents"
          badge="Pro"
          badgeColor="accent"
          delay={0.2}
          onClick={goToPlay}
        />
        <ActionCard
          icon={Users}
          title="Play a Friend"
          description="Challenge someone you know"
          delay={0.25}
          onClick={goToPlay}
        />
        <ActionCard
          icon={Globe}
          title="Public Lobby"
          description="Join an open debate room"
          delay={0.3}
          onClick={goToPlay}
        />
        <ActionCard
          icon={Swords}
          title="Tournament Mode"
          description="Compete in organized competitions"
          badge="Live"
          badgeColor="success"
          delay={0.35}
          onClick={goToPlay}
        />
      </div>
    </div>
  );
};
