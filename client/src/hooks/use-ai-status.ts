import { useQuery } from "@tanstack/react-query";

interface AiStatusApiResponse {
  available?: boolean;
  configured?: boolean;
  reason?: string;
  model?: string;
}

export interface AiStatus {
  available: boolean;
  reason?: string;
  model?: string;
}

export function useAiStatus() {
  const query = useQuery<AiStatusApiResponse>({
    queryKey: ["/api/ai/status"],
  });

  const available = query.data?.available ?? query.data?.configured ?? false;
  const isUnavailable = query.isError || (query.isSuccess && !available);
  const reason = query.data?.reason
    || (query.isError
      ? "Status layanan AI tidak dapat diperiksa."
      : "GEMINI_API_KEY tidak dikonfigurasi.");

  return {
    ...query,
    available,
    isChecking: query.isPending,
    isUnavailable,
    reason,
  };
}