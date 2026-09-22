import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

// Get approved reviews for homepage testimonials
export const useApprovedReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Review[];
    }
  });
};

// Get all reviews for admin panel
export const useAdminReviews = () => {
  return useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    }
  });
};

// Get reviews for a specific product
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId
  });
};

// Check if user can review a product (must have ordered and received it)
export const useCanReview = (productId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['can-review', productId, user?.id],
    queryFn: async () => {
      if (!user) return false;

      // Check if user has a delivered order with this product
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          id,
          orders!inner(order_status, user_id)
        `)
        .eq('product_id', productId)
        .eq('orders.user_id', user.id)
        .eq('orders.order_status', 'delivered');

      if (error) throw error;

      // Check if user already reviewed this product
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();

      return orderItems.length > 0 && !existingReview;
    },
    enabled: !!user && !!productId
  });
};

// Create a review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => {
      if (!user || !profile) throw new Error('Please login to review');

      // Check if user already reviewed this product
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingReview) {
        throw new Error('You have already reviewed this product.');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          user_name: profile.name,
          rating,
          comment: comment || null,
          is_approved: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['can-review', productId] });
      toast.success('Review submitted! It will appear after admin approval.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

// Update review approval status (admin only)
export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all review-related queries to ensure homepage updates
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};

// Delete review (admin only)
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};
