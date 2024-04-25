"use client";

import { getForecastings } from "@/actions/forecastings.action";
import { useQuery } from "@tanstack/react-query";

export function useGetForecasting({ productId }: { productId: string | null }) {
  return useQuery({
    queryKey: ["forecasting", productId],
    queryFn: async () => {
      if (!productId) return [];
      return await getForecastings({ productId: productId });
    },
  });
}
