import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Check if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

// Get animation duration based on device
const getAnimationDuration = (baseDuration) => {
  return isMobile() ? baseDuration * 1.5 : baseDuration; // Slower on mobile
};

// Get stagger amount based on device
const getStaggerAmount = (baseAmount) => {
  return isMobile() ? baseAmount * 0.8 : baseAmount; // Adjust stagger for mobile
};

export const useGSAPAnimations = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.recipe-card');
    const animDuration = getAnimationDuration(0.8);
    const staggerAmount = getStaggerAmount(0.6);
    
    // Set initial state
    gsap.set(cards, {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotateX: 15,
    });

    // Create staggered entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: animDuration,
      ease: "back.out(1.7)",
      stagger: {
        amount: staggerAmount,
        from: "start"
      }
    });

    // Add hover animations to each card (desktop only)
    if (!isMobile()) {
      cards.forEach((card) => {
        const favoriteBtn = card.querySelector('.favorite-btn');
        const content = card.querySelector('.recipe-content');
        const header = card.querySelector('.recipe-header');
        const actions = card.querySelector('.recipe-actions');

        // Card hover animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -12,
            scale: 1.03,
            rotateY: Math.random() * 6 - 3, // Random slight rotation
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            duration: 0.4,
            ease: "power2.out"
          });

          // Animate content elements
          gsap.to(content, {
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          });

          gsap.to(header, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });

          gsap.to(actions, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });

          // Favorite button animation
          if (favoriteBtn) {
            gsap.to(favoriteBtn, {
              scale: 1.2,
              rotation: 360,
              duration: 0.5,
              ease: "elastic.out(1, 0.3)"
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            rotateY: 0,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            duration: 0.4,
            ease: "power2.out"
          });

          gsap.to([content, header, actions], {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });

          if (favoriteBtn) {
            gsap.to(favoriteBtn, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });

        // Click animation
        card.addEventListener('click', (e) => {
          if (e.target.closest('.favorite-btn, .recipe-actions')) return;
          
          gsap.to(card, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
        });
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
        card.removeEventListener('click', () => {});
      });
    };
  }, []);

  return containerRef;
};

export const useCardMagnetism = () => {
  const magnetRef = useRef(null);

  useEffect(() => {
    if (!magnetRef.current) return;
    
    // Disable magnetism on mobile devices
    if (isMobile()) return;

    const card = magnetRef.current;
    const strength = 0.3;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(card, {
        x: deltaX,
        y: deltaY,
        rotation: deltaX * 0.1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return magnetRef;
};

export const useScrollAnimations = () => {
  useEffect(() => {
    // Kill existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Animate elements on scroll
    gsap.utils.toArray('.recipe-card').forEach((card) => {
      const animDuration = getAnimationDuration(1);
      
      gsap.fromTo(card, 
        {
          opacity: 0,
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: animDuration,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};
