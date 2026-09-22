import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield, BadgeCheck, Loader2, Minus, Plus, MessageSquare, Zap, Heart } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCanReview, useCreateReview, useProductReviews } from '@/hooks/useReviews';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useIsWishlisted, useToggleWishlist } from '@/hooks/useWishlist';
import ProductReviewSection from '@/components/products/ProductReviewSection';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading } = useProduct(id || '');
  const addToCart = useAddToCart();
  const { data: canReview } = useCanReview(id || '');
  const createReview = useCreateReview();
  const { data: reviews = [] } = useProductReviews(id || '');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const isWishlisted = useIsWishlisted(id || '');
  const toggleWishlist = useToggleWishlist();

  const handleToggleWishlist = () => {
    if (!user) { toast.error('Please login'); navigate('/auth'); return; }
    if (!id) return;
    toggleWishlist.mutate({ productId: id, isWishlisted });
  };

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login'); navigate('/auth'); return; }
    if (!product) return;
    for (let i = 0; i < quantity; i++) await addToCart.mutateAsync({ productId: product.id });
  };

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please login'); navigate('/auth'); return; }
    if (!product) return;
    for (let i = 0; i < quantity; i++) await addToCart.mutateAsync({ productId: product.id });
    navigate('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    await createReview.mutateAsync({
      productId: id,
      rating: reviewRating,
      comment: reviewComment
    });
    
    setShowReviewForm(false);
    setReviewRating(5);
    setReviewComment('');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Product Not Found</h2>
          <Button variant="gold" onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </MainLayout>
    );
  }

  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-[1200px]">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 pb-32 sm:pb-0">
          {/* Product Image */}
          <div className="relative w-full">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-secondary/30 aspect-square w-full">
              <img 
                src={product.images[0] || '/placeholder.svg'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.is_new && (
                <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-success text-success-foreground text-xs">
                  New
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute top-3 right-12 sm:top-4 sm:right-14 bg-destructive text-destructive-foreground text-xs">
                  -{discount}%
                </Badge>
              )}
              <button
                onClick={handleToggleWishlist}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            {/* Category */}
            <p className="text-xs sm:text-sm text-muted-foreground capitalize">
              {product.category} {product.subcategory && `• ${product.subcategory}`}
            </p>

            {/* Title */}
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>

            {/* Price + Inline Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-base sm:text-xl text-muted-foreground line-through">
                    ₹{product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              {product.stock > 0 && (
                <div className="flex items-center gap-2 sm:hidden ml-auto">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full px-4 text-sm"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                  >
                    {addToCart.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                    <span className="ml-1">Cart</span>
                  </Button>
                  <Button
                    variant="gold"
                    className="h-10 rounded-full px-4 text-sm"
                    onClick={handleBuyNow}
                    disabled={addToCart.isPending}
                  >
                    <Zap className="h-4 w-4" />
                    <span className="ml-1">Buy</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="text-sm sm:text-base">
              {product.stock > 0 ? (
                <span className="text-success font-medium">✓ In Stock ({product.stock})</span>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector - Desktop/Tablet */}
            {product.stock > 0 && (
              <div className="hidden sm:flex items-center gap-4 flex-wrap">
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 min-w-[140px]" 
                  onClick={handleAddToCart} 
                  disabled={addToCart.isPending}
                >
                  {addToCart.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Add to Cart
                </Button>
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="flex-1 min-w-[140px]" 
                  onClick={handleBuyNow} 
                  disabled={addToCart.isPending}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
              <div className="text-center">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-primary mb-1.5 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium">Free Delivery</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-primary mb-1.5 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-primary mb-1.5 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium">100% Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        {product.stock > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden z-50">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border rounded-lg shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Buttons */}
              <Button 
                variant="outline" 
                className="flex-1 h-11" 
                onClick={handleAddToCart} 
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                <span className="ml-1.5 text-sm">Cart</span>
              </Button>
              <Button 
                variant="gold" 
                className="flex-1 h-11" 
                onClick={handleBuyNow} 
                disabled={addToCart.isPending}
              >
                <Zap className="h-4 w-4" />
                <span className="ml-1.5 text-sm">Buy Now</span>
              </Button>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <ProductReviewSection
          productId={id || ''}
          reviews={reviews}
          canReview={canReview}
          showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          handleSubmitReview={handleSubmitReview}
          isSubmitting={createReview.isPending}
        />
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
