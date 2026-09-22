import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Loader2, ShoppingBag, Clock, Truck, CheckCircle, XCircle, RotateCcw, Star, MessageCircle, RefreshCw } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useOrders, useCancelOrder, Order, OrderItem } from '@/hooks/useOrders';
import { useAddToCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { format, differenceInHours } from 'date-fns';
import { toast } from 'sonner';
import { useRealtimeOrders } from '@/hooks/useRealtimeSubscription';
import OrderReviewForm from '@/components/orders/OrderReviewForm';

const statusConfig: Record<Order['order_status'], { label: string; color: string; icon: React.ReactNode }> = {
  placed: { label: 'Order Placed', color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4" /> },
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-800', icon: <Package className="h-4 w-4" /> },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-4 w-4" /> },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
  returned: { label: 'Returned', color: 'bg-gray-100 text-gray-800', icon: <RotateCcw className="h-4 w-4" /> },
};

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading } = useOrders();
  
  // Enable real-time updates for orders
  useRealtimeOrders();
  const cancelOrder = useCancelOrder();
  const addToCart = useAddToCart();
  const [reordering, setReordering] = React.useState<string | null>(null);

  const handleReorder = async (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    setReordering(order.id);
    try {
      for (const item of order.items) {
        if (item.product_id) {
          await addToCart.mutateAsync({ productId: item.product_id, quantity: item.quantity });
        }
      }
      toast.success('Items added to cart!');
      navigate('/cart');
    } catch {
      toast.error('Some items could not be added to cart');
    } finally {
      setReordering(null);
    }
  };

  const canCancelOrder = (orderDate: string) => {
    const hoursSinceOrder = differenceInHours(new Date(), new Date(orderDate));
    return hoursSinceOrder <= 24;
  };

  const handleCancelOrder = async (orderId: string, orderDate: string) => {
    if (!canCancelOrder(orderDate)) {
      toast.error('Orders can only be cancelled within 24 hours of placing');
      return;
    }
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder.mutateAsync(orderId);
    }
  };

  if (authLoading) {
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
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
          <Package className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Please Login
          </h2>
          <p className="text-muted-foreground mb-6">
            Login to view your orders
          </p>
          <Button variant="gold" onClick={() => navigate('/auth')}>
            Login Now
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              No Orders Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here!
            </p>
            <Button variant="gold" onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          My Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order, index) => {
            const status = statusConfig[order.order_status];
            const shippingAddress = order.shipping_address as { name: string; city: string; state: string };

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                {/* Order Header */}
                <div className="bg-secondary/50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Placed on</p>
                      <p className="text-sm">{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-sm font-bold text-primary">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${status.color} flex items-center gap-1`}>
                      {status.icon}
                      {status.label}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.product_image || '/placeholder.svg'}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 pt-4 border-t flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Delivering to: <span className="text-foreground">{shippingAddress?.name}</span> - {shippingAddress?.city}, {shippingAddress?.state}
                    </p>
                    {order.order_status !== 'delivered' && (
                      <a
                        href={`https://wa.me/917337377689?text=${encodeURIComponent(
                          `Hi, I have a query about my order #${order.id.slice(0, 8).toUpperCase()}.\n\nOrder Status: ${order.order_status}\nTotal: ₹${order.total.toLocaleString()}\n\nPlease help.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Contact Store
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  {order.order_status === 'placed' && (
                    <div className="mt-4 pt-4 border-t flex justify-between items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/order/${order.id}`);
                        }}
                      >
                        Track Order
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <div className="flex items-center gap-2">
                        {!canCancelOrder(order.created_at) && (
                          <span className="text-xs text-muted-foreground">
                            Cancellation window expired (24 hours)
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order.id, order.created_at);
                          }}
                          disabled={cancelOrder.isPending || !canCancelOrder(order.created_at)}
                        >
                          {cancelOrder.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Cancel Order'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Track Order Button for other statuses */}
                  {order.order_status !== 'placed' && order.order_status !== 'cancelled' && order.order_status !== 'returned' && (
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/order/${order.id}`);
                        }}
                      >
                        Track Order
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}

                  {/* Reorder & Review Section for Delivered Orders */}
                  {order.order_status === 'delivered' && order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-accent" />
                          <h4 className="font-medium text-foreground">Share Your Experience</h4>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={reordering === order.id}
                            >
                              {reordering === order.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-1" />
                              )}
                              Reorder
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reorder items?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will add {order.items.length} item{order.items.length > 1 ? 's' : ''} from order #{order.id.slice(0, 8).toUpperCase()} to your cart. You can review before checkout.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleReorder(order)}>
                                Add to Cart
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <OrderReviewForm
                        orderId={order.id}
                        orderItems={order.items}
                        hasReviewed={false}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Orders;
