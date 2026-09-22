import React from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { useApprovedReviews } from '@/hooks/useReviews';
import { useRealtimeReviews } from '@/hooks/useRealtimeSubscription';

const TestimonialsSection: React.FC = () => {
  const { data: reviews = [], isLoading } = useApprovedReviews();
  
  // Enable real-time updates for reviews
  useRealtimeReviews();

  // Fallback testimonials when no approved reviews exist
  const defaultTestimonials = [
    {
      id: '1',
      user_name: 'Priya Reddy',
      comment: 'Excellent collection of bangles! The quality is amazing and delivery was super fast.',
      rating: 5,
      location: 'Vijayawada',
    },
    {
      id: '2',
      user_name: 'Lakshmi Devi',
      comment: 'Great prices on groceries and the general store items are always fresh. Highly recommend!',
      rating: 5,
      location: 'Guntur',
    },
    {
      id: '3',
      user_name: 'Sneha Kumari',
      comment: 'Beautiful fancy items collection. Perfect for gifting. Customer service is excellent!',
      rating: 4,
      location: 'Hyderabad',
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews.slice(0, 6) : defaultTestimonials;

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Real reviews from our valued customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`h-5 w-5 ${
                      j < review.rating
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground mb-4 italic line-clamp-3">
                "{review.comment}"
              </p>
              <div>
                <p className="font-semibold text-foreground">{review.user_name}</p>
                {'location' in review && (
                  <p className="text-sm text-muted-foreground">{(review as any).location}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
