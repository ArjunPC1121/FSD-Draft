import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, Menu, X, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth';
import ThemeToggle from '../ui/ThemeToggle';
import toast from 'react-hot-toast';

export default function Header() {
  const { user, clearUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      clearUser();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">MakeMyLeague</span>
        </Link>
        
        <div className="hidden items-center space-x-8 md:flex">
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/view-league" className="text-sm font-medium hover:text-primary">
              View League
            </Link>
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
            ) : (
              <Link to="/auth/login" className="text-sm font-medium hover:text-primary">
                Sign In
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-secondary/80"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="p-2 md:hidden" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-b bg-background px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/view-league" className="text-sm font-medium" onClick={toggleMenu}>
              View League
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                  className="flex items-center space-x-2 text-sm font-medium text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/auth/login" className="text-sm font-medium" onClick={toggleMenu}>
                Sign In
              </Link>
            )}
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}