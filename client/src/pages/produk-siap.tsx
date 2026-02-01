import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, ClipboardCheck, Award, RefreshCw, 
  ChevronRight, Download, Copy, CheckCircle2, 
  Clock, Target, BookOpen, ArrowRight, Sparkles,
  AlertTriangle, TrendingUp, ShieldCheck
} from "lucide-react";
import { PRODUK_SIAP, PRODUK_COLORS, getProdukStats } from "@/data/produk-siap";
import { SMAP_TEMPLATES } from "@/data/smap-templates-full";
import { Link } from "wouter";

const iconMap: Record<string, any> = {
  FileText,
  ClipboardCheck,
  Award,
  RefreshCw
};

const VERIFICATION_THRESHOLD = 70;

export default function ProdukSiap() {
  const { toast } = useToast();
  const [selectedProduk, setSelectedProduk] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const produk = selectedProduk ? PRODUK_SIAP.find(p => p.id === selectedProduk) : null;
  const colors = produk ? PRODUK_COLORS[produk.color] : null;

  // Get templates for selected produk
  const produkTemplates = useMemo(() => {
    if (!produk) return [];
    return SMAP_TEMPLATES.filter(t => produk.templateIds.includes(t.id));
  }, [produk]);

  // Calculate checklist progress
  const checklistProgress = useMemo(() => {
    if (!produk) return 0;
    const total = produk.checklistItems.length;
    if (total === 0) return 0;
    const checked = produk.checklistItems.filter(item => checkedItems[item.id]).length;
    return Math.round((checked / total) * 100);
  }, [produk, checkedItems]);

  // Calculate progress for all 4 phases
  const allPhasesProgress = useMemo(() => {
    return PRODUK_SIAP.reduce((acc, p) => {
      const total = p.checklistItems.length;
      const checked = p.checklistItems.filter(item => checkedItems[item.id]).length;
      const progress = total > 0 ? Math.round((checked / total) * 100) : 0;
      acc[p.id] = {
        progress,
        isVerified: progress >= VERIFICATION_THRESHOLD,
        remaining: Math.max(0, VERIFICATION_THRESHOLD - progress)
      };
      return acc;
    }, {} as Record<string, { progress: number; isVerified: boolean; remaining: number }>);
  }, [checkedItems]);

  const isCurrentPhaseVerified = produk ? allPhasesProgress[produk.id]?.isVerified : false;
  const currentPhaseRemaining = produk ? allPhasesProgress[produk.id]?.remaining : 0;

  const handleCheckItem = (itemId: string, checked: boolean) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: checked }));
  };

  const handleExportChecklist = () => {
    if (!produk) return;
    
    const lines = [
      `CHECKLIST ${produk.nama.toUpperCase()}`,
      `Deskripsi: ${produk.deskripsi}`,
      `Klausul Utama: ${produk.klausulUtama.join(", ")}`,
      `Estimasi Waktu: ${produk.estimasiWaktu}`,
      "",
      "STATUS | ITEM | KATEGORI | WAJIB",
      ...produk.checklistItems.map(item => 
        `${checkedItems[item.id] ? "[✓]" : "[ ]"} | ${item.item} | ${item.kategori} | ${item.wajib ? "Ya" : "Tidak"}`
      ),
      "",
      `Progress: ${checklistProgress}%`
    ];
    
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-${produk.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Checklist berhasil diexport" });
  };

  const handleCopyTemplateList = () => {
    if (!produk) return;
    
    const text = produkTemplates.map(t => `${t.id}: ${t.nama}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Daftar template berhasil disalin" });
  };

  // Overview cards for all products
  if (!selectedProduk) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Produk Siap SMAP</h1>
            <p className="text-muted-foreground mt-1">
              4 Fase Kesiapan Implementasi Sistem Manajemen Anti Penyuapan
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            SNI ISO 37001:2016
          </Badge>
        </div>

        {/* Overall Verification Status */}
        <Card className="border-2 border-primary/30 bg-primary/5" data-testid="card-overall-smap-status">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Status Kesiapan SMAP (Threshold: {VERIFICATION_THRESHOLD}%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUK_SIAP.map((p) => {
                const phaseData = allPhasesProgress[p.id] || { progress: 0, isVerified: false };
                const pColors = PRODUK_COLORS[p.color];
                return (
                  <div 
                    key={p.id} 
                    className={`p-3 rounded-lg border-2 ${phaseData.isVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-muted'}`}
                    data-testid={`status-${p.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium truncate">{p.nama}</span>
                      {phaseData.isVerified ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={phaseData.progress} className="h-2 flex-1" />
                      <span className={`text-xs font-bold ${phaseData.isVerified ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {phaseData.progress}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {phaseData.isVerified ? "Terverifikasi" : `Kurang ${phaseData.remaining}%`}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Journey Flow */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Perjalanan Sertifikasi SMAP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {PRODUK_SIAP.map((p, idx) => {
                const Icon = iconMap[p.icon];
                const pColors = PRODUK_COLORS[p.color];
                const phaseData = allPhasesProgress[p.id] || { progress: 0, isVerified: false };
                return (
                  <div key={p.id} className="flex items-center">
                    <div className={`flex flex-col items-center p-4 rounded-lg ${pColors.bg} ${pColors.text} relative`}>
                      {phaseData.isVerified && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <Icon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-medium text-center max-w-[100px]">{p.nama}</span>
                      <span className="text-xs mt-1 font-bold">{phaseData.progress}%</span>
                    </div>
                    {idx < PRODUK_SIAP.length - 1 && (
                      <ArrowRight className="w-6 h-6 mx-2 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUK_SIAP.map((p) => {
            const Icon = iconMap[p.icon];
            const pColors = PRODUK_COLORS[p.color];
            const stats = getProdukStats(p.id);
            
            return (
              <Card 
                key={p.id} 
                className={`cursor-pointer hover-elevate border-l-4 ${pColors.border}`}
                onClick={() => setSelectedProduk(p.id)}
                data-testid={`card-produk-${p.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${pColors.bg}`}>
                      <Icon className={`w-6 h-6 ${pColors.text}`} />
                    </div>
                    <Badge variant="secondary">{p.estimasiWaktu}</Badge>
                  </div>
                  <CardTitle className="mt-3">{p.nama}</CardTitle>
                  <CardDescription className="text-xs">{p.namaInggris}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {p.deskripsi}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{stats?.totalTemplates} Template</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                      <span>{stats?.totalChecklist} Checklist</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.klausulUtama.map(k => (
                      <Badge key={k} variant="outline" className="text-xs">
                        Klausul {k}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    data-testid={`button-select-${p.id}`}
                  >
                    Lihat Detail
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Integrasi dengan Fitur Lain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/template-repository">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs">Template Repository</span>
                  <Badge variant="secondary" className="text-xs">200+ Template</Badge>
                </Button>
              </Link>
              <Link href="/smap-checklist">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="text-xs">SMAP Checklist</span>
                  <Badge variant="secondary" className="text-xs">Permen PU 08</Badge>
                </Button>
              </Link>
              <Link href="/pdca-generator">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-xs">PDCA Generator</span>
                  <Badge variant="secondary" className="text-xs">AI Prompt</Badge>
                </Button>
              </Link>
              <Link href="/document-builder">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Document Builder</span>
                  <Badge variant="secondary" className="text-xs">9 Template</Badge>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Detail view for selected product
  const Icon = iconMap[produk!.icon];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedProduk(null)}
            data-testid="button-back"
          >
            ← Kembali
          </Button>
          <div className={`p-3 rounded-lg ${colors?.bg}`}>
            <Icon className={`w-6 h-6 ${colors?.text}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-produk-title">{produk!.nama}</h1>
            <p className="text-sm text-muted-foreground">{produk!.namaInggris}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {produk!.estimasiWaktu}
          </Badge>
        </div>
      </div>

      {/* Verification Status Card */}
      <Card className={`border-2 ${isCurrentPhaseVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'}`} data-testid="card-phase-verification">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isCurrentPhaseVerified ? (
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold" data-testid="text-phase-verification-status">
                  {isCurrentPhaseVerified ? `${produk!.nama} TERVERIFIKASI` : "BELUM TERVERIFIKASI"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isCurrentPhaseVerified 
                    ? `Selamat! Kesiapan ${produk!.nama} telah mencapai threshold ${VERIFICATION_THRESHOLD}%`
                    : `Diperlukan ${currentPhaseRemaining}% lagi untuk mencapai status Terverifikasi`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 ${isCurrentPhaseVerified ? 'text-green-600' : 'text-orange-600'}`} />
                <span className={`text-3xl font-bold ${isCurrentPhaseVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {checklistProgress}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Target: {VERIFICATION_THRESHOLD}%</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress Kesiapan</span>
              <span className="font-medium">{checklistProgress}% / {VERIFICATION_THRESHOLD}%</span>
            </div>
            <div className="relative">
              <Progress value={checklistProgress} className="h-3" />
              <div 
                className="absolute top-0 h-3 w-0.5 bg-red-500" 
                style={{ left: `${VERIFICATION_THRESHOLD}%` }}
                title={`Threshold ${VERIFICATION_THRESHOLD}%`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist" data-testid="tab-checklist">
            Checklist ({produk!.checklistItems.length})
          </TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">
            Template ({produkTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="output" data-testid="tab-output">
            Output ({produk!.outputUtama.length})
          </TabsTrigger>
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Checklist Kesiapan</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportChecklist}
                  data-testid="button-export-checklist"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {(() => {
                  const categories = Array.from(new Set(produk!.checklistItems.map(i => i.kategori)));
                  return categories.map(cat => (
                    <div key={cat} className="mb-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">{cat}</h4>
                      {produk!.checklistItems
                        .filter(i => i.kategori === cat)
                        .map(item => (
                          <div 
                            key={item.id} 
                            className="flex items-start gap-3 py-2 px-3 rounded-lg hover-elevate"
                          >
                            <Checkbox
                              id={item.id}
                              checked={checkedItems[item.id] || false}
                              onCheckedChange={(checked) => handleCheckItem(item.id, checked as boolean)}
                              data-testid={`checkbox-${item.id}`}
                            />
                            <div className="flex-1">
                              <label 
                                htmlFor={item.id} 
                                className={`text-sm cursor-pointer ${checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {item.item}
                              </label>
                            </div>
                            {item.wajib && (
                              <Badge variant="destructive" className="text-xs">Wajib</Badge>
                            )}
                          </div>
                        ))}
                      <Separator className="my-2" />
                    </div>
                  ));
                })()}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Template yang Diperlukan</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyTemplateList}
                    data-testid="button-copy-templates"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Salin Daftar
                  </Button>
                  <Link href="/template-repository">
                    <Button size="sm" data-testid="button-goto-repository">
                      Buka Repository
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {produkTemplates.length > 0 ? (
                  <div className="space-y-2">
                    {produkTemplates.map(template => (
                      <div 
                        key={template.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">
                              {template.id}
                            </Badge>
                            <span className="font-medium text-sm">{template.nama}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {template.deskripsi}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="secondary" className="text-xs">
                            {template.kategori}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.klausul}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Template akan ditambahkan ke repository</p>
                    <Link href="/template-repository">
                      <Button variant="ghost" className="mt-2">
                        Lihat semua template →
                      </Button>
                    </Link>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Output Tab */}
        <TabsContent value="output" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Output Utama</CardTitle>
              <CardDescription>
                Dokumen dan rekaman yang harus dihasilkan pada fase ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {produk!.outputUtama.map((output, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className={`p-2 rounded-lg ${colors?.bg}`}>
                      <CheckCircle2 className={`w-4 h-4 ${colors?.text}`} />
                    </div>
                    <span className="text-sm font-medium">{output}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Klausul Coverage */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Cakupan Klausul ISO 37001</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {produk!.klausulUtama.map(k => (
                  <Badge key={k} className={`${colors?.bg} ${colors?.text} border-0`}>
                    Klausul {k}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {produk!.deskripsi}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
