import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, X, Edit2, Trash2, Calendar, AlertTriangle, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PantryManager = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, fresh, expiring, expired
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    unit: 'pieces',
    category: 'other',
    expirationDate: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'vegetables', 'fruits', 'dairy', 'meat', 'grains', 
    'spices', 'canned', 'frozen', 'beverages', 'other'
  ];

  const units = ['pieces', 'kg', 'g', 'L', 'ml', 'cups', 'tbsp', 'tsp'];

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const fetchPantryItems = async () => {
    try {
      setLoading(true);
      console.log('[PantryManager] Fetching pantry items');
      const response = await axios.get(`${API_BASE_URL}/users/pantry`);
      console.log('[PantryManager] Response:', response.data);
      
      const items = response.data.data || [];
      console.log('[PantryManager] Items count:', items.length);
      
      setPantryItems(items);
    } catch (error) {
      console.error('[PantryManager] Error fetching pantry items:', error);
      console.error('[PantryManager] Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateItem = async () => {
    try {
      console.log('[PantryManager] Saving item:', { editingItem, formData });
      
      if (editingItem) {
        await axios.put(`${API_BASE_URL}/users/pantry/${editingItem._id}`, formData);
        console.log('[PantryManager] Item updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/users/pantry`, formData);
        console.log('[PantryManager] Item added successfully');
      }
      
      fetchPantryItems();
      closeModal();
    } catch (error) {
      console.error('[PantryManager] Error saving item:', error);
      console.error('[PantryManager] Error response:', error.response?.data);
      alert(`Failed to save item: ${error.response?.data?.message || error.message}`);
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/pantry/${itemId}`);
      fetchPantryItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      category: item.category,
      expirationDate: item.expirationDate ? item.expirationDate.split('T')[0] : '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : ''
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      amount: '',
      unit: 'pieces',
      category: 'other',
      expirationDate: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return 'none';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 3) return 'expiring';
    return 'fresh';
  };

  const getExpiryBadge = (expiryDate) => {
    const status = getExpiryStatus(expiryDate);
    const badges = {
      expired: { text: 'Expired', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      expiring: { text: 'Expiring Soon', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      fresh: { text: 'Fresh', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      none: { text: 'No Expiry', className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' }
    };
    return badges[status];
  };

  const filteredItems = pantryItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterStatus === 'all') return matchesSearch;
      const status = getExpiryStatus(item.expirationDate);
      return matchesSearch && status === filterStatus;
    });

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = filteredItems.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Pantry Manager</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Keep track of your ingredients and expiry dates
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-400"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'fresh', 'expiring', 'expired'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      onClick={() => setFilterStatus(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{pantryItems.length}</p>
                  </div>
                  <Package className="w-10 h-10 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Fresh</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'fresh').length}
                    </p>
                  </div>
                  <Calendar className="w-10 h-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiring Soon</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'expiring').length}
                    </p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Expired</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'expired').length}
                    </p>
                  </div>
                  <X className="w-10 h-10 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pantry Items by Category */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
                  <div className="space-y-3">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="h-20 bg-gray-100 dark:bg-gray-800 rounded" />
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
                      <CardTitle className="capitalize gradient-text flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {category}
                        <Badge variant="secondary">{items.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => {
                          const badge = getExpiryBadge(item.expirationDate);
                          return (
                            <motion.div
                              key={item._id}
                              layout
                              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary transition-all hover:shadow-lg"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.amount} {item.unit}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteItem(item._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {item.expirationDate && (
                                <div className="space-y-2">
                                  <Badge className={badge.className}>
                                    {badge.text}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    Expires: {new Date(item.expirationDate).toLocaleDateString()}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery || filterStatus !== 'all'
                  ? 'No items match your filters'
                  : 'Your pantry is empty. Add some items to get started!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingItem ? 'Edit Item' : 'Add Item'}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={closeModal}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                      placeholder="e.g., Tomatoes"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 capitalize"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={addOrUpdateItem}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400"
                      disabled={!formData.name || !formData.amount}
                    >
                      {editingItem ? 'Update' : 'Add'} Item
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

export default PantryManager;
