import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Loader2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useIsWishlisted, useToggleWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToCart = useAddToCart();
  const isWishlisted = useIsWishlisted(product.id);
  const toggleWishlist = useToggleWishlist();

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add favorites');
      navigate('/auth');
      return;
    }
    toggleWishlist.mutate({ productId: product.id, isWishlisted });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }
    await addToCart.mutateAsync({ productId: product.id });
  };

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
          )}
          {discount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
          )}
        </div>
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews_count})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-sm flex-shrink-0"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || product.stock === 0}
          >
            {addToCart.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
        {product.stock === 0 && <p className="text-xs text-destructive mt-1">Out of Stock</p>}
        {product.stock > 0 && product.stock < 10 && <p className="text-xs text-orange-600 mt-1">Only {product.stock} left</p>}
      </div>
    </motion.div>
  );
};

export default ProductCard;
