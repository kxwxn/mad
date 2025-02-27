import { QueryClient } from '@tanstack/react-query';

// 기본 QueryClient 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      gcTime: 5 * 60 * 1000, // 5분 (이전의 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});