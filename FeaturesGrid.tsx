import { motion } from 'framer-motion';
import { Mic, Brain, Trophy, TrendingUp, Users, Shield } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="text-center p-6"
  >
    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export const FeaturesGrid = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          Why Debaters <span className="gradient-text">Love Us</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-xl mx-auto"
        >
          Built by debaters, for debaters. Every feature designed to make you better.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
        <FeatureCard
          icon={Mic}
          title="Instant Matchmaking"
          description="Find opponents in seconds. No scheduling, no waiting. Just debate."
          delay={0.1}
        />
        <FeatureCard
          icon={Brain}
          title="AI Adjudication"
          description="Real-time scoring and feedback from our advanced debate AI."
          delay={0.15}
        />
        <FeatureCard
          icon={Trophy}
          title="Global Rankings"
          description="Compete on the global leaderboard with ELO-based ratings."
          delay={0.2}
        />
        <FeatureCard
          icon={TrendingUp}
          title="Performance Analytics"
          description="Track your progress with detailed stats and improvement insights."
          delay={0.25}
        />
        <FeatureCard
          icon={Users}
          title="Community"
          description="Connect with debaters worldwide. Learn from the best."
          delay={0.3}
        />
        <FeatureCard
          icon={Shield}
          title="All Formats"
          description="BP, LD, PF, AP and more. Master any debate style."
          delay={0.35}
        />
      </div>
    </section>
  );
};
