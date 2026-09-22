import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  Package, 
  CheckCircle, 
  Truck, 
  Clock, 
  MapPin,
  Calendar,
  CreditCard,
  Star,
  MessageCircle
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { format, addDays } from 'date-fns';
import OrderReviewForm from '@/components/orders/OrderReviewForm';

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const orderSteps = [
  { key: 'placed', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
  { key: 'processing', label: 'Processing', icon: Package, description: 'Your order is being prepared' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' },
];

const statusIndex: Record<string, number> = {
  placed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
  returned: -1,
};

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: order, isLoading } = useOrder(id || '');

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
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
          <Package className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Please Login
          </h2>
          <p className="text-muted-foreground mb-6">
            Login to track your order
          </p>
          <Button variant="gold" onClick={() => navigate('/auth')}>
            Login Now
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
          <Package className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Order Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The order you're looking for doesn't exist
          </p>
          <Button variant="gold" onClick={() => navigate('/orders')}>
            View All Orders
          </Button>
        </div>
      </MainLayout>
    );
  }

  const currentStep = statusIndex[order.order_status];
  const isCancelled = order.order_status === 'cancelled';
  const isReturned = order.order_status === 'returned';
  const shippingAddress = order.shipping_address as ShippingAddress;
  
  // Calculate expected delivery date (if not set, estimate 5-7 days from order)
  const expectedDate = order.expected_delivery_date 
    ? new Date(order.expected_delivery_date)
    : addDays(new Date(order.created_at), 7);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/orders')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Track Order
            </h1>
            <p className="text-sm text-muted-foreground">
              Order ID: {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-4 sm:p-6 shadow-sm mb-6"
            >
              <h2 className="font-display text-lg sm:text-xl font-bold mb-6">Order Status</h2>
              
              {isCancelled && (
                <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Package className="h-5 w-5 shrink-0" />
                  <p className="font-medium">This order has been cancelled</p>
                </div>
              )}

              {isReturned && (
                <div className="bg-muted rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Package className="h-5 w-5 shrink-0" />
                  <p className="font-medium">This order has been returned</p>
                </div>
              )}

              {!isCancelled && !isReturned && (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-5 sm:left-6 top-8 bottom-8 w-0.5 bg-border" />
                  <div 
                    className="absolute left-5 sm:left-6 top-8 w-0.5 bg-primary transition-all duration-500"
                    style={{ 
                      height: `calc(${Math.min(currentStep, 3)} * 33.33% - 16px)` 
                    }}
                  />

                  <div className="space-y-6 sm:space-y-8">
                    {orderSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 sm:gap-5"
                        >
                          <div 
                            className={`relative z-10 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                          >
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-medium text-sm sm:text-base ${
                              isCompleted ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            {isCompleted && index === 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(order.created_at), 'MMM dd, yyyy \'at\' h:mm a')}
                              </p>
                            )}
                            {isCurrent && index < 3 && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                In Progress
                              </Badge>
                            )}
                            {isCompleted && index === 3 && (
                              <p className="text-xs text-success mt-1">
                                Delivered on {format(new Date(order.updated_at), 'MMM dd, yyyy')}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Expected Delivery */}
              {!isCancelled && !isReturned && currentStep < 3 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3 text-primary">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Expected Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {format(expectedDate, 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <h2 className="font-display text-lg sm:text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                    <img
                      src={item.product_image || '/placeholder.svg'}
                      alt={item.product_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{item.product_name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-primary mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Section for Delivered Orders */}
              {order.order_status === 'delivered' && order.items && order.items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-accent" />
                    <h3 className="font-medium text-foreground">Rate Your Purchase</h3>
                  </div>
                  <OrderReviewForm
                    orderId={order.id}
                    orderItems={order.items}
                    hasReviewed={false}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge 
                    variant="outline" 
                    className={`capitalize ${
                      order.payment_status === 'paid' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-accent/10 text-accent border-accent/20'
                    }`}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount</span>
                    <span className="font-bold text-lg text-primary">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{shippingAddress?.name}</p>
                <p className="text-muted-foreground">{shippingAddress?.street}</p>
                <p className="text-muted-foreground">
                  {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}
                </p>
                <p className="text-muted-foreground">Phone: {shippingAddress?.phone}</p>
                <a
                  href={`https://wa.me/917337377689?text=${encodeURIComponent(
                    `Hi, I have a query about my order #${order.id.slice(0, 8).toUpperCase()}.\n\nOrder Status: ${order.order_status}\nTotal: ₹${order.total.toLocaleString()}\n\nPlease help.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Store via WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Order Date Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-xl p-4 sm:p-6 shadow-sm"
            >
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Placed</span>
                  <span>{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                </div>
                {order.expected_delivery_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected By</span>
                    <span className="text-primary font-medium">
                      {format(new Date(order.expected_delivery_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {order.order_status === 'delivered' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered On</span>
                    <span className="text-success font-medium">
                      {format(new Date(order.updated_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Back to Orders Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Orders
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderTracking;
