import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useWishlist = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useIsWishlisted = (productId: string) => {
  const { data: wishlist = [] } = useWishlist();
  return wishlist.some((item: any) => item.product_id === productId);
};

export const useToggleWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isWishlisted }: { productId: string; isWishlisted: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isWishlisted }) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(isWishlisted ? 'Removed from favorites' : 'Added to favorites');
    },
    onError: () => toast.error('Something went wrong'),
  });
};
