import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adhvikaLogo from '@/assets/adhvika-logo.jpeg';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Home,
  Package,
  LogOut,
  ChevronDown,
  Settings,
  Heart,
  Phone,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { data: cartItems = [] } = useCart();
  const { user, isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLogoOpen, setIsLogoOpen] = React.useState(false);

  const handleMobileNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const categories = [
    { name: 'Home', href: '/' },
    { name: 'General Store', href: '/products?category=general' },
    { name: 'Bangles', href: '/products?category=bangles' },
    { name: 'Fancy Items', href: '/products?category=fancy' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-1.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-sm px-4">✨ Welcome to Adhvika Store — Your one-stop shop for quality products!</span>
          <span className="inline-block text-sm px-4">🛍️ Explore our exclusive collection of Bangles, Fancy Items & Daily Essentials</span>
          <span className="inline-block text-sm px-4">💫 Thank you for choosing us — Happy Shopping!</span>
          <span className="inline-block text-sm px-4">✨ Welcome to Adhvika Store — Your one-stop shop for quality products!</span>
          <span className="inline-block text-sm px-4">🛍️ Explore our exclusive collection of Bangles, Fancy Items & Daily Essentials</span>
          <span className="inline-block text-sm px-4">💫 Thank you for choosing us — Happy Shopping!</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu - hidden on mobile since bottom nav handles it */}
          <div className="hidden lg:block">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="py-4">
                  <div className="flex items-center gap-2">
                    <img src={adhvikaLogo} alt="Adhvika Store Logo" className="h-8 w-8 rounded-full object-cover border-2 border-primary/20" />
                    <span className="font-display text-xl font-bold text-primary">Adhvika Store</span>
                  </div>
                  <nav className="mt-8 space-y-4">
                    <button onClick={() => handleMobileNavigation('/')} className="flex items-center gap-2 py-2 text-foreground hover:text-primary transition-colors w-full text-left">
                      <Home className="h-4 w-4" />
                      Home
                    </button>
                    <button onClick={() => handleMobileNavigation('/products?category=general')} className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left">General Store</button>
                    <button onClick={() => handleMobileNavigation('/products?category=bangles')} className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left">Bangles</button>
                    <button onClick={() => handleMobileNavigation('/products?category=fancy')} className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left">Fancy Items</button>
                    <button onClick={() => handleMobileNavigation('/products')} className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left">All Products</button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <img
                src={adhvikaLogo}
                alt="Adhvika Store Logo"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-primary/20 shadow-sm cursor-pointer"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLogoOpen(true); }}
              />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl md:text-2xl font-bold text-primary">
                    Adhvika
                  </span>
                  <span className="hidden sm:inline font-display text-xl md:text-2xl font-medium text-foreground">
                    Store
                  </span>
                </div>
                <span className="text-[9px] leading-tight text-muted-foreground font-medium sm:hidden">
                  General, Bangles & Fancy Store
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Search */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for bangles, cosmetics, groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1.5 px-2 md:px-3">
                    <User className="h-5 w-5" />
                    <span className="max-w-[60px] truncate text-xs md:max-w-none md:text-sm">{profile?.name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                    <ChevronDown className="h-4 w-4 hidden md:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favorites')}>
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById('get-in-touch')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Us
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/install')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download App
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="gap-2"
                onClick={() => navigate('/auth')}
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Login</span>
              </Button>
            )}

            {/* Cart - hidden on mobile since bottom nav has it */}
            <Button
              variant="outline"
              className="relative gap-2 hidden lg:flex"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">Cart</span>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSearch}
            className="md:hidden pt-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                autoFocus
              />
            </div>
          </motion.form>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block border-t border-border bg-card">
        <div className="container">
          <ul className="flex items-center gap-8 py-2">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 inline-block"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/products?category=general')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 inline-block"
              >
                General Store
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/products?category=bangles')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 inline-block"
              >
                Bangles
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/products?category=fancy')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 inline-block"
              >
                Fancy Items
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/products')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 inline-block"
              >
                All Products
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Logo popup */}
      <Dialog open={isLogoOpen} onOpenChange={setIsLogoOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center gap-4">
          <DialogTitle className="font-display text-xl text-primary">Adhvika Store</DialogTitle>
          <img
            src={adhvikaLogo}
            alt="Adhvika Store Logo"
            className="w-64 h-64 rounded-2xl object-cover shadow-lg border-4 border-primary/20"
          />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
