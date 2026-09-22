import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Favorites: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: wishlist = [], isLoading } = useWishlist();
  const navigate = useNavigate();

  if (authLoading || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <Heart className="h-16 w-16 text-muted-foreground/30" />
          <h2 className="text-xl font-bold">Login to see your favorites</h2>
          <Button variant="gold" onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </MainLayout>
    );
  }

  const products = wishlist
    .map((item: any) => item.products)
    .filter(Boolean);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <h1 className="font-display text-2xl md:text-3xl font-bold">My Favorites</h1>
        </div>

        {products.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
            <Heart className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground text-lg">No favorites yet</p>
            <Button variant="gold" onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Favorites;
