import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrades, postTrade } from "../../../services/api";

export function useTrades() {
  return useQuery({
    queryKey: ["trades"],
    queryFn: getTrades,
  });
}

export function useAddTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });
}