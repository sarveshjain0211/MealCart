import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, Save, X, Heart, Book, Users as UsersIcon, ChefHat } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const UserProfilePage = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    profileImage: '',
    dietaryRestrictions: [],
    allergens: []
  });
  const [stats, setStats] = useState({
    recipes: 0,
    favorites: 0,
    followers: 0,
    following: 0
  });
  const [newDietaryTag, setNewDietaryTag] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('[UserProfile] Fetching profile');
      const response = await axios.get(`${API_BASE_URL}/users/profile`);
      console.log('[UserProfile] Profile response:', response.data);
      
      if (response.data.success) {
        const userData = response.data.data; // Backend returns data, not user
        console.log('[UserProfile] User data:', userData);
        setProfile({
          username: userData.username || '',
          email: userData.email || '',
          bio: userData.bio || '',
          profileImage: userData.profileImage || '',
          dietaryRestrictions: userData.dietaryRestrictions || [],
          allergens: userData.allergens || []
        });
      }
    } catch (error) {
      console.error('[UserProfile] Error fetching profile:', error);
      console.error('[UserProfile] Error response:', error.response?.data);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('[UserProfile] Fetching stats');
      const [recipesRes, favoritesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/recipes/my-recipes?limit=0`),
        axios.get(`${API_BASE_URL}/users/favorites?limit=0`)
      ]);
      
      console.log('[UserProfile] Recipes response:', recipesRes.data);
      console.log('[UserProfile] Favorites response:', favoritesRes.data);
      
      setStats({
        recipes: recipesRes.data.count || 0,
        favorites: favoritesRes.data.data?.pagination?.totalRecipes || 0,
        followers: profile.followerCount || 0,
        following: profile.followingCount || 0
      });
      
      console.log('[UserProfile] Stats set:', {
        recipes: recipesRes.data.count || 0,
        favorites: favoritesRes.data.data?.pagination?.totalRecipes || 0
      });
    } catch (error) {
      console.error('[UserProfile] Error fetching stats:', error);
      console.error('[UserProfile] Error response:', error.response?.data);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      console.log('[UserProfile] Saving profile:', profile);
      
      const response = await axios.put(`${API_BASE_URL}/users/profile`, profile);
      console.log('[UserProfile] Save response:', response.data);
      
      if (response.data.success) {
        setIsEditing(false);
        const updatedUser = response.data.data; // Backend returns data, not user
        if (onUpdate) onUpdate(updatedUser);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('[UserProfile] Error updating profile:', error);
      console.error('[UserProfile] Error response:', error.response?.data);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addDietaryRestriction = () => {
    if (newDietaryTag && !profile.dietaryRestrictions.includes(newDietaryTag)) {
      setProfile({
        ...profile,
        dietaryRestrictions: [...profile.dietaryRestrictions, newDietaryTag]
      });
      setNewDietaryTag('');
    }
  };

  const removeDietaryRestriction = (tag) => {
    setProfile({
      ...profile,
      dietaryRestrictions: profile.dietaryRestrictions.filter(t => t !== tag)
    });
  };

  const addAllergen = () => {
    if (newAllergen && !profile.allergens.includes(newAllergen)) {
      setProfile({
        ...profile,
        allergens: [...profile.allergens, newAllergen]
      });
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen) => {
    setProfile({
      ...profile,
      allergens: profile.allergens.filter(a => a !== allergen)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <Input
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="text-3xl font-bold mb-2"
                      placeholder="Username"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {profile.username}
                    </h1>
                  )}
                  
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {profile.bio || 'No bio yet'}
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ChefHat className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.recipes}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recipes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.favorites}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <UsersIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.followers}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Book className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.following}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dietary Restrictions & Allergens */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Dietary Restrictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Dietary Restrictions</CardTitle>
                <CardDescription>
                  Manage your dietary preferences for personalized recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.dietaryRestrictions?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => removeDietaryRestriction(tag)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {profile.dietaryRestrictions?.length === 0 && (
                    <p className="text-gray-500 text-sm">No dietary restrictions set</p>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newDietaryTag}
                      onChange={(e) => setNewDietaryTag(e.target.value)}
                      placeholder="Add restriction (e.g., vegetarian)"
                      onKeyPress={(e) => e.key === 'Enter' && addDietaryRestriction()}
                    />
                    <Button onClick={addDietaryRestriction} variant="outline">
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Allergens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Allergens</CardTitle>
                <CardDescription>
                  List your allergies to avoid them in recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.allergens?.map((allergen) => (
                    <Badge key={allergen} variant="destructive" className="text-sm">
                      {allergen}
                      {isEditing && (
                        <button
                          onClick={() => removeAllergen(allergen)}
                          className="ml-2 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {profile.allergens?.length === 0 && (
                    <p className="text-gray-500 text-sm">No allergens listed</p>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newAllergen}
                      onChange={(e) => setNewAllergen(e.target.value)}
                      placeholder="Add allergen (e.g., nuts)"
                      onKeyPress={(e) => e.key === 'Enter' && addAllergen()}
                    />
                    <Button onClick={addAllergen} variant="outline">
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
