import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, X, ChefHat, Clock, Trash2, Edit2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const MealPlanner = ({ user }) => {
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('dinner');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    fetchMealPlan();
    fetchUserRecipes();
  }, [selectedDate]);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      console.log('[MealPlanner] Fetching meal plan:', {
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString()
      });

      const response = await axios.get(`${API_BASE_URL}/users/meal-plan`, {
        params: {
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString()
        }
      });

      console.log('[MealPlanner] Response:', response.data);
      const mealPlanData = response.data.data || [];
      console.log('[MealPlanner] Meal plan data:', mealPlanData);
      
      setMealPlan(mealPlanData);
    } catch (error) {
      console.error('[MealPlanner] Error fetching meal plan:', error);
      console.error('[MealPlanner] Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      console.log('[MealPlanner] Fetching user recipes');
      // Fetch all recipes by passing limit=0
      const response = await axios.get(`${API_BASE_URL}/recipes/my-recipes?limit=0`);
      console.log('[MealPlanner] Recipes response:', response.data);
      
      // Backend returns { success, count, recipes }
      const recipesData = response.data.recipes || [];
      console.log('[MealPlanner] Recipes data:', recipesData.length, 'recipes');
      
      setRecipes(recipesData);
    } catch (error) {
      console.error('[MealPlanner] Error fetching recipes:', error);
      console.error('[MealPlanner] Error response:', error.response?.data);
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getWeekDates = () => {
    const startOfWeek = getStartOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const addMealToPlan = async (date, mealType, recipeId) => {
    // Validate all required fields
    if (!date || !mealType || !recipeId) {
      alert('Please select a date, meal type, and recipe');
      return;
    }

    try {
      // Backend expects { date, breakfast, lunch, dinner, snacks }
      // We need to send the full meal plan for the day, updating only the selected meal type
      const mealPlanData = {
        date: date.toISOString().split('T')[0],
        breakfast: mealType === 'breakfast' ? recipeId : null,
        lunch: mealType === 'lunch' ? recipeId : null,
        dinner: mealType === 'dinner' ? recipeId : null,
        snacks: mealType === 'snack' ? [recipeId] : []
      };

      console.log('[MealPlanner] Adding meal to plan:', mealPlanData);
      
      await axios.post(`${API_BASE_URL}/users/meal-plan`, mealPlanData);
      fetchMealPlan();
      setShowAddModal(false);
      setSelectedMealType('dinner');
      setSelectedRecipe(null);
    } catch (error) {
      console.error('[MealPlanner] Error adding meal:', error);
      console.error('[MealPlanner] Error response:', error.response?.data);
      alert(`Failed to add meal to plan: ${error.response?.data?.message || error.message}`);
    }
  };

  const removeMealFromPlan = async (planId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/meal-plan/${planId}`);
      fetchMealPlan();
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  };

  const getMealForSlot = (date, mealType) => {
    const dateStr = date.toISOString().split('T')[0];
    const plan = mealPlan.find(p => p.date === dateStr);
    return plan?.meals?.[mealType];
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

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
              <h1 className="mb-2 text-4xl font-bold gradient-text">Meal Planner</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Plan your weekly meals and stay organized
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-400"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Meal
            </Button>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <Button variant="outline" onClick={() => navigateWeek(-1)}>
              Previous Week
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {getWeekDates()[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                {' - '}
                {getWeekDates()[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigateWeek(1)}>
              Next Week
            </Button>
          </div>
        </motion.div>

        {/* Meal Plan Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 mb-4 bg-gray-200 rounded dark:bg-gray-700" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-20 bg-gray-100 rounded dark:bg-gray-800" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {getWeekDates().map((date, dayIndex) => (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.05 }}
              >
                <Card>
                  <CardHeader className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl gradient-text">
                          {weekDays[date.getDay()]}
                        </CardTitle>
                        <CardDescription>
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </CardDescription>
                      </div>
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {mealTypes.map((mealType) => {
                        const meal = getMealForSlot(date, mealType);
                        return (
                          <div
                            key={mealType}
                            className="p-4 transition-colors border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 hover:border-primary"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="capitalize">
                                {mealType}
                              </Badge>
                              {meal && (
                                <button
                                  onClick={() => removeMealFromPlan(meal._id)}
                                  className="text-red-500 transition-colors hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            {meal ? (
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <ChefHat className="flex-shrink-0 w-4 h-4 mt-1 text-primary" />
                                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                    {meal.name}
                                  </p>
                                </div>
                                {meal.cookingTime && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {meal.cookingTime} mins
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedDate(date);
                                  setShowAddModal(true);
                                }}
                                className="w-full py-2 text-sm text-gray-500 transition-colors hover:text-primary"
                              >
                                + Add {mealType}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Meal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add Meal to Plan
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-4 py-2 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                  />
                </div>

                {/* Meal Type Selection */}
                <div className="mb-6">
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Meal Type *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {mealTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedMealType(type)}
                        className={`px-4 py-2 rounded-lg border-2 capitalize transition-all ${
                          selectedMealType === type
                            ? 'border-primary bg-primary-50 dark:bg-primary-900 text-primary'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipe Selection */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Recipe *
                  </label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {recipes.map((recipe) => (
                      <Card
                        key={recipe._id}
                        className={`cursor-pointer hover:shadow-lg transition-all ${
                          selectedRecipe?._id === recipe._id
                            ? 'ring-2 ring-primary border-primary'
                            : ''
                        }`}
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <CardContent className="p-4">
                          {recipe.image && (
                            <img
                              src={recipe.image}
                              alt={recipe.name}
                              className="object-cover w-full h-32 mb-3 rounded-lg"
                            />
                          )}
                          <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                            {recipe.name}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            {recipe.cookingTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {recipe.cookingTime}m
                              </div>
                            )}
                            {recipe.difficulty && (
                              <Badge variant="secondary" className="capitalize">
                                {recipe.difficulty}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {recipes.length === 0 && (
                    <div className="py-8 text-center">
                      <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No recipes found. Create some recipes first!</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedMealType('dinner');
                      setSelectedRecipe(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => addMealToPlan(selectedDate, selectedMealType, selectedRecipe?._id)}
                    disabled={!selectedDate || !selectedMealType || !selectedRecipe}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                  >
                    Add to Plan
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
