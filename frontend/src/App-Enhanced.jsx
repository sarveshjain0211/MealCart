import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import SearchSection from './components/sections/SearchSection';
import RecipeGrid from './components/sections/RecipeGrid';
import CTA from './components/sections/CTA';
import AuthModal from './components/auth/AuthModal';
import RecipeDetails from './components/sections/RecipeDetails';
import UserProfilePage from './components/sections/UserProfilePage';
import TestimonialsCarousel from './components/sections/TestimonialsCarousel';
import MaintenancePage from './components/layout/MaintenancePage'; // Import MaintenancePage

// Import modern feature components
import MealPlanner from './components/sections/MealPlanner';
import PantryManager from './components/sections/PantryManager';
import GroceryList from './components/sections/GroceryList';
import AIAssistant from './components/sections/AIAssistant';
import RecipeGeneratorAdvanced from './components/sections/RecipeGeneratorAdvanced';
import SavedRecipes from './components/sections/SavedRecipes';
import FloatingAIButton from './components/ui/FloatingAIButton';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  // Check for maintenance mode immediately
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'signin' });
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in maintenance mode, render only the MaintenancePage
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Check for existing authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = async ({ query, tags }) => {
    try {
      setLoading(true);
      
      const searchQuery = tags.length > 0 
        ? `${query} ${tags.join(' ')}`.trim()
        : query;

      const response = await axios.post(`${API_BASE_URL}/ai/search-recipes`, {
        query: searchQuery
      });
      
      if (response.data.success) {
        setRecipes(response.data.data || []);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    setAuthModal({ isOpen: false, mode: 'signin' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentPage('home');
  };

  const handleGetStarted = () => {
    const searchSection = document.getElementById('search');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetails(true);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onGetStarted={handleGetStarted} />
            <Features />
            <SearchSection onSearch={handleSearch} loading={loading} />
            
            {/* Recipe Results */}
            {(recipes.length > 0 || loading) && (
              <section className="py-12">
                <div className="container px-4 mx-auto">
                  <RecipeGrid 
                    recipes={recipes} 
                    loading={loading}
                    onRecipeClick={handleRecipeClick}
                  />
                </div>
              </section>
            )}

            <CTA onGetStarted={handleGetStarted} />
          </>
        );

      case 'profile':
        return user ? (
          <UserProfilePage 
            user={user} 
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }}
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case 'saved-recipes':
        return user ? (
          <SavedRecipes user={user} onRecipeClick={handleRecipeClick} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In to View Saved Recipes</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case 'meal-planner':
        return user ? (
          <MealPlanner user={user} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In to Use Meal Planner</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case 'pantry':
        return user ? (
          <PantryManager user={user} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In to Manage Pantry</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case 'grocery-list':
        return user ? (
          <GroceryList user={user} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In to Create Grocery Lists</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case 'ai-generator':
        return user ? (
          <RecipeGeneratorAdvanced user={user} onRecipeClick={handleRecipeClick} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In to Generate Recipes</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      case 'ai-assistant':
        return user ? (
          <AIAssistant user={user} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold">Please Sign In to Use AI Assistant</h2>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
                className="px-6 py-3 text-white transition-opacity rounded-lg bg-primary hover:opacity-90"
              >
                Sign In
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        onSignIn={() => setAuthModal({ isOpen: true, mode: 'signin' })}
        onSignUp={() => setAuthModal({ isOpen: true, mode: 'signup' })}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Mobile Navigation Menu */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden dark:bg-gray-900 dark:border-gray-800">
          <div className="grid grid-cols-5 gap-1 p-2">
            <button
              onClick={() => handleNavigate('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentPage === 'home' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => handleNavigate('saved-recipes')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentPage === 'saved-recipes' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">Recipes</span>
            </button>
            <button
              onClick={() => handleNavigate('ai-generator')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentPage === 'ai-generator' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">Generate</span>
            </button>
            <button
              onClick={() => handleNavigate('meal-planner')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentPage === 'meal-planner' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">Planner</span>
            </button>
            <button
              onClick={() => handleNavigate('profile')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                currentPage === 'profile' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      )}

      <main className={user ? 'pb-20 lg:pb-0' : ''}>
        {renderPage()}
      </main>

      {/* Testimonials Carousel Section - Show on home page for all users */}
      {currentPage === 'home' && <TestimonialsCarousel />}

      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSuccess={handleAuthSuccess}
        onSwitchMode={() => setAuthModal({
          isOpen: true,
          mode: authModal.mode === 'signin' ? 'signup' : 'signin'
        })}
      />

      {/* Recipe Details Modal */}
      <RecipeDetails
        recipe={selectedRecipe}
        isOpen={showRecipeDetails}
        onClose={() => setShowRecipeDetails(false)}
        user={user}
      />

      {/* Floating AI Assistant Button */}
      <FloatingAIButton user={user} />
    </div>
  );
}

export default App;
