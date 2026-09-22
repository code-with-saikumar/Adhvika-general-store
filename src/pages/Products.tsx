import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { useProducts } from '@/hooks/useProducts';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchParam);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: products = [], isLoading } = useProducts(selectedCategory || undefined);

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search filter - match name, description, or category
        if (search) {
          const q = search.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description?.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCategory) return false;
        }
        // Price filter
        if (p.price < priceRange[0] || p.price > priceRange[1]) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return a.price - b.price;
          case 'price-high': return b.price - a.price;
          case 'rating': return b.rating - a.rating;
          default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [products, search, priceRange, sortBy]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? '' : value);
    value === 'all' ? searchParams.delete('category') : searchParams.set('category', value);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setPriceRange([0, 999999]);
    setSelectedCategory('');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const filterProps = {
    selectedCategory: selectedCategory || 'all',
    onCategoryChange: handleCategoryChange,
    priceRange,
    setPriceRange,
    maxPrice,
    onClearFilters: clearFilters,
  };

  const hasActiveFilters = selectedCategory !== '' || priceRange[0] > 0 || priceRange[1] < 999999;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All Products'}
        </h1>
        <p className="text-muted-foreground mb-8">{filteredProducts.length} products found</p>

        {/* Search, Filters, and Sort Controls - All Side by Side */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          
          {/* Filters Popover */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    •
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <div className="py-4">
                <ProductFilters {...filterProps} />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price ↑</SelectItem>
              <SelectItem value="price-high">Price ↓</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid - Full Width */}
        <div>
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No products found</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
