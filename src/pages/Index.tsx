import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Gift, TruckIcon, BadgeCheck, BadgePercent, Loader2 } from 'lucide-react';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';
import { useRealtimeProducts, useRealtimeReviews } from '@/hooks/useRealtimeSubscription';
import { useAuth } from '@/hooks/useAuth';
import HeroSlider from '@/components/home/HeroSlider';
import categoryGeneral from '@/assets/category-general.jpg';
import categoryBangles from '@/assets/category-bangles.jpg';
import categoryFancy from '@/assets/category-fancy.jpg';
const categories = [
  { id: 'general', name: 'General Store', slug: 'general', description: 'Daily essentials & groceries', image: categoryGeneral },
  { id: 'bangles', name: 'Bangles Collection', slug: 'bangles', description: 'Traditional & designer bangles', image: categoryBangles },
  { id: 'fancy', name: 'Fancy Items', slug: 'fancy', description: 'Cosmetics, jewelry & gifts', image: categoryFancy }
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: featuredProducts = [], isLoading: featuredLoading } = useFeaturedProducts();
  const { data: allProducts = [] } = useProducts();
  const newArrivals = allProducts.filter(p => p.is_new).slice(0, 4);
  
  // Enable real-time updates
  useRealtimeProducts();
  useRealtimeReviews();

  // Handle scrollTo query param from bottom nav
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.search]);

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Delivery',
      description: 'On orders above ₹500',
    },
    {
      icon: BadgeCheck,
      title: '100% Quality',
      description: 'Genuine products only',
    },
    {
      icon: BadgePercent,
      title: 'Best Prices',
      description: 'Competitive pricing',
    },
    {
      icon: Gift,
      title: 'Gift Wrapping',
      description: 'Free gift packaging',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Slider with background carousel */}
      <HeroSlider />

      {/* Features */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="shop-by-category" className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our wide range of products across different categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/products?category=${category.slug}`)}
                className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-display text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked items for you
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="hidden md:flex"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/products')}>
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground">
                  Fresh additions to our collection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner - Only show for non-logged in users */}
      {!user && (
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-maroon-light" />
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                  Get 10% Off Your First Order!
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                  Sign up today and receive exclusive discounts on bangles, cosmetics, and more.
                </p>
                <Button
                  variant="gold"
                  size="xl"
                  onClick={() => navigate('/auth?signup=true')}
                >
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials - Uses approved reviews from database */}
      <TestimonialsSection />

      {/* Contact Section */}
      <div id="get-in-touch">
        <ContactSection />
      </div>
    </MainLayout>
  );
};

export default Index;