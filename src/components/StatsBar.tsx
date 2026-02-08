import { motion } from 'framer-motion';
import { Flame, Target, Trophy, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: 'primary' | 'accent' | 'warning' | 'success';
  delay?: number;
}

const colorClasses = {
  primary: 'text-primary bg-primary/10 border-primary/20',
  accent: 'text-accent bg-accent/10 border-accent/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  success: 'text-success bg-success/10 border-success/20',
};

const StatCard = ({ icon: Icon, label, value, subtext, color, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card p-4 flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-bold text-foreground">{value}</span>
        {subtext && <span className="text-sm text-muted-foreground">{subtext}</span>}
      </div>
    </div>
  </motion.div>
);

export const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        icon={Flame} 
        label="Streak" 
        value="7" 
        subtext="Days"
        color="warning"
        delay={0.1}
      />
      <StatCard 
        icon={Target} 
        label="ELO Rating" 
        value="1,847"
        color="primary"
        delay={0.2}
      />
      <StatCard 
        icon={Trophy} 
        label="Debates Won" 
        value="42"
        color="success"
        delay={0.3}
      />
      <StatCard 
        icon={TrendingUp} 
        label="Win Rate" 
        value="68%"
        subtext="+5%"
        color="accent"
        delay={0.4}
      />
    </div>
  );
};
