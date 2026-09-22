import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/products?category=${category.slug}`}>
        <div className="group relative h-72 rounded-2xl overflow-hidden shadow-elegant">
          {/* Background Image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              {category.name}
            </h3>
            <p className="text-white/80 text-sm mb-4 line-clamp-2">
              {category.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">
                {category.itemCount}+ Items
              </span>
              <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
                Explore
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
