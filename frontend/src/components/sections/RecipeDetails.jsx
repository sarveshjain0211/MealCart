import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, ChefHat, Heart, Share2, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const RecipeDetails = ({ recipe, isOpen, onClose, user }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    if (!recipe?._id || !user) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/users/favorites`);
      const favorites = response.data.favorites || [];
      setIsFavorite(favorites.some(fav => fav._id === recipe._id));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [recipe, user]);

  useEffect(() => {
    if (recipe && user) {
      checkFavoriteStatus();
    }
  }, [recipe, user, checkFavoriteStatus]);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please sign in to add favorites');
      return;
    }

    if (!recipe?._id) {
      alert('This is an AI-generated recipe. Please click "Save Recipe" first before adding to favorites!');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/users/favorites/${recipe._id}`);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to toggle favorite. Please try again.');
    }
  };

  const handleRateRecipe = async () => {
    if (!user || userRating === 0) return;

    if (!recipe?._id) {
      alert('This is an AI-generated recipe. Please click "Save Recipe" first before rating!');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/recipes/${recipe._id}/rate`, {
        rating: userRating,
        review
      });
      alert('Rating submitted successfully!');
      setReview('');
    } catch (error) {
      console.error('Error rating recipe:', error);
      alert('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!user) {
      alert('Please sign in to save recipes');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare recipe data with required fields
      const recipeData = {
        ...recipe,
        externalId: recipe.externalId || `ai-generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: recipe.name || recipe.title || 'Untitled Recipe',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || recipe.steps || []
      };

      // Validate required fields
      if (!recipeData.ingredients.length) {
        alert('Recipe must have at least one ingredient');
        setLoading(false);
        return;
      }

      if (!recipeData.instructions.length) {
        alert('Recipe must have instructions');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/recipes/save`, recipeData);
      alert('Recipe saved successfully!');
      // Update the recipe with the new _id from the response
      if (response.data.recipe && onClose) {
        // Refresh or notify parent component
        onClose();
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save recipe. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!recipe) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl inset-4 md:inset-8 lg:inset-16 dark:bg-gray-900 rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {recipe.name || recipe.title}
              </h2>
              <div className="flex items-center gap-2">
                {!recipe._id && user && (
                  <Button
                    onClick={handleSaveRecipe}
                    disabled={loading}
                    className="bg-gradient-to-r from-primary-600 to-primary-400"
                  >
                    {loading ? 'Saving...' : 'Save Recipe'}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Image */}
                {recipe.image && (
                  <div className="relative h-64 overflow-hidden md:h-96 rounded-xl">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-5 h-5" />
                    <span>{recipe.cookingTime || recipe.cookTime || 30} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-5 h-5" />
                    <span>{recipe.servings || 4} servings</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <ChefHat className="w-5 h-5" />
                    <span className="capitalize">{recipe.difficulty || 'Medium'}</span>
                  </div>
                  {recipe.averageRating && (
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span>{recipe.averageRating.toFixed(1)} ({recipe.totalRatings})</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipe.dietaryTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Description */}
                {recipe.description && (
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {recipe.description}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <span className="mt-1 text-primary">•</span>
                        <span>
                          {typeof ingredient === 'string' 
                            ? ingredient 
                            : `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name}`.trim()
                          }
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {Array.isArray(recipe.instructions) ? (
                      recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 text-sm font-semibold rounded-full bg-primary/10 text-primary">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-gray-600 dark:text-gray-400">
                            {typeof instruction === 'string' ? instruction : instruction.instruction}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-600 whitespace-pre-line dark:text-gray-400">
                        {recipe.instructions}
                      </p>
                    )}
                  </ol>
                </div>

                {/* Nutrition Info */}
                {recipe.nutrition && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Nutrition Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {Object.entries(recipe.nutrition).map(([key, value]) => (
                        <Card key={key}>
                          <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 capitalize dark:text-gray-400">
                              {key}
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {value}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating Section */}
                {user && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      Rate This Recipe
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= userRating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review (optional)"
                        className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                      />
                      <Button
                        onClick={handleRateRecipe}
                        disabled={loading || userRating === 0}
                        className="w-full"
                      >
                        {loading ? 'Submitting...' : 'Submit Rating'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeDetails;
