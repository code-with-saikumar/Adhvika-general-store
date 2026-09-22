import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, Package, Store } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cartItems = [] } = useCart();
  const { user } = useAuth();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategoriesClick = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('shop-by-category');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/?scrollTo=shop-by-category');
  };

  const tabs = [
    { label: 'Home', icon: Home, path: '/', action: () => navigate('/') },
    { label: 'Categories', icon: Grid3X3, path: '/categories', action: handleCategoriesClick },
    { label: 'Cart', icon: ShoppingCart, path: '/cart', badge: itemCount, action: () => navigate('/cart'), isCart: true },
    { label: 'All Products', icon: Store, path: '/products', action: () => navigate('/products') },
    { label: 'Orders', icon: Package, path: user ? '/orders' : '/auth', action: () => navigate(user ? '/orders' : '/auth') },
  ];

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.label === 'Categories') return false;
    if (tab.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <button
              key={tab.label}
              onClick={tab.action}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all relative ${
                tab.isCart ? 'text-primary scale-110' : active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <motion.div 
                className="relative"
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <tab.icon className={tab.isCart ? 'h-7 w-7' : 'h-5 w-5'} strokeWidth={tab.isCart ? 2.5 : 2} />
                {tab.badge && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-3 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </motion.div>
              <span className={`font-medium ${tab.isCart ? 'text-[11px] font-semibold' : 'text-[10px]'}`}>{tab.label}</span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-1 w-4 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
