import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package2, AlertTriangle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, startOfDay, startOfWeek, startOfMonth } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  total: number;
  order_status: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  category: string;
  is_active: boolean;
}

interface SalesAnalyticsProps {
  orders: Order[];
  products: Product[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ orders, products }) => {
  const [period, setPeriod] = useState('daily');
  const [stockSearch, setStockSearch] = useState('');

  const validOrders = useMemo(() =>
    orders.filter(o => o.order_status !== 'cancelled' && o.order_status !== 'returned'),
    [orders]
  );

  // Calculate sold count per product from order items
  const soldCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    validOrders.forEach(order => {
      order.items?.forEach(item => {
        if (item.product_id) {
          map[item.product_id] = (map[item.product_id] || 0) + item.quantity;
        }
      });
    });
    return map;
  }, [validOrders]);

  const chartData = useMemo(() => {
    if (period === 'daily') {
      return Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStart = startOfDay(date);
        const dayEnd = startOfDay(subDays(date, -1));
        const dayOrders = validOrders.filter(o => {
          const d = new Date(o.created_at);
          return d >= dayStart && d < dayEnd;
        });
        return {
          label: format(date, 'EEE'),
          sales: dayOrders.reduce((s, o) => s + o.total, 0),
          count: dayOrders.length,
        };
      });
    } else if (period === 'weekly') {
      return Array.from({ length: 4 }, (_, i) => {
        const weekStart = startOfWeek(subDays(new Date(), (3 - i) * 7), { weekStartsOn: 1 });
        const weekEnd = startOfWeek(subDays(new Date(), (2 - i) * 7), { weekStartsOn: 1 });
        const weekOrders = validOrders.filter(o => {
          const d = new Date(o.created_at);
          return d >= weekStart && d < (i === 3 ? new Date() : weekEnd);
        });
        return {
          label: `W${4 - (3 - i)}`,
          sales: weekOrders.reduce((s, o) => s + o.total, 0),
          count: weekOrders.length,
        };
      });
    } else {
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const mStart = startOfMonth(date);
        const mEnd = new Date(mStart);
        mEnd.setMonth(mEnd.getMonth() + 1);
        const mOrders = validOrders.filter(o => {
          const d = new Date(o.created_at);
          return d >= mStart && d < mEnd;
        });
        return {
          label: format(mStart, 'MMM'),
          sales: mOrders.reduce((s, o) => s + o.total, 0),
          count: mOrders.length,
        };
      });
    }
  }, [validOrders, period]);

  const todaySales = useMemo(() => {
    const today = startOfDay(new Date());
    return validOrders.filter(o => new Date(o.created_at) >= today).reduce((s, o) => s + o.total, 0);
  }, [validOrders]);

  const thisWeekSales = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return validOrders.filter(o => new Date(o.created_at) >= weekStart).reduce((s, o) => s + o.total, 0);
  }, [validOrders]);

  const thisMonthSales = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    return validOrders.filter(o => new Date(o.created_at) >= monthStart).reduce((s, o) => s + o.total, 0);
  }, [validOrders]);

  const outOfStockCount = useMemo(() => products.filter(p => p.stock === 0).length, [products]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock > 0 && p.stock < 10).length, [products]);

  // Filter and sort products for stock overview
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (!stockSearch) return true;
        return p.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
               p.category.toLowerCase().includes(stockSearch.toLowerCase());
      })
      .sort((a, b) => a.stock - b.stock);
  }, [products, stockSearch]);

  return (
    <div className="space-y-6">
      {/* Sales Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-xl font-bold text-primary">₹{todaySales.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">This Week</p>
          <p className="text-xl font-bold text-primary">₹{thisWeekSales.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="text-xl font-bold text-primary">₹{thisMonthSales.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Sales Chart */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sales Analytics
          </h3>
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="h-8">
              <TabsTrigger value="daily" className="text-xs px-3 h-7">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-3 h-7">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-3 h-7">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Overview */}
      <div className="bg-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <Package2 className="h-5 w-5 text-primary" />
            Stock Overview
            {outOfStockCount > 0 && (
              <Badge variant="destructive" className="ml-2">{outOfStockCount} Out of Stock</Badge>
            )}
            {lowStockCount > 0 && (
              <Badge variant="secondary" className="ml-2">{lowStockCount} Low Stock</Badge>
            )}
          </h3>
          <div className="relative w-full max-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Product</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Category</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Stock</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Sold</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`border-b hover:bg-secondary/30 ${product.stock === 0 ? 'bg-destructive/5' : ''}`}>
                  <td className="py-2 px-3 text-sm font-medium">{product.name}</td>
                  <td className="py-2 px-3 text-sm capitalize text-muted-foreground">{product.category}</td>
                  <td className={`py-2 px-3 text-sm text-right font-mono font-bold ${product.stock === 0 ? 'text-destructive' : product.stock < 10 ? 'text-orange-600' : ''}`}>
                    {product.stock}
                  </td>
                  <td className="py-2 px-3 text-sm text-right font-mono text-muted-foreground">
                    {soldCountMap[product.id] || 0}
                  </td>
                  <td className="py-2 px-3">
                    {product.stock === 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Out of Stock
                      </Badge>
                    ) : product.stock < 10 ? (
                      <Badge variant="secondary" className="text-xs text-orange-600">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">In Stock</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
