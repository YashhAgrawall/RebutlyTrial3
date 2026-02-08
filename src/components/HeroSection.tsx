import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/rebutly-logo.png';

export const HeroSection = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Top nav bar */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-end gap-4">
          {loading ? (
            <div className="w-24 h-10 bg-muted animate-pulse rounded-lg" />
          ) : user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/play')}>
                Play
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <img src={logo} alt="Rebutly.AI" className="w-16 h-16 rounded-2xl shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          <span className="text-foreground">Master Debate.</span>
          <br />
          <span className="gradient-text">Sharpen Your Mind.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          The world's first AI-powered debate platform. Match instantly with global opponents, 
          get real-time feedback, and climb the ranks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button 
            variant="hero" 
            size="xl" 
            className="group"
            onClick={() => navigate(user ? '/play' : '/auth')}
          >
            {user ? 'Find a Match' : 'Start Debating Free'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="glass" size="xl" onClick={() => navigate('/demo')}>
            Try Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">10,000+</strong> Debaters</span>
          </span>
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-accent" />
            <span><strong className="text-foreground">50+</strong> Countries</span>
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warning" />
            <span><strong className="text-foreground">AI</strong> Adjudication</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};
