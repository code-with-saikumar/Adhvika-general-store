import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: cartItems = [], isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (authLoading || isLoading) return <MainLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></MainLayout>;
  if (!user) return <MainLayout><div className="min-h-[60vh] flex flex-col items-center justify-center"><ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" /><h2 className="text-xl font-bold mb-4">Please Login</h2><Button variant="gold" onClick={() => navigate('/auth')}>Login</Button></div></MainLayout>;
  if (cartItems.length === 0) return <MainLayout><div className="min-h-[60vh] flex flex-col items-center justify-center"><ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" /><h2 className="text-xl font-bold mb-4">Cart Empty</h2><Button variant="gold" onClick={() => navigate('/products')}>Shop Now</Button></div></MainLayout>;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-card rounded-xl p-4 flex gap-4">
                <img src={item.product.images[0] || '/placeholder.svg'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-primary font-bold">₹{item.product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCartItem.mutate({ id: item.id, quantity: item.quantity - 1 })}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCartItem.mutate({ id: item.id, quantity: item.quantity + 1 })}><Plus className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive ml-auto" onClick={() => removeFromCart.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-bold text-xl mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
              <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span className="text-primary">₹{total.toLocaleString()}</span></div>
            </div>
            <Button variant="gold" size="lg" className="w-full" onClick={() => navigate('/checkout')}>Checkout <ArrowRight className="h-4 w-4 ml-2" /></Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
