import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Users, BookOpen, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const Features = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized recipe suggestions based on your preferences and dietary needs.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Quick Meal Planning',
      description: 'Plan your weekly meals in minutes with our intelligent meal planner.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Recipe Collection',
      description: 'Access thousands of curated recipes from various cuisines worldwide.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Driven',
      description: 'Share recipes, tips, and connect with food enthusiasts globally.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Nutrition Tracking',
      description: 'Monitor your nutritional intake with detailed analytics and insights.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Dietary Filters',
      description: 'Filter recipes by dietary restrictions, allergies, and preferences.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Cook Better</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make your cooking journey enjoyable and effortless
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
        <CardContent className="p-6">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 text-white transform group-hover:scale-110 transition-transform duration-300`}>
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Features;
