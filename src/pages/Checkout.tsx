import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, CreditCard, Truck, Loader2, Plus, Check, Edit, Trash2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCart, useClearCart } from '@/hooks/useCart';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, Address } from '@/hooks/useAddresses';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: cartItems = [], isLoading: cartLoading } = useCart();
  const { data: addresses = [], isLoading: addressLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const resetForm = () => {
    setNewAddress({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      is_default: false
    });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAddress.mutateAsync(newAddress);
    setShowAddAddress(false);
    resetForm();
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default
    });
    setEditDialogOpen(true);
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    
    await updateAddress.mutateAsync({
      id: editingAddress.id,
      ...newAddress
    });
    setEditDialogOpen(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress.mutateAsync(id);
      if (selectedAddressId === id) {
        setSelectedAddressId('');
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      toast.error('Invalid address selected');
      return;
    }

    try {
      await createOrder.mutateAsync({
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product.name,
          product_image: item.product.images[0] || null,
          price: item.product.price,
          quantity: item.quantity
        })),
        total,
        payment_method: paymentMethod,
        shipping_address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        }
      });

      await clearCart.mutateAsync();
      navigate('/orders');
    } catch (error) {
      // Error handled in hook
    }
  };

  if (authLoading || cartLoading || addressLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>

              {showAddAddress && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddAddress}
                  className="mb-6 p-4 bg-secondary/50 rounded-lg space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Set as default address</span>
                  </label>
                  <div className="flex gap-2">
                    <Button type="submit" variant="gold" disabled={createAddress.isPending}>
                      {createAddress.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Address'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowAddAddress(false); resetForm(); }}>
                      Cancel
                    </Button>
                  </div>
                </motion.form>
              )}

              <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={address.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          {address.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.street}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {address.phone}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditClick(address);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteAddress(address.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>

              {addresses.length === 0 && !showAddAddress && (
                <p className="text-muted-foreground text-center py-4">
                  No addresses found. Add a new address to continue.
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="cod" />
                    <div className="flex items-center gap-3 flex-1">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="online" />
                    <div className="flex items-center gap-3 flex-1">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Online Payment</span>
                        <p className="text-sm text-muted-foreground">
                          UPI, Card, NetBanking (Coming Soon)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{item.product.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={createOrder.isPending || !selectedAddressId}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm your order</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to place an order for {cartItems.length} item{cartItems.length > 1 ? 's' : ''} totalling ₹{total.toLocaleString()}. Payment method: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePlaceOrder}>
                      Confirm & Place Order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Address Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAddress} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Street Address</Label>
              <Input
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  required
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newAddress.is_default}
                onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Set as default address</span>
            </label>
            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="gold" disabled={updateAddress.isPending}>
                {updateAddress.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Address
              </Button>
              <Button type="button" variant="outline" onClick={() => { setEditDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Checkout;