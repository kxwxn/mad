import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminProducts, getAdminProduct, insertAdminProduct as createAdminProduct, updateAdminProduct, deleteAdminProduct } from '@/lib/supabase/adminProduct';
import { Product } from '@/lib/supabase/adminProduct';

const ITEMS_PER_PAGE = 8;

export const ADMIN_PRODUCTS_QUERY_KEY = ['admin-products'] as const;
export const ADMIN_PRODUCT_QUERY_KEY = (id: string) => ['admin-product', id] as const;

// 캐시 설정
const CACHE_TIME = 1000 * 60 * 30; // 30분
const STALE_TIME = 1000 * 60 * 5; // 5분

export const useAdminProducts = () => {
  return useQuery<Product[]>({
    queryKey: ADMIN_PRODUCTS_QUERY_KEY,
    queryFn: () => getAdminProducts(0, ITEMS_PER_PAGE - 1),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteAdminProducts = () => {
  return useInfiniteQuery<Product[]>({
    queryKey: ADMIN_PRODUCTS_QUERY_KEY,
    queryFn: ({ pageParam }) => {
      const from = Number(pageParam) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      return getAdminProducts(from, to);
    },
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지의 아이템 수가 페이지당 아이템 수보다 작으면 더 이상 페이지가 없음
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      
      // 다음 페이지 번호 계산
      return allPages.length;
    },
    initialPageParam: 0,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

export const useAdminProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ADMIN_PRODUCT_QUERY_KEY(id),
    queryFn: () => getAdminProduct(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

interface UpdateProductParams {
  id: string;
  updates: Partial<Product>;
}

export const useAdminProductMutations = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createAdminProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData(ADMIN_PRODUCTS_QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [newProduct];
        return [newProduct, ...old];
      });
      queryClient.setQueryData(ADMIN_PRODUCT_QUERY_KEY(newProduct.id), newProduct);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: UpdateProductParams) => updateAdminProduct(id, updates),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(ADMIN_PRODUCTS_QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [updatedProduct];
        return old.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
      });
      queryClient.setQueryData(ADMIN_PRODUCT_QUERY_KEY(updatedProduct.id), updatedProduct);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: (_, id) => {
      queryClient.setQueryData(ADMIN_PRODUCTS_QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [];
        return old.filter(product => product.id !== id);
      });
      queryClient.removeQueries({ queryKey: ADMIN_PRODUCT_QUERY_KEY(id) });
    },
  });

  return {
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isLoading: createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending,
    error: createProductMutation.error || updateProductMutation.error || deleteProductMutation.error,
  };
}; 