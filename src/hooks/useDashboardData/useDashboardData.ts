import { useState, useEffect } from "react";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  recentPayments: Array<{
    id: string;
    amount: number;
    customerEmail: string;
    status: string;
    created: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image: string;
    }>;
  }>;
}

interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

export default function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/admin/dashboard?page=${currentPage}&limit=${itemsPerPage}`);
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching dashboard data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentPage, itemsPerPage]); // Added itemsPerPage to dependency array

  return { data, isLoading, currentPage, setCurrentPage, itemsPerPage };
}
