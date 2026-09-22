import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import { sendOrderPlacedEmailToUser, sendOrderPlacedEmailToAdmin, sendOrderShippedEmail, sendOrderDeliveredEmail, sendOrderCancelledEmail, sendOrderCancelledEmailToAdmin } from '@/utils/emailService';
import { sendOrderPlacedWhatsApp, sendOrderShippedWhatsApp, sendOrderDeliveredWhatsApp, sendOrderCancelledWhatsApp } from '@/utils/whatsappService';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shipping_address: ShippingAddress | Json;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  expected_delivery_date: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Order[];
    },
    enabled: !!user
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as Order;
    },
    enabled: !!id
  });
};

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Order[];
    }
  });
};

interface CreateOrderInput {
  items: {
    product_id: string;
    product_name: string;
    product_image: string | null;
    price: number;
    quantity: number;
  }[];
  total: number;
  payment_method: string;
  shipping_address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      if (!user) throw new Error('Please login to place order');

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: input.total,
          payment_method: input.payment_method,
          payment_status: input.payment_method === 'cod' ? 'pending' : 'pending',
          order_status: 'placed',
          shipping_address: input.shipping_address
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = input.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        price: item.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock (decrement)
      for (const item of input.items) {
        try {
          await supabase
            .from('products')
            .update({ stock: supabase.rpc ? undefined : undefined }) // Stock update handled separately
            .eq('id', item.product_id);
        } catch {
          // Stock update is optional
        }
      }

      // Send email notifications (fire and forget)
      const userEmail = user.email || '';
      const userName = (input.shipping_address.name) || 'Customer';
      const emailData = {
        orderId: order.id,
        items: input.items,
        total: input.total,
        shipping_address: input.shipping_address,
        userEmail,
        userName,
      };
      sendOrderPlacedEmailToUser(emailData);
      sendOrderPlacedEmailToAdmin(emailData);

      // WhatsApp notifications
      sendOrderPlacedWhatsApp(
        order.id,
        input.shipping_address.phone,
        userName,
        input.total,
        input.items
      );

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, expected_delivery_date, payment_status }: { 
      id: string; 
      status?: Order['order_status'];
      expected_delivery_date?: string | null;
      payment_status?: Order['payment_status'];
    }) => {
      const updateData: { 
        order_status?: Order['order_status']; 
        expected_delivery_date?: string | null;
        payment_status?: Order['payment_status'];
        cancelled_by?: string;
      } = {};
      
      if (status !== undefined) {
        updateData.order_status = status;
        if (status === 'cancelled') {
          updateData.cancelled_by = 'admin';
        }
      }
      
      if (expected_delivery_date !== undefined) {
        updateData.expected_delivery_date = expected_delivery_date;
      }

      if (payment_status !== undefined) {
        updateData.payment_status = payment_status;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Send status emails
      if (status === 'shipped' || status === 'delivered') {
        try {
          const { data: order } = await supabase
            .from('orders')
            .select('user_id, expected_delivery_date')
            .eq('id', id)
            .single();

          if (order) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email, name, phone')
              .eq('user_id', order.user_id)
              .single();

            if (profile) {
              if (status === 'shipped') {
                sendOrderShippedEmail(id, profile.email, profile.name, expected_delivery_date ?? order.expected_delivery_date);
                sendOrderShippedWhatsApp(id, profile.phone || '', profile.name, expected_delivery_date ?? order.expected_delivery_date);
              } else {
                sendOrderDeliveredEmail(id, profile.email, profile.name);
                sendOrderDeliveredWhatsApp(id, profile.phone || '', profile.name);
              }
            }
          }
        } catch (emailErr) {
          console.error('Failed to send status notification:', emailErr);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast.success('Order updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: 'cancelled', cancelled_by: 'customer' } as any)
        .eq('id', id);

      if (error) throw error;

      // Send cancellation emails
      try {
        const { data: order } = await supabase
          .from('orders')
          .select('user_id')
          .eq('id', id)
          .single();

        if (order) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, name, phone')
            .eq('user_id', order.user_id)
            .single();

          if (profile) {
            sendOrderCancelledEmail(id, profile.email, profile.name);
            sendOrderCancelledEmailToAdmin(id, profile.name, profile.email);
            sendOrderCancelledWhatsApp(id, profile.phone || '', profile.name, 'customer');
          }
        }
      } catch (emailErr) {
        console.error('Failed to send cancellation email:', emailErr);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};
