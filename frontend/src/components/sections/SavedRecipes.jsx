import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Users, Trash2, Eye, Search, Filter, ChefHat, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const SavedRecipes = ({ onRecipeClick, user }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // recent, name, rating, time

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer'];

  const fetchSavedRecipes = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all saved recipes created by the user (not just favorites)
      const response = await axios.get(`${API_BASE_URL}/recipes/my-recipes?limit=0`);
      
      const recipesData = response.data.recipes || [];
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      
      if (error.response?.status === 401) {
        alert('Please sign in to view your saved recipes');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]);

  const removeRecipe = async (recipeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/recipes/${recipeId}`);
      setRecipes(prev => prev.filter(r => r._id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'time':
          return (a.cookingTime || 0) - (b.cookingTime || 0);
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });



  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl">
                  <Heart className="text-white w-7 h-7 fill-white" />
                </div>
                <h1 className="text-4xl font-bold gradient-text">Saved Recipes</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Your favorite recipes in one place
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text">{recipes.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saved Recipes</p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? 'default' : 'outline'}
                      onClick={() => setFilterCategory(category)}
                      className="capitalize whitespace-nowrap"
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                  >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="time">Cook Time</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg dark:bg-gray-700" />
                <CardContent className="p-4">
                  <div className="h-6 mb-2 bg-gray-200 rounded dark:bg-gray-700" />
                  <div className="w-3/4 h-4 mb-4 bg-gray-200 rounded dark:bg-gray-700" />
                  <div className="flex gap-2">
                    <div className="w-20 h-8 bg-gray-200 rounded dark:bg-gray-700" />
                    <div className="w-20 h-8 bg-gray-200 rounded dark:bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedRecipes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              {searchQuery || filterCategory !== 'all' ? (
                <>
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="mb-2 text-lg text-gray-500">No recipes found</p>
                  <p className="text-gray-400">Try adjusting your filters</p>
                </>
              ) : (
                <>
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="mb-2 text-lg text-gray-500">No saved recipes yet</p>
                  <p className="mb-6 text-gray-400">
                    Start exploring and save your favorite recipes!
                  </p>
                  <Button className="bg-gradient-to-r from-primary-600 to-primary-400">
                    <ChefHat className="w-5 h-5 mr-2" />
                    Explore Recipes
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredAndSortedRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden transition-all duration-300 group hover:shadow-2xl">
                    {/* Recipe Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-pink-100 dark:from-gray-800 dark:to-gray-900">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <ChefHat className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 opacity-0 bg-black/60 group-hover:opacity-100">
                        <Button
                          size="icon"
                          onClick={() => onRecipeClick?.(recipe)}
                          className="text-gray-900 bg-white/90 hover:bg-white"
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => removeRecipe(recipe._id)}
                          className="text-white bg-red-500/90 hover:bg-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Category Badge */}
                      {recipe.category && (
                        <Badge
                          className="absolute text-gray-900 capitalize top-3 left-3 bg-white/90"
                        >
                          {recipe.category}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      {/* Recipe Title */}
                      <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                        {recipe.name}
                      </h3>

                      {/* Description */}
                      {recipe.description && (
                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        {recipe.cookingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{recipe.cookingTime}m</span>
                          </div>
                        )}
                        {recipe.servings && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{recipe.servings}</span>
                          </div>
                        )}
                        {recipe.averageRating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{recipe.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Difficulty Badge */}
                      {recipe.difficulty && (
                        <div className="flex gap-2">
                          <Badge
                            variant="secondary"
                            className={`capitalize ${
                              recipe.difficulty === 'easy'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : recipe.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {recipe.difficulty}
                          </Badge>
                        </div>
                      )}

                      {/* Action Buttons (Mobile) */}
                      <div className="flex gap-2 mt-4 md:hidden">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRecipeClick?.(recipe)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRecipe(recipe._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
