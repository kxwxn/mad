import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProduct, insertProduct as createProduct, updateProduct, deleteProduct } from '@/lib/supabase/product';
import { Product } from '@/lib/supabase/product';

const ITEMS_PER_PAGE = 8;

export const PRODUCTS_QUERY_KEY = ['products'] as const;
export const PRODUCT_QUERY_KEY = (id: string) => ['product', id] as const;

// 캐시 설정
const CACHE_TIME = 1000 * 60 * 30; // 30분
const STALE_TIME = 1000 * 60 * 5; // 5분

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => getProducts(0, ITEMS_PER_PAGE - 1),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteProducts = () => {
  return useInfiniteQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: ({ pageParam }) => {
      const from = Number(pageParam) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      return getProducts(from, to);
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

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: PRODUCT_QUERY_KEY(id),
    queryFn: () => getProduct(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

interface UpdateProductParams {
  id: string;
  updates: Partial<Product>;
}

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData(PRODUCTS_QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [newProduct];
        return [newProduct, ...old];
      });
      queryClient.setQueryData(PRODUCT_QUERY_KEY(newProduct.id), newProduct);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: UpdateProductParams) => updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(PRODUCTS_QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [updatedProduct];
        return old.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
      });
      queryClient.setQueryData(PRODUCT_QUERY_KEY(updatedProduct.id), updatedProduct);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.setQueryData(PRODUCTS_QUERY_KEY, (old: Product[] | undefined) => {
        if (!old) return [];
        return old.filter(product => product.id !== id);
      });
      queryClient.removeQueries({ queryKey: PRODUCT_QUERY_KEY(id) });
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