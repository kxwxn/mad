import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/config';

export const useRealtimeProducts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase()
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          // React Query 캐시 무효화
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    return () => {
      supabase().removeChannel(channel);
    };
  }, [queryClient]);
}; 