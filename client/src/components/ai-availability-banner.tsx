import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink, RefreshCw, Settings2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface AiStatus {
  configured: boolean;
  model?: string;
  reason?: string;
}

export default function AiAvailabilityBanner() {
  const { data, isError, refetch, isFetching } = useQuery<AiStatus>({
    queryKey: ["/api/ai/status"],
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  if (!isError && (!data || data.configured)) {
    return null;
  }

  const statusUnavailable = isError
    ? "Status layanan AI tidak dapat diperiksa. Coba muat ulang atau hubungi administrator."
    : data?.reason || "GEMINI_API_KEY belum dikonfigurasi.";

  return (
    <Alert
      variant="destructive"
      className="mb-4 flex items-start gap-3 border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
      data-testid="alert-ai-unavailable"
    >
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <AlertTitle>Fitur AI sedang tidak tersedia</AlertTitle>
        <AlertDescription className="text-amber-900/80 dark:text-amber-100/80">
          {statusUnavailable} Generator dokumen dan AI Mentor tidak dapat digunakan
          sampai konfigurasi AI diperbaiki.
        </AlertDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-amber-400 bg-transparent text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/50"
            data-testid="button-refresh-ai-status"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Periksa lagi
          </Button>
          {!isError && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-amber-400 bg-transparent text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/50"
            >
              <a href="/ai-settings">
                <Settings2 className="mr-2 h-3.5 w-3.5" />
                Pengaturan AI
              </a>
            </Button>
          )}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2 text-sm font-medium text-amber-900 underline underline-offset-2 hover:text-amber-700 dark:text-amber-100 dark:hover:text-amber-200"
          >
            Dapatkan API key
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </Alert>
  );
}