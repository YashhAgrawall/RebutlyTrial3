import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import logo from '@/assets/rebutly-logo.png';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      {/* CTA Section */}
      <div className="py-16 text-center border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-4"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to <span className="gradient-text">Debate Smarter?</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of debaters already sharpening their skills on Rebutly.AI
          </p>
          <Button variant="hero" size="xl" className="group">
            Start Free Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Footer content */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Rebutly.AI" className="w-10 h-10 rounded-lg" />
              <span className="font-display font-bold text-lg">
                Rebutly<span className="text-primary">.AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              The world's first AI-powered multiplayer debate platform.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                London, United Kingdom
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                debate@rebutly.ai
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +44 7471 981767
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Play</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Learn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tournaments</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">For Schools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Rebutly.AI. All rights reserved.</p>
          <p>Partners: Indian Debating League · Eldr Debate Club</p>
        </div>
      </div>
    </footer>
  );
};
