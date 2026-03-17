import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Users, Star, Search } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const RecipeGrid = ({ recipes, loading, onRecipeClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No recipes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse our popular categories
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <RecipeCard 
          key={recipe.id || index} 
          recipe={recipe} 
          index={index}
          onClick={() => onRecipeClick && onRecipeClick(recipe)}
        />
      ))}
    </div>
  );
};

const RecipeCard = ({ recipe, index, onClick }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">🍳</div>
            </div>
          )}
          
          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>

          {/* Category Badge */}
          {recipe.category && (
            <div className="absolute top-4 left-4">
              <Badge variant="default">{recipe.category}</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title || recipe.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {recipe.description || 'Delicious recipe to try at home'}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.time || '30 min'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings || '4 servings'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{recipe.rating || '4.5'}</span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0">
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
            onClick={onClick}
          >
            View Recipe
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const RecipeCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="h-56 bg-muted animate-pulse" />
    <CardContent className="p-6">
      <div className="h-6 bg-muted rounded animate-pulse mb-2" />
      <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4" />
      <div className="flex gap-4">
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
      </div>
    </CardContent>
  </Card>
);

export default RecipeGrid;
