import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Loader2,
  TrendingUp,
  DollarSign,
  Package2,
  Star,
  Check,
  X,
  MessageSquare,
  Calendar,
  BarChart3,
  Search,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import ProductImageUpload from '@/components/admin/ProductImageUpload';
import SalesAnalytics from '@/components/admin/SalesAnalytics';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth';
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/useProducts';
import { useAdminOrders, useUpdateOrderStatus, Order } from '@/hooks/useOrders';
import { useAdminReviews, useUpdateReviewStatus, useDeleteReview } from '@/hooks/useReviews';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRealtimeProducts, useRealtimeOrders, useRealtimeReviews } from '@/hooks/useRealtimeSubscription';
import { cn } from '@/lib/utils';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useAdminProducts();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { data: reviews = [], isLoading: reviewsLoading } = useAdminReviews();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateReviewStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();
  
  // Enable real-time updates
  useRealtimeProducts();
  useRealtimeOrders();
  useRealtimeReviews();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [reviewSearch, setReviewSearch] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'general' as 'general' | 'bangles' | 'fancy',
    subcategory: '',
    stock: '',
    images: [] as string[],
    featured: false,
    is_new: false,
    discount: '',
    is_active: true,
    rating: '',
    reviews_count: ''
  });

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: 'general',
      subcategory: '',
      stock: '',
      images: [],
      featured: false,
      is_new: false,
      discount: '',
      is_active: true,
      rating: '',
      reviews_count: ''
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      subcategory: product.subcategory || '',
      stock: product.stock.toString(),
      images: product.images || [],
      featured: product.featured,
      is_new: product.is_new,
      discount: product.discount?.toString() || '',
      is_active: product.is_active,
      rating: product.rating?.toString() || '',
      reviews_count: product.reviews_count?.toString() || ''
    });
    setProductDialogOpen(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: productForm.name,
      description: productForm.description || null,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      category: productForm.category,
      subcategory: productForm.subcategory || null,
      stock: parseInt(productForm.stock),
      images: productForm.images,
      featured: productForm.featured,
      is_new: productForm.is_new,
      discount: productForm.discount ? parseInt(productForm.discount) : 0,
      is_active: productForm.is_active,
      rating: productForm.rating ? parseFloat(productForm.rating) : 0,
      reviews_count: productForm.reviews_count ? parseInt(productForm.reviews_count) : 0
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      setProductDialogOpen(false);
      resetProductForm();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status?: Order['order_status'], expectedDeliveryDate?: string | null, paymentStatus?: Order['payment_status']) => {
    await updateOrderStatus.mutateAsync({ 
      id: orderId, 
      status, 
      expected_delivery_date: expectedDeliveryDate,
      payment_status: paymentStatus
    });
  };

  const handleCodPaymentToggle = async (orderId: string, isPaid: boolean) => {
    await updateOrderStatus.mutateAsync({ 
      id: orderId, 
      payment_status: isPaid ? 'paid' : 'pending'
    });
  };

  const handleApproveReview = async (id: string) => {
    await updateReviewStatus.mutateAsync({ id, is_approved: true });
  };

  const handleHideReview = async (id: string) => {
    await updateReviewStatus.mutateAsync({ id, is_approved: false });
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview.mutateAsync(id);
    }
  };

  // Stats
  const totalRevenue = orders
    .filter(o => o.order_status !== 'cancelled' && o.order_status !== 'returned')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingReviews = reviews.filter(r => !r.is_approved).length;

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
          <LayoutDashboard className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please login with an admin account
          </p>
          <Button variant="gold" onClick={() => navigate('/auth')}>
            Login
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
          <LayoutDashboard className="h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges
          </p>
          <Button variant="gold" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-4 px-4 mb-6 sm:mb-8">
            <TabsList className="w-max min-w-full sm:w-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3">
                <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Dashboard</span>
                <span className="xs:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3">
                <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3">
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3 relative">
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Reviews
                {pendingReviews > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    {pendingReviews}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-lg sm:text-2xl font-bold text-primary truncate">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="h-9 w-9 sm:h-12 sm:w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-lg sm:text-2xl font-bold">{totalOrders}</p>
                  </div>
                  <div className="h-9 w-9 sm:h-12 sm:w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Products</p>
                    <p className="text-lg sm:text-2xl font-bold">{totalProducts}</p>
                  </div>
                  <div className="h-9 w-9 sm:h-12 sm:w-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Package2 className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">{pendingReviews}</p>
                  </div>
                  <div className="h-9 w-9 sm:h-12 sm:w-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <Star className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Low Stock Alerts */}
            {(() => {
              const lowStockProducts = products.filter(p => p.stock <= 5 && p.is_active);
              if (lowStockProducts.length === 0) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-xl p-6 shadow-sm mb-6 sm:mb-8 border border-orange-200 dark:border-orange-900"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h2 className="font-display text-xl font-bold">Low Stock Alerts</h2>
                    <Badge variant="destructive" className="ml-auto">{lowStockProducts.length} items</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lowStockProducts
                      .sort((a, b) => a.stock - b.stock)
                      .map((product) => (
                        <div
                          key={product.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border",
                            product.stock === 0
                              ? "bg-destructive/10 border-destructive/30"
                              : "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800"
                          )}
                        >
                          <img
                            src={product.images?.[0] || '/placeholder.svg'}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className={cn(
                              "text-xs font-semibold",
                              product.stock === 0 ? "text-destructive" : "text-orange-600"
                            )}>
                              {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 text-xs"
                            onClick={() => handleEditProduct(product)}
                          >
                            Update
                          </Button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              );
            })()}

            {/* Recent Orders */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-secondary/50">
                        <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="py-3 px-4 text-sm">{format(new Date(order.created_at), 'MMM dd, yyyy')}</td>
                        <td className="py-3 px-4 text-sm font-medium">₹{order.total.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">{order.order_status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold">All Products</h2>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={productDialogOpen} onOpenChange={(open) => {
                setProductDialogOpen(open);
                if (!open) resetProductForm();
              }}>
                <DialogTrigger asChild>
                  <Button variant="gold">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Product Name *</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Category *</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value: 'general' | 'bangles' | 'fancy') => 
                            setProductForm({ ...productForm, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Store</SelectItem>
                            <SelectItem value="bangles">Bangles</SelectItem>
                            <SelectItem value="fancy">Fancy Items</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label>Price (₹) *</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Original Price (₹)</Label>
                        <Input
                          type="number"
                          value={productForm.original_price}
                          onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Stock *</Label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Subcategory</Label>
                        <Input
                          value={productForm.subcategory}
                          onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                          placeholder="e.g., Glass Bangles, Makeup"
                        />
                      </div>
                      <div>
                        <Label>Discount (%)</Label>
                        <Input
                          type="number"
                          value={productForm.discount}
                          onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Rating (0-5)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={productForm.rating}
                          onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                          placeholder="e.g., 4.5"
                        />
                      </div>
                      <div>
                        <Label>Number of Reviews</Label>
                        <Input
                          type="number"
                          min="0"
                          value={productForm.reviews_count}
                          onChange={(e) => setProductForm({ ...productForm, reviews_count: e.target.value })}
                          placeholder="e.g., 25"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Product Images</Label>
                      <ProductImageUpload
                        images={productForm.images}
                        onImagesChange={(images) => setProductForm({ ...productForm, images })}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="rounded border-border"
                        />
                        <span className="text-sm">Featured Product</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.is_new}
                          onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })}
                          className="rounded border-border"
                        />
                        <span className="text-sm">New Arrival</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.is_active}
                          onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                          className="rounded border-border"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" variant="gold" disabled={createProduct.isPending || updateProduct.isPending}>
                        {(createProduct.isPending || updateProduct.isPending) ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="bg-card rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-secondary/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(p => {
                          if (!productSearch) return true;
                          return p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                                 p.category.toLowerCase().includes(productSearch.toLowerCase());
                        })
                        .map((product) => (
                        <tr key={product.id} className="border-b hover:bg-secondary/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0] || '/placeholder.svg'}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{product.category}</td>
                          <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={product.stock < 10 ? 'text-orange-600 font-medium' : ''}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold">All Orders</h2>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID, customer, status..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter(o => {
                    if (!orderSearch) return true;
                    const q = orderSearch.toLowerCase();
                    const addr = o.shipping_address as { name?: string; phone?: string; city?: string } | null;
                    return o.id.toLowerCase().includes(q) ||
                      o.order_status.toLowerCase().includes(q) ||
                      o.payment_method.toLowerCase().includes(q) ||
                      addr?.name?.toLowerCase().includes(q) ||
                      addr?.phone?.toLowerCase().includes(q) ||
                      addr?.city?.toLowerCase().includes(q) ||
                      o.items?.some(item => item.product_name.toLowerCase().includes(q));
                  })
                  .map((order) => {
                  const shippingAddress = order.shipping_address as { name: string; phone: string; street: string; city: string; state: string; pincode: string };

                  return (
                    <div key={order.id} className="bg-card rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-secondary/50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-3 sm:gap-6">
                          <div>
                            <p className="text-xs text-muted-foreground">Order ID</p>
                            <p className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="text-sm">{format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-sm font-bold text-primary">₹{order.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Payment</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm capitalize">{order.payment_method}</p>
                              {order.payment_method === 'cod' && (
                                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                  {order.payment_status === 'paid' ? 'Done' : 'Pending'}
                                </Badge>
                              )}
                              {order.payment_method !== 'cod' && (
                                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="text-xs capitalize">
                                  {order.payment_status}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {order.payment_method === 'cod' && order.order_status !== 'cancelled' && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Cash Collected</p>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={order.payment_status === 'paid'}
                                  onChange={(e) => handleCodPaymentToggle(order.id, e.target.checked)}
                                  className="rounded border-border h-4 w-4"
                                />
                                <span className="text-sm">{order.payment_status === 'paid' ? 'Done' : 'Mark as Done'}</span>
                              </label>
                            </div>
                          )}
                          {order.order_status === 'cancelled' && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Cancellation</p>
                              <Badge variant="destructive" className="text-xs">
                                {(order as any).cancelled_by === 'customer' 
                                  ? 'Cancelled by Customer' 
                                  : (order as any).cancelled_by === 'admin' 
                                    ? 'Cancelled by Admin' 
                                    : 'Cancelled'}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Select
                            value={order.order_status}
                            onValueChange={(value: Order['order_status']) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-full sm:w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="placed">Placed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="returned">Returned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Items</h4>
                            <div className="space-y-2">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                  <img
                                    src={item.product_image || '/placeholder.svg'}
                                    alt={item.product_name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <p>{item.product_name}</p>
                                    <p className="text-muted-foreground">₹{item.price} × {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <p className="text-sm text-muted-foreground">
                              {shippingAddress?.name}<br />
                              {shippingAddress?.phone}<br />
                              {shippingAddress?.street}<br />
                              {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}
                            </p>
                            {shippingAddress?.phone && (
                              <a
                                href={`https://wa.me/91${shippingAddress.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                                  `Hi ${shippingAddress.name}, update regarding your order #${order.id.slice(0, 8).toUpperCase()} from Adhvika General Store:\n\nOrder Status: ${order.order_status.toUpperCase()}\nTotal: ₹${order.total.toLocaleString()}${order.expected_delivery_date ? `\nExpected Delivery: ${format(new Date(order.expected_delivery_date), 'MMM dd, yyyy')}` : ''}\n\nThank you for shopping with us! 🙏`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 text-xs text-green-600 hover:text-green-700 font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp Customer
                              </a>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Expected Delivery
                            </h4>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !order.expected_delivery_date && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {order.expected_delivery_date
                                    ? format(new Date(order.expected_delivery_date), 'MMM dd, yyyy')
                                    : 'Set delivery date'
                                  }
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={order.expected_delivery_date ? new Date(order.expected_delivery_date) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      handleUpdateOrderStatus(
                                        order.id, 
                                        order.order_status, 
                                        format(date, 'yyyy-MM-dd')
                                      );
                                    }
                                  }}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {order.expected_delivery_date && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Customer will see this date on their tracking page
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="font-display text-xl font-bold">Customer Reviews</h2>
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews by name, comment, status..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {reviewsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-card rounded-xl p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">
                  Customer reviews will appear here when they submit feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews
                  .filter(r => {
                    if (!reviewSearch) return true;
                    const q = reviewSearch.toLowerCase();
                    return r.user_name.toLowerCase().includes(q) ||
                      r.comment?.toLowerCase().includes(q) ||
                      (r.is_approved ? 'approved' : 'pending').includes(q);
                  })
                  .map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card rounded-xl p-6 shadow-sm border-l-4 ${
                      review.is_approved ? 'border-l-success' : 'border-l-accent'
                    }`}
                  >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <span className="font-medium text-foreground">{review.user_name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-accent text-accent'
                                    : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant={review.is_approved ? 'default' : 'secondary'}>
                            {review.is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">"{review.comment}"</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!review.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-success border-success hover:bg-success/10 text-xs sm:text-sm"
                            onClick={() => handleApproveReview(review.id)}
                          >
                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {review.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm"
                            onClick={() => handleHideReview(review.id)}
                          >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                            Hide
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <h2 className="font-display text-xl font-bold mb-6">Sales Analytics & Stock</h2>
            <SalesAnalytics orders={orders} products={products} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;