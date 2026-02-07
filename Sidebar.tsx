import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Bot, 
  GraduationCap, 
  Users, 
  Trophy, 
  BarChart3,
  Search,
  Settings,
  HelpCircle,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import logo from '@/assets/rebutly-logo.png';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: Zap, label: 'Play', href: '/play', active: true },
  { icon: Bot, label: 'AI Sparring', href: '/play' },
  { icon: GraduationCap, label: 'Learn', href: '#learn' },
  { icon: Users, label: 'Community', href: '#community' },
  { icon: Trophy, label: 'Tournaments', href: '#tournaments' },
  { icon: BarChart3, label: 'Analytics', href: '#analytics' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Support' },
];

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 h-full w-[280px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Rebutly.AI" className="w-10 h-10 rounded-lg" />
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">
                Rebutly<span className="text-primary">.AI</span>
              </h1>
              <p className="text-xs text-muted-foreground">Debate. Learn. Win.</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            item.href.startsWith('/') ? (
              <Link
                key={item.label}
                to={item.href}
                className={`nav-item ${item.active ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.active && <div className="pulse-dot ml-auto" />}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`nav-item ${item.active ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.active && <div className="pulse-dot ml-auto" />}
              </a>
            )
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          {bottomItems.map((item) => (
            <button key={item.label} className="nav-item w-full">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Pro upgrade CTA */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="action-card bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="font-semibold text-foreground">Go Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock analytics, drills & AI sparring
            </p>
            <button className="w-full py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity">
              Upgrade Now
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </>
  );
};
