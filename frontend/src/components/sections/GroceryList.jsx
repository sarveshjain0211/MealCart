import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Check, X, Package, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    unit: 'pieces',
    category: 'Other'
  });

  const categories = [
    'vegetables', 'fruits', 'dairy', 'meat', 'grains',
    'spices', 'canned', 'frozen', 'beverages', 'other'
  ];

  const units = ['pieces', 'kg', 'g', 'L', 'ml', 'cups', 'tbsp', 'tsp'];

  useEffect(() => {
    fetchGroceryList();
    fetchUserRecipes();
  }, []);

  const fetchGroceryList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/grocerylist`);
      const items = response.data.groceryList || [];
      setGroceryList(items);
    } catch (error) {
      console.error('Error fetching grocery list:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/my-recipes?limit=50`);
      setRecipes(response.data.data?.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const generateListFromRecipes = async () => {
    try {
      await axios.post(`${API_BASE_URL}/grocerylist/generate`, {
        recipeIds: selectedRecipes
      });
      fetchGroceryList();
      setSelectedRecipes([]);
    } catch (error) {
      console.error('Error generating list:', error);
      alert('Failed to generate grocery list');
    }
  };

  const addItem = async () => {
    try {
      // Validate item
      if (!newItem.name || !newItem.name.trim()) {
        alert('Please enter an item name');
        return;
      }

      const itemToAdd = {
        name: newItem.name.trim(),
        amount: newItem.amount || '1',
        unit: newItem.unit || 'pieces',
        category: newItem.category || 'other'
      };

      await axios.post(`${API_BASE_URL}/grocerylist/item`, itemToAdd);

      // Refresh the list immediately
      await fetchGroceryList();
      
      setShowAddModal(false);
      setNewItem({ name: '', amount: '', unit: 'pieces', category: 'Other' });
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`Failed to add item: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateItemQuantity = async (itemId, change) => {
    try {
      const item = groceryList.find(i => i._id === itemId);
      const newAmount = Math.max(0, parseFloat(item.amount) + change);
      
      await axios.put(`${API_BASE_URL}/grocerylist/item/${itemId}`, {
        amount: newAmount.toString()
      });
      fetchGroceryList();
    } catch (error) {
      console.error('Error updating amount:', error);
    }
  };

  const toggleItemPurchased = async (itemId) => {
    try {
      const item = groceryList.find(i => i._id === itemId);
      await axios.put(`${API_BASE_URL}/grocerylist/item/${itemId}`, {
        checked: !item.checked
      });
      fetchGroceryList();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/grocerylist/item/${itemId}`);
      fetchGroceryList();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const clearList = async () => {
    if (!confirm('Are you sure you want to clear the entire list?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/grocerylist/clear`);
      fetchGroceryList();
    } catch (error) {
      console.error('Error clearing list:', error);
    }
  };

  const exportList = () => {
    const listText = groceryList
      .map(item => `${item.checked ? '☑' : '☐'} ${item.name} - ${item.amount} ${item.unit}`)
      .join('\n');
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    a.click();
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = groceryList.filter(item => 
      item.category && item.category.toLowerCase() === category.toLowerCase()
    );
    return acc;
  }, {});

  const totalItems = groceryList.length;
  const checkedItems = groceryList.filter(item => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

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
              <h1 className="mb-2 text-4xl font-bold gradient-text">Grocery List</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your shopping list efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportList}
                disabled={groceryList.length === 0}
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-primary-600 to-primary-400"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Progress Card */}
          <Card className="border-0 bg-gradient-to-br from-primary-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Shopping Progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {checkedItems} of {totalItems} items checked
                  </p>
                </div>
                <div className="text-3xl font-bold gradient-text">
                  {Math.round(progress)}%
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
                />
              </div>
              {totalItems > 0 && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearList}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Generate from Recipes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="gradient-text">Generate from Recipes</CardTitle>
              <CardDescription>
                Select recipes to automatically add their ingredients to your list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4">
                {recipes.slice(0, 8).map((recipe) => (
                  <button
                    key={recipe._id}
                    onClick={() => {
                      setSelectedRecipes(prev =>
                        prev.includes(recipe._id)
                          ? prev.filter(id => id !== recipe._id)
                          : [...prev, recipe._id]
                      );
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedRecipes.includes(recipe._id)
                        ? 'border-primary bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {recipe.name}
                    </p>
                  </button>
                ))}
              </div>
              <Button
                onClick={generateListFromRecipes}
                disabled={selectedRecipes.length === 0}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-400"
              >
                <Package className="w-5 h-5 mr-2" />
                Generate List from {selectedRecipes.length} Recipe{selectedRecipes.length !== 1 ? 's' : ''}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grocery Items by Category */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-1/4 h-6 mb-4 bg-gray-200 rounded dark:bg-gray-700" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-16 bg-gray-100 rounded dark:bg-gray-800" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category, index) => {
              const items = groupedItems[category];
              if (items.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                      <CardTitle className="flex items-center gap-2 capitalize gradient-text">
                        <ShoppingCart className="w-5 h-5" />
                        {category}
                        <Badge variant="secondary">{items.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <AnimatePresence>
                          {items.map((item) => (
                            <motion.div
                              key={item._id}
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                                item.checked
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <button
                                onClick={() => toggleItemPurchased(item._id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  item.checked
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300 hover:border-primary'
                                }`}
                              >
                                {item.checked && <Check className="w-4 h-4 text-white" />}
                              </button>

                              <div className="flex-1">
                                <h3
                                  className={`font-semibold ${
                                    item.checked
                                      ? 'text-gray-500 dark:text-gray-400 line-through'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.amount} {item.unit}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateItemQuantity(item._id, -1)}
                                  className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  disabled={item.checked}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 font-semibold text-center">
                                  {item.amount}
                                </span>
                                <button
                                  onClick={() => updateItemQuantity(item._id, 1)}
                                  className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                  disabled={item.checked}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => deleteItem(item._id)}
                                className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {groceryList.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="mb-4 text-lg text-gray-500">
                Your grocery list is empty
              </p>
              <p className="mb-6 text-gray-400">
                Add items manually or generate from your recipes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Item Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white shadow-2xl dark:bg-gray-900 rounded-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add Item
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                      placeholder="e.g., Milk"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={newItem.amount}
                        onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Unit
                      </label>
                      <select
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-4 py-2 capitalize bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={addItem}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                      disabled={!newItem.name || !newItem.amount}
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GroceryList;
