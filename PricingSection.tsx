import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  delay?: number;
}

const PlanCard = ({ name, price, period, description, features, highlighted = false, delay = 0 }: PlanCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`relative glass-card p-6 ${highlighted ? 'border-primary/50 glow-primary' : ''}`}
  >
    {highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground flex items-center gap-1">
          <Star className="w-3 h-3" /> Most Popular
        </span>
      </div>
    )}
    
    <div className="text-center mb-6">
      <h3 className="font-display text-xl font-bold text-foreground mb-2">{name}</h3>
      <div className="flex items-baseline justify-center gap-1 mb-2">
        <span className="text-4xl font-display font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <ul className="space-y-3 mb-6">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm">
          <Check className="w-4 h-4 text-success flex-shrink-0" />
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>

    <Button 
      variant={highlighted ? 'hero' : 'outline'} 
      className="w-full"
    >
      {price === 'Free' ? 'Get Started' : 'Start Free Trial'}
    </Button>
  </motion.div>
);

export const PricingSection = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          Choose Your Path
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-xl mx-auto"
        >
          Start free, upgrade when you're ready to dominate
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
        <PlanCard
          name="Free"
          price="Free"
          period="forever"
          description="Perfect for getting started"
          features={[
            'Unlimited ranked debates',
            'Basic AI feedback',
            'Global ELO ranking',
            'Community access',
          ]}
          delay={0.1}
        />
        <PlanCard
          name="Pro"
          price="$9"
          period="month"
          description="For serious debaters"
          features={[
            'Everything in Free',
            'Advanced analytics',
            'AI sparring partners',
            'Video lessons & drills',
            'Saved debate history',
            'Priority matchmaking',
          ]}
          highlighted
          delay={0.2}
        />
        <PlanCard
          name="Team"
          price="$29"
          period="month"
          description="For clubs & schools"
          features={[
            'Everything in Pro',
            'Up to 25 members',
            'Team analytics dashboard',
            'Coach tools',
            'Private tournaments',
            'Custom branding',
          ]}
          delay={0.3}
        />
      </div>
    </section>
  );
};
