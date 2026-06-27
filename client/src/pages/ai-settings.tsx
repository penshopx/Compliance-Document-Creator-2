import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AI_PROVIDERS } from "@shared/ai-providers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  KeyRound,
  Check,
  Trash2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Info,
  Star,
} from "lucide-react";

interface SavedKey {
  provider: string;
  model: string | null;
  isActive: boolean;
  maskedKey: string;
}

export default function AiSettingsPage() {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState(AI_PROVIDERS[0].id);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(AI_PROVIDERS[0].defaultModel);

  const { data: savedKeys = [], isLoading } = useQuery<SavedKey[]>({
    queryKey: ["/api/ai/keys"],
  });

  const providerMeta = AI_PROVIDERS.find((p) => p.id === selectedProvider)!;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/keys", {
        provider: selectedProvider,
        apiKey: apiKey.trim(),
        model: model.trim() || undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/keys"] });
      setApiKey("");
      toast({
        title: "API key tersimpan",
        description: `Key ${providerMeta.label} berhasil disimpan & dienkripsi.`,
      });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal menyimpan", description: e.message, variant: "destructive" });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (provider: string) => {
      const res = await apiRequest("POST", `/api/ai/keys/${provider}/activate`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/keys"] });
      toast({ title: "Provider aktif diperbarui" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal mengaktifkan", description: e.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (provider: string) => {
      const res = await apiRequest("DELETE", `/api/ai/keys/${provider}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/keys"] });
      toast({ title: "API key dihapus" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal menghapus", description: e.message, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">
                Pengaturan AI (API Key Anda)
              </h1>
              <p className="text-muted-foreground text-sm">
                Gunakan akun AI Anda sendiri untuk membuat dokumen. Biaya token ditanggung oleh akun Anda.
              </p>
            </div>
          </div>

          <Card className="mt-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-blue-700 dark:text-blue-300">
                  API key Anda disimpan terenkripsi dan tidak pernah ditampilkan ulang secara penuh.
                  Anda bisa menyimpan beberapa provider dan memilih satu yang aktif untuk generate dokumen.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add / update key */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tambah / Perbarui Key</CardTitle>
              <CardDescription>Pilih provider lalu tempel API key Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Provider</Label>
                <Select
                  value={selectedProvider}
                  onValueChange={(v) => {
                    setSelectedProvider(v);
                    const m = AI_PROVIDERS.find((p) => p.id === v)!;
                    setModel(m.defaultModel);
                  }}
                >
                  <SelectTrigger className="mt-1" data-testid="select-provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((p) => (
                      <SelectItem key={p.id} value={p.id} data-testid={`option-provider-${p.id}`}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">{providerMeta.note}</p>
              </div>

              <div>
                <Label className="text-sm">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="mt-1" data-testid="select-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providerMeta.models.map((m) => (
                      <SelectItem key={m} value={m} data-testid={`option-model-${m}`}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="api-key" className="text-sm">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder={providerMeta.keyHint}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 font-mono text-sm"
                  data-testid="input-api-key"
                />
                <a
                  href={providerMeta.keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary mt-1.5 hover:underline"
                  data-testid="link-get-key"
                >
                  <ExternalLink className="w-3 h-3" />
                  Dapatkan API key {providerMeta.label}
                </a>
              </div>

              <Button
                className="w-full gap-2"
                disabled={apiKey.trim().length < 8 || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                data-testid="button-save-key"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                Simpan API Key
              </Button>
            </CardContent>
          </Card>

          {/* Saved keys */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Provider Tersimpan</CardTitle>
              <CardDescription>Pilih satu provider aktif untuk generate dokumen</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : savedKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Belum ada API key tersimpan.</p>
                  <p className="text-xs mt-1">Tambahkan key di sebelah kiri untuk mulai generate dokumen.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedKeys.map((k) => {
                    const meta = AI_PROVIDERS.find((p) => p.id === k.provider);
                    return (
                      <div
                        key={k.provider}
                        className={`rounded-lg border p-3 ${k.isActive ? "border-primary bg-primary/5" : ""}`}
                        data-testid={`row-key-${k.provider}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{meta?.label || k.provider}</span>
                              {k.isActive && (
                                <Badge className="gap-1 text-xs" data-testid={`badge-active-${k.provider}`}>
                                  <Star className="w-3 h-3" />
                                  Aktif
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                              {k.maskedKey} · {k.model || meta?.defaultModel}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!k.isActive && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 h-8"
                                disabled={activateMutation.isPending}
                                onClick={() => activateMutation.mutate(k.provider)}
                                data-testid={`button-activate-${k.provider}`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                Aktifkan
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(k.provider)}
                              data-testid={`button-delete-${k.provider}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
