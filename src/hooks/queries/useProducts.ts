import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Product } from '@/lib/supabase/product';

const ITEMS_PER_PAGE = 8;

export const PRODUCTS_QUERY_KEY = ['products'] as const;
export const PRODUCT_QUERY_KEY = (id: string) => ['product', id] as const;

// 캐시 설정 - TBT 최적화
const CACHE_TIME = 1000 * 60 * 10; // 10분 (30분에서 단축)
const STALE_TIME = 1000 * 60 * 5; // 5분

const fetchProducts = async (from: number, to: number): Promise<Product[]> => {
  const response = await fetch(`/api/products?from=${from}&to=${to}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch products: ${response.status}`);
  }
  return response.json();
};

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => fetchProducts(0, ITEMS_PER_PAGE - 1),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // TBT 최적화
    refetchOnReconnect: false, // TBT 최적화
  });
};

export const useInfiniteProducts = () => {
  return useInfiniteQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: ({ pageParam }) => {
      const from = Number(pageParam) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      return fetchProducts(from, to);
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
    refetchOnMount: false, // TBT 최적화
    refetchOnReconnect: false, // TBT 최적화
  });
};

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch product: ${response.status}`);
  }
  return response.json();
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: PRODUCT_QUERY_KEY(id),
    queryFn: () => fetchProduct(id),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};
