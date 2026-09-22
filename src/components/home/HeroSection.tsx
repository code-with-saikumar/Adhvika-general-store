import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-maroon-light/95" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-5 w-80 h-80 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-gold-light rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/40 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px] py-12 lg:py-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary-foreground"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">New Collection Arrived!</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Beautiful
              <span className="block text-accent">Bangles & Fancy</span>
              Items
            </h1>

            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              Your trusted destination for quality general store items, 
              traditional bangles, and trendy fashion accessories. 
              Shop from the comfort of your home!
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="gold"
                size="xl"
                onClick={() => navigate('/products')}
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                onClick={() => navigate('/products?category=bangles')}
              >
                View Bangles
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, text: 'Free Delivery' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: HeadphonesIcon, text: '24/7 Support' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-primary-foreground/80"
                >
                  <item.icon className="h-4 w-4 text-accent" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-float">
                <img
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"
                  alt="Beautiful Bangles Collection"
                  className="w-full h-[500px] object-cover saturate-[1.4] contrast-[1.1] brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -right-4 top-20 bg-card rounded-xl p-4 shadow-elegant"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">500+</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 bottom-20 bg-card rounded-xl p-4 shadow-elegant"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">Genuine</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
