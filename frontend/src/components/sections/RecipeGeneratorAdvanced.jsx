import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChefHat, Clock, Users, X, Plus, Wand2, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const RecipeGeneratorAdvanced = ({ onRecipeGenerated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [formData, setFormData] = useState({
    ingredients: [],
    cuisine: '',
    mealType: '',
    dietaryRestrictions: [],
    cookingTime: '',
    difficulty: '',
    servings: 4,
    equipment: [],
    preferences: ''
  });

  const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French', 'American', 'Mediterranean', 'Korean'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein'];
  const difficulties = ['easy', 'medium', 'hard'];
  const equipmentOptions = ['oven', 'stovetop', 'microwave', 'air fryer', 'slow cooker', 'grill', 'blender', 'food processor'];

  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentEquipment, setCurrentEquipment] = useState('');

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addEquipment = () => {
    if (currentEquipment && !formData.equipment.includes(currentEquipment)) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, currentEquipment]
      }));
      setCurrentEquipment('');
    }
  };

  const toggleDietaryRestriction = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const generateRecipe = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/ai/generate-recipe`, {
        ingredients: formData.ingredients,
        cuisine: formData.cuisine,
        mealType: formData.mealType,
        dietaryRestrictions: formData.dietaryRestrictions,
        cookingTime: formData.cookingTime,
        difficulty: formData.difficulty,
        servings: formData.servings,
        equipment: formData.equipment,
        additionalPreferences: formData.preferences
      });

      setGeneratedRecipe(response.data.recipe || response.data);
      setStep(4);
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    try {
      // Prepare recipe data with required fields
      const recipeData = {
        ...generatedRecipe,
        externalId: generatedRecipe.externalId || `ai-generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: generatedRecipe.name || generatedRecipe.title || 'Untitled Recipe',
        ingredients: generatedRecipe.ingredients || [],
        instructions: generatedRecipe.instructions || generatedRecipe.steps || []
      };

      // Validate required fields
      if (!recipeData.ingredients.length) {
        alert('Recipe must have at least one ingredient');
        return;
      }

      if (!recipeData.instructions.length) {
        alert('Recipe must have instructions');
        return;
      }

      await axios.post(`${API_BASE_URL}/recipes/save`, recipeData);
      alert('Recipe saved successfully!');
      onRecipeGenerated?.(generatedRecipe);
      resetForm();
    } catch (error) {
      console.error('Error saving recipe:', error);
      const errorMsg = error.response?.data?.message || 'Failed to save recipe';
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setStep(1);
    setGeneratedRecipe(null);
    setFormData({
      ingredients: [],
      cuisine: '',
      mealType: '',
      dietaryRestrictions: [],
      cookingTime: '',
      difficulty: '',
      servings: 4,
      equipment: [],
      preferences: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-3xl flex items-center justify-center mr-4">
              <Wand2 className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">AI Recipe Generator</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create custom recipes powered by AI
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s
                          ? 'bg-gradient-to-r from-primary-600 to-primary-400 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {s}
                    </div>
                    <span className={`text-sm font-medium ${
                      step >= s ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                    }`}>
                      {s === 1 ? 'Ingredients' : s === 2 ? 'Preferences' : 'Details'}
                    </span>
                  </div>
                  {s < 3 && (
                    <div className={`h-0.5 w-16 ${
                      step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Ingredients */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">What ingredients do you have?</CardTitle>
                  <CardDescription>
                    Add the ingredients you want to use (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={currentIngredient}
                      onChange={(e) => setCurrentIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                      placeholder="e.g., Chicken, Tomatoes, Garlic..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                    />
                    <Button onClick={addIngredient}>
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  {formData.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-2 text-sm"
                        >
                          {ingredient}
                          <button
                            onClick={() => removeIngredient(index)}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-6 flex gap-3">
                    <Button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                    >
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Choose your preferences</CardTitle>
                  <CardDescription>
                    Customize the recipe to match your tastes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cuisine */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Cuisine Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {cuisines.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => setFormData({ ...formData, cuisine })}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            formData.cuisine === cuisine
                              ? 'border-primary bg-primary-50 dark:bg-primary-900 text-primary'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meal Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Meal Type
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {mealTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, mealType: type })}
                          className={`px-4 py-2 rounded-lg border-2 capitalize transition-all ${
                            formData.mealType === type
                              ? 'border-primary bg-primary-50 dark:bg-primary-900 text-primary'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Dietary Restrictions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dietaryOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleDietaryRestriction(option)}
                          className={`px-4 py-2 rounded-lg border-2 capitalize transition-all ${
                            formData.dietaryRestrictions.includes(option)
                              ? 'border-primary bg-primary-50 dark:bg-primary-900 text-primary'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                    >
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="gradient-text">Final details</CardTitle>
                  <CardDescription>
                    Set cooking time, difficulty, and other parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cooking Time & Servings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Cooking Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.cookingTime}
                        onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                        placeholder="30"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Servings
                      </label>
                      <input
                        type="number"
                        value={formData.servings}
                        onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 capitalize"
                      >
                        <option value="">Any</option>
                        {difficulties.map(d => (
                          <option key={d} value={d} className="capitalize">{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Available Equipment
                    </label>
                    <div className="flex gap-3 mb-3">
                      <select
                        value={currentEquipment}
                        onChange={(e) => setCurrentEquipment(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 capitalize"
                      >
                        <option value="">Select equipment...</option>
                        {equipmentOptions.map(eq => (
                          <option key={eq} value={eq} className="capitalize">{eq}</option>
                        ))}
                      </select>
                      <Button onClick={addEquipment}>
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    {formData.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.equipment.map((eq, index) => (
                          <Badge key={index} variant="secondary" className="capitalize px-3 py-2">
                            {eq}
                            <button
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                equipment: prev.equipment.filter((_, i) => i !== index)
                              }))}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Preferences (Optional)
                    </label>
                    <textarea
                      value={formData.preferences}
                      onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                      placeholder="Any specific requirements or preferences..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 resize-none"
                    />
                  </div>

                  <div className="pt-6 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={generateRecipe}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Recipe
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Generated Recipe */}
          {step === 4 && generatedRecipe && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-400 p-8 text-white text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">{generatedRecipe.name}</h2>
                  {generatedRecipe.description && (
                    <p className="text-white/90">{generatedRecipe.description}</p>
                  )}
                </div>

                <CardContent className="p-8 space-y-6">
                  {/* Meta Info */}
                  <div className="flex justify-center gap-6">
                    {generatedRecipe.cookingTime && (
                      <div className="text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cook Time</p>
                        <p className="font-semibold">{generatedRecipe.cookingTime} mins</p>
                      </div>
                    )}
                    {generatedRecipe.servings && (
                      <div className="text-center">
                        <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Servings</p>
                        <p className="font-semibold">{generatedRecipe.servings}</p>
                      </div>
                    )}
                    {generatedRecipe.difficulty && (
                      <div className="text-center">
                        <ChefHat className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
                        <p className="font-semibold capitalize">{generatedRecipe.difficulty}</p>
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  {generatedRecipe.ingredients && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Ingredients
                      </h3>
                      <ul className="space-y-2">
                        {generatedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instructions */}
                  {generatedRecipe.instructions && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        Instructions
                      </h3>
                      <ol className="space-y-3">
                        {generatedRecipe.instructions.map((instruction, index) => (
                          <li key={index} className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </span>
                            <p className="text-gray-700 dark:text-gray-300 pt-1">{instruction}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-6">
                    <Button variant="outline" onClick={resetForm} className="flex-1">
                      Generate Another
                    </Button>
                    <Button
                      onClick={saveRecipe}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                    >
                      <ChefHat className="w-5 h-5 mr-2" />
                      Save Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecipeGeneratorAdvanced;
