import { getPublicStats } from "@/services/publicService";
import { useQuery } from "@tanstack/react-query";

export function usePublicStats() {
  return useQuery({
    queryKey: ["public", "stats"],
    queryFn: getPublicStats,
    staleTime: 5 * 60 * 1000,
  })
}
