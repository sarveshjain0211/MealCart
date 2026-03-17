import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Busy Professional",
      image: "👩‍💼",
      rating: 5,
      text: "MealCart has completely changed how I approach meal planning. What used to take hours now takes minutes. The AI suggestions are spot-on!",
      highlight: "Time-saving"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Fitness Coach",
      image: "💪",
      rating: 5,
      text: "The nutritional information and dietary filtering is incredibly accurate. My clients love using MealCart to track their meal plans.",
      highlight: "Nutrition tracking"
    },
    {
      id: 3,
      name: "Jennifer Davis",
      role: "Home Chef",
      image: "👨‍🍳",
      rating: 5,
      text: "The grocery list feature is a game-changer. No more forgotten ingredients or duplicate items. It's like having a personal assistant!",
      highlight: "Smart shopping"
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Health Enthusiast",
      image: "🧘",
      rating: 5,
      text: "I'm vegan and the filter options are fantastic. Found so many amazing recipes I never would have discovered otherwise.",
      highlight: "Dietary support"
    },
    {
      id: 5,
      name: "Emily Watson",
      role: "Working Parent",
      image: "👩‍👧‍👦",
      rating: 5,
      text: "The meal planning feature saved my sanity. My family gets variety, healthy meals, and I actually enjoy cooking again!",
      highlight: "Family-friendly"
    },
    {
      id: 6,
      name: "Tom Anderson",
      role: "Culinary Student",
      image: "🎓",
      rating: 5,
      text: "The AI assistant is incredible for learning new techniques and understanding different cuisines. Best cooking companion ever!",
      highlight: "Learning tool"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              ⭐ Loved by Users
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Users Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy cooks who've transformed their kitchen experience with MealCart
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-border/50">
          <StatsCard number="45K+" label="Active Users" icon="👥" />
          <StatsCard number="98%" label="Satisfaction Rate" icon="😊" />
          <StatsCard number="2M+" label="Recipes Discovered" icon="🍽️" />
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="group glass p-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] border border-border/50 hover:border-primary/50 relative overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote className="w-5 h-5 text-primary/50" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-foreground mb-6 leading-relaxed italic">
          "{testimonial.text}"
        </p>

        {/* Highlight Badge */}
        <div className="mb-6">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            {testimonial.highlight}
          </span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">{testimonial.image}</div>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ number, label, icon }) => (
  <div className="text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
      {number}
    </p>
    <p className="text-muted-foreground">{label}</p>
  </div>
);

export default Testimonials;
