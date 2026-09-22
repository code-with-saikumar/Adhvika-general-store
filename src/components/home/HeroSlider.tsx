import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import adhvikaGeneral2 from '@/assets/adhvika-general-2.jpeg';
import heroBgPattern from '@/assets/hero-bg-pattern.jpg';
import categoryBangles from '@/assets/category-bangles.jpg';
import categoryFancy from '@/assets/category-fancy.jpg';
import shopCosmetics from '@/assets/shop-cosmetics.jpg';
import goldChains from '@/assets/gold-chains.jpg';

// contain = show full image without cropping; cover = fill and crop
const slides = [
  { src: adhvikaGeneral2, alt: 'Adhvika Store Banner', fit: 'contain' as const, bg: '#e8c832' },
  { src: categoryBangles, alt: 'Bangles Collection', fit: 'cover' as const, bg: '#000' },
  { src: shopCosmetics, alt: 'Perfumes, Cosmetics & Beauty Items', fit: 'cover' as const, bg: '#000' },
  { src: goldChains, alt: 'Gold Chains & Necklaces', fit: 'cover' as const, bg: '#000' },
  { src: categoryFancy, alt: 'Fancy Items & Accessories', fit: 'cover' as const, bg: '#000' },
  { src: heroBgPattern, alt: 'Beautiful Bangles', fit: 'cover' as const, bg: '#000' },
];

const HeroSlider: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const safeIndex = current % slides.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden min-h-[420px] md:min-h-[520px]">
      {/* Sliding background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={safeIndex}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0" style={{ backgroundColor: slides[safeIndex].bg }}>
            <img
              src={slides[safeIndex].src}
              alt={slides[safeIndex].alt}
              className={`w-full h-full saturate-[1.3] contrast-[1.05] ${
                slides[safeIndex].fit === 'contain' ? 'object-contain' : 'object-cover'
              }`}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60" />

      {/* Decorative blurs */}
      <div className="absolute top-8 left-8 w-40 h-40 bg-accent/15 rounded-full blur-3xl" />
      <div className="absolute bottom-4 right-8 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[420px] md:min-h-[520px] py-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-5"
        >
          <span className="text-sm font-medium text-white">✨ New Collection Arrived!</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 drop-shadow-lg"
        >
          Welcome to <span className="text-accent">Adhvika Store</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/85 mb-8 text-center max-w-xl"
        >
          Your one-stop shop for bangles, fancy items, cosmetics, and daily essentials
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button variant="gold" size="lg" onClick={() => navigate('/products')}>
            Shop Now <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/40 text-white hover:bg-white/20"
            onClick={() => navigate('/products?category=bangles')}
          >
            View Bangles
          </Button>
        </motion.div>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safeIndex ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  );
};

export default HeroSlider;
