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
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
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
  const [guideOpen, setGuideOpen] = useState(true);
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

        {/* Step-by-step guide */}
        <Card className="mb-6 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setGuideOpen((v) => !v)}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                Panduan: Cara Mendapatkan &amp; Memakai API Key (Gratis)
              </CardTitle>
              {guideOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <CardDescription>
              Gemini &amp; Qwen menyediakan tier gratis yang cukup untuk pembuatan dokumen compliance
            </CardDescription>
          </CardHeader>
          {guideOpen && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Gemini Guide */}
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">Google Gemini</p>
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded">
                        ✓ GRATIS — 15 req/menit
                      </span>
                    </div>
                  </div>
                  <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold">1</span>
                      <span>Buka{" "}
                        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">
                          aistudio.google.com/apikey
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold">2</span>
                      <span>Login dengan <strong>akun Google</strong> Anda (Gmail)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold">3</span>
                      <span>Klik tombol <strong>"Create API key"</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold">4</span>
                      <span>Pilih project Google (atau buat baru), klik <strong>"Create API key in existing project"</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold">5</span>
                      <span>Copy API key (diawali <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">AIza...</code>) → paste di form di bawah</span>
                    </li>
                  </ol>
                  <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                    <strong>Cara pakai:</strong> Pilih provider <em>Google Gemini</em>, tempel key, simpan. Lalu buka Document Builder → pilih template → klik "Buka di Gemini".
                  </div>
                </div>

                {/* Qwen Guide */}
                <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-purple-900 dark:text-purple-100">Qwen (Alibaba)</p>
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded">
                        ✓ GRATIS — quota awal tersedia
                      </span>
                    </div>
                  </div>
                  <ol className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-xs font-bold">1</span>
                      <span>Buka{" "}
                        <a href="https://bailian.console.aliyun.com/" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 underline font-medium">
                          bailian.console.aliyun.com
                        </a>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-xs font-bold">2</span>
                      <span>Daftar / Login akun <strong>Alibaba Cloud</strong> (bisa pakai email)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-xs font-bold">3</span>
                      <span>Di menu kiri, klik <strong>"API-KEY"</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-xs font-bold">4</span>
                      <span>Klik <strong>"Create API Key"</strong> → beri nama → Create</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-xs font-bold">5</span>
                      <span>Copy API key (diawali <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded text-xs">sk-...</code>) → paste di form di bawah</span>
                    </li>
                  </ol>
                  <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-xs text-purple-700 dark:text-purple-300">
                    <strong>Cara pakai:</strong> Pilih provider <em>Qwen (Alibaba)</em>, tempel key, simpan. Lalu buka Document Builder → pilih template → klik "Buka di Qwen".
                  </div>
                </div>

              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Catatan:</strong> API key di sini hanya digunakan untuk fitur tambahan di dalam aplikasi. Untuk penggunaan prompt biasa, Anda tidak perlu API key — cukup klik "Buka di Gemini" / "Buka di Qwen" di halaman Document Builder dan tempel prompt langsung di chat AI.
                </span>
              </div>
            </CardContent>
          )}
        </Card>

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
