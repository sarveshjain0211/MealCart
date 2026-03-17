import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChefHat, User, LogOut, BookOpen, ShoppingCart, Calendar, Package, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

const Navbar = ({ darkMode, toggleDarkMode, user, onSignIn, onSignUp, onLogout, currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass shadow-lg py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-400">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">MealCart</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-4 md:flex">
            <NavLink 
              onClick={() => onNavigate && onNavigate('home')} 
              active={currentPage === 'home'}
            >
              Home
            </NavLink>
            {user && (
              <>
                <NavLink 
                  onClick={() => onNavigate && onNavigate('saved-recipes')}
                  active={currentPage === 'saved-recipes'}
                >
                  <BookOpen className="inline w-4 h-4 mr-1" />
                  Recipes
                </NavLink>
                <NavLink 
                  onClick={() => onNavigate && onNavigate('ai-generator')}
                  active={currentPage === 'ai-generator'}
                >
                  <Sparkles className="inline w-4 h-4 mr-1" />
                  Generate
                </NavLink>
                <NavLink 
                  onClick={() => onNavigate && onNavigate('meal-planner')}
                  active={currentPage === 'meal-planner'}
                >
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Planner
                </NavLink>
                <NavLink 
                  onClick={() => onNavigate && onNavigate('pantry')}
                  active={currentPage === 'pantry'}
                >
                  <Package className="inline w-4 h-4 mr-1" />
                  Pantry
                </NavLink>
                <NavLink 
                  onClick={() => onNavigate && onNavigate('grocery-list')}
                  active={currentPage === 'grocery-list'}
                >
                  <ShoppingCart className="inline w-4 h-4 mr-1" />
                  Grocery
                </NavLink>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={darkMode ? 'moon' : 'sun'}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="items-center hidden gap-2 md:flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => onNavigate && onNavigate('profile')}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button variant="ghost" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="items-center hidden gap-2 md:flex">
                <Button variant="ghost" onClick={onSignIn}>
                  Sign In
                </Button>
                <Button variant="gradient" onClick={onSignUp}>
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t md:hidden glass"
          >
            <div className="container px-4 py-6 mx-auto space-y-4">
              <MobileNavLink 
                onClick={() => { 
                  onNavigate && onNavigate('home'); 
                  setIsMobileMenuOpen(false); 
                }}
              >
                Home
              </MobileNavLink>
              
              {user && (
                <>
                  <MobileNavLink 
                    onClick={() => { 
                      onNavigate && onNavigate('saved-recipes'); 
                      setIsMobileMenuOpen(false); 
                    }}
                  >
                    <BookOpen className="inline w-4 h-4 mr-2" />
                    My Recipes
                  </MobileNavLink>
                  <MobileNavLink 
                    onClick={() => { 
                      onNavigate && onNavigate('ai-generator'); 
                      setIsMobileMenuOpen(false); 
                    }}
                  >
                    <Sparkles className="inline w-4 h-4 mr-2" />
                    AI Generator
                  </MobileNavLink>
                  <MobileNavLink 
                    onClick={() => { 
                      onNavigate && onNavigate('meal-planner'); 
                      setIsMobileMenuOpen(false); 
                    }}
                  >
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Meal Planner
                  </MobileNavLink>
                  <MobileNavLink 
                    onClick={() => { 
                      onNavigate && onNavigate('pantry'); 
                      setIsMobileMenuOpen(false); 
                    }}
                  >
                    <Package className="inline w-4 h-4 mr-2" />
                    Pantry
                  </MobileNavLink>
                  <MobileNavLink 
                    onClick={() => { 
                      onNavigate && onNavigate('grocery-list'); 
                      setIsMobileMenuOpen(false); 
                    }}
                  >
                    <ShoppingCart className="inline w-4 h-4 mr-2" />
                    Grocery List
                  </MobileNavLink>
                  <MobileNavLink 
                    onClick={() => { 
                      onNavigate && onNavigate('ai-assistant'); 
                      setIsMobileMenuOpen(false); 
                    }}
                  >
                    <MessageSquare className="inline w-4 h-4 mr-2" />
                    AI Assistant
                  </MobileNavLink>
                </>
              )}
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        onNavigate && onNavigate('profile');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={onSignIn}>
                      Sign In
                    </Button>
                    <Button variant="gradient" className="w-full" onClick={onSignUp}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({ onClick, children, active }) => (
  <button
    onClick={onClick}
    className={cn(
      "text-sm font-medium transition-colors",
      active
        ? "text-primary"
        : "text-foreground/80 hover:text-foreground"
    )}
  >
    {children}
  </button>
);

const MobileNavLink = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full py-2 text-lg font-medium text-left transition-colors text-foreground/80 hover:text-foreground"
  >
    {children}
  </button>
);

export default Navbar;
