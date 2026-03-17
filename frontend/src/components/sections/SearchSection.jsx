import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const SearchSection = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const popularTags = [
    'Italian', 'Mexican', 'Asian', 'Vegetarian', 'Vegan',
    'Quick & Easy', 'Healthy', 'Desserts', 'Breakfast', 'Dinner'
  ];

  const handleSearch = () => {
    if (query.trim() || selectedTags.length > 0) {
      onSearch({ query, tags: selectedTags });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <section id="search" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Search Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect <span className="gradient-text">Recipe</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Search thousands of recipes or browse by cuisine and dietary preferences
            </p>
          </div>

          {/* Search Bar */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for recipes, ingredients, cuisines..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-lg border-2 focus:border-primary"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <Button
                size="lg"
                variant="gradient"
                onClick={handleSearch}
                disabled={loading}
                className="h-14 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>

            {/* Selected Tags */}
            <AnimatePresence>
              {selectedTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mt-4 pt-4 border-t"
                >
                  {selectedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge
                        variant="default"
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        <X className="ml-1 w-3 h-3" />
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-sm py-2 px-4"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchSection;
