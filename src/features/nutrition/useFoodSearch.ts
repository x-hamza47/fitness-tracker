import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchFoods } from "@/services/foodService";

export function useFoodSearch(term: string) {
    const [debounced, setDebounced] = useState(term.trim());

    useEffect(() => {
        const t = setTimeout(() => setDebounced(term.trim()), 350);
        return () => clearTimeout(t);
    }, [term]);

    const enabled = debounced.length >= 2;

    const query = useQuery({
        queryKey: ["foods", debounced],
        queryFn: () => searchFoods(debounced),
        enabled,
        staleTime: 5 * 60 * 1000,
    });

    return {
        foods: enabled ? (query.data ?? []) : [],
        isLoading: enabled && query.isFetching,
        isError: enabled && query.isError,
        searched: enabled,
    };
}