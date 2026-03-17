import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const TestimonialsCarousel = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarvesh Jain",
      role: "Busy Professional",
      image: "👩‍💼",
      rating: 5,
      text: "MealCart has completely changed how I approach meal planning. What used to take hours now takes minutes. The AI suggestions are spot-on!",
      highlight: "Time-saving"
    },
    {
      id: 2,
      name: "Rohit Kumar",
      role: "Fitness Coach",
      image: "💪",
      rating: 5,
      text: "The nutritional information and dietary filtering is incredibly accurate. My clients love using MealCart to track their meal plans.",
      highlight: "Nutrition tracking"
    },
    {
      id: 3,
      name: "Kundan Singh",
      role: "Home Chef",
      image: "👨‍🍳",
      rating: 5,
      text: "The grocery list feature is a game-changer. No more forgotten ingredients or duplicate items. It's like having a personal assistant!",
      highlight: "Smart shopping"
    },
    {
      id: 4,
      name: "Aisha Patel",
      role: "Health Enthusiast",
      image: "🧘",
      rating: 5,
      text: "I'm vegan and the filter options are fantastic. Found so many amazing recipes I never would have discovered otherwise.",
      highlight: "Dietary support"
    },
    {
      id: 5,
      name: "Neha Sharma",
      role: "Working Parent",
      image: "👩‍👧‍👦",
      rating: 5,
      text: "The meal planning feature saved my sanity. My family gets variety, healthy meals, and I actually enjoy cooking again!",
      highlight: "Family-friendly"
    },
    {
      id: 6,
      name: "Avinash Gupta",
      role: "Culinary Student",
      image: "🎓",
      rating: 5,
      text: "The AI assistant is incredible for learning new techniques and understanding different cuisines. Best cooking companion ever!",
      highlight: "Learning tool"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Set items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= testimonials.length ? 0 : nextIndex;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoScrolling, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-10" />
      
      <div className="container relative z-10 px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Loved by Thousands</span>
          </motion.div>

          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Join thousands of happy cooks who've transformed their kitchen experience
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                >
                  <div className="h-full p-8 transition-all duration-300 border-2 group glass rounded-2xl border-border hover:border-primary/50 hover:shadow-xl">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 flex items-center justify-center w-12 h-12 transition-all duration-300 -translate-x-4 -translate-y-1/2 border-2 rounded-full top-1/2 glass border-border hover:border-primary/50 hover:shadow-lg text-foreground hover:text-primary"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 flex items-center justify-center w-12 h-12 transition-all duration-300 translate-x-4 -translate-y-1/2 border-2 rounded-full top-1/2 glass border-border hover:border-primary/50 hover:shadow-lg text-foreground hover:text-primary"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-scroll indicator */}
          {isAutoScrolling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute flex items-center gap-2 px-3 py-1 text-xs rounded-full top-4 right-4 glass text-muted-foreground"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Auto-playing
            </motion.div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-3"
        >
          <StatsCard number="45K+" label="Active Users" icon="👥" />
          <StatsCard number="98%" label="Satisfaction Rate" icon="😊" />
          <StatsCard number="2M+" label="Recipes Discovered" icon="🍽️" />
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <>
      {/* Quote Icon */}
      <div className="relative mb-4">
        <div className="absolute flex items-center justify-center w-12 h-12 rounded-lg -top-2 -left-2 bg-gradient-to-br from-primary/20 to-primary/5">
          <Quote className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Testimonial Text */}
      <p className="relative z-10 mt-8 mb-6 text-muted-foreground">
        "{testimonial.text}"
      </p>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 pt-4 mt-auto border-t border-border">
        <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-gradient-to-br from-primary to-primary/50">
          {testimonial.image}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold transition-colors text-foreground group-hover:text-primary">
            {testimonial.name}
          </h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
        <div className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          {testimonial.highlight}
        </div>
      </div>
    </>
  );
};

const StatsCard = ({ number, label, icon }) => (
  <div className="p-8 text-center transition-all duration-300 border-2 glass rounded-2xl border-border hover:border-primary/50 hover:shadow-xl group">
    <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <p className="mb-2 text-3xl font-bold gradient-text">
      {number}
    </p>
    <p className="text-sm text-muted-foreground">
      {label}
    </p>
  </div>
);

export default TestimonialsCarousel;
