import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Shield, ClipboardList, Settings, ClipboardCheck, RefreshCw, MessageSquare,
  ChevronRight, CheckCircle2, Circle, ExternalLink, FileText, Copy, Search,
  Flag, ArrowLeft, BookOpen, Download, Award, AlertTriangle, TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  PANCEK_PHASES, 
  getPancekStats, 
  getAllPancekDocuments,
  type PancekPhase,
  type PancekChecklistItem,
  type PancekDocument
} from "@/data/pancek-data";

const PHASE_ICONS: Record<string, any> = {
  "Shield": Shield,
  "ClipboardList": ClipboardList,
  "Settings": Settings,
  "ClipboardCheck": ClipboardCheck,
  "RefreshCw": RefreshCw,
  "MessageSquare": MessageSquare
};

const PHASE_COLORS: Record<string, string> = {
  "red": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  "orange": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  "green": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  "blue": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "purple": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "teal": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
};

const ICON_COLORS: Record<string, string> = {
  "red": "text-red-600 dark:text-red-400",
  "orange": "text-orange-600 dark:text-orange-400",
  "green": "text-green-600 dark:text-green-400",
  "blue": "text-blue-600 dark:text-blue-400",
  "purple": "text-purple-600 dark:text-purple-400",
  "teal": "text-teal-600 dark:text-teal-400"
};

export default function PancekPage() {
  const { toast } = useToast();
  const [selectedPhase, setSelectedPhase] = useState<string>("komitmen");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: progressData, isLoading: progressLoading } = useQuery<{ progress: Record<string, boolean> }>({
    queryKey: ["/api/pancek/progress"],
    retry: false,
  });

  useEffect(() => {
    if (progressData?.progress) {
      setCheckedItems(progressData.progress);
    }
  }, [progressData]);

  const saveMutation = useMutation({
    mutationFn: (items: Record<string, boolean>) =>
      apiRequest("POST", "/api/pancek/progress", { items }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] }),
  });

  const stats = getPancekStats();
  const currentPhase = PANCEK_PHASES.find(p => p.id === selectedPhase);

  const VERIFICATION_THRESHOLD = 70;

  const overallProgress = useMemo(() => {
    const totalRequired = PANCEK_PHASES.flatMap(p => p.checklistItems).filter(i => i.required).length;
    const completedRequired = PANCEK_PHASES.flatMap(p => p.checklistItems)
      .filter(i => i.required && checkedItems[i.id]).length;
    return totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;
  }, [checkedItems]);

  const isVerified = overallProgress >= VERIFICATION_THRESHOLD;
  const remainingForVerification = Math.max(0, VERIFICATION_THRESHOLD - overallProgress);

  const phaseProgress = useMemo(() => {
    return PANCEK_PHASES.reduce((acc, phase) => {
      const total = phase.checklistItems.filter(i => i.required).length;
      const completed = phase.checklistItems.filter(i => i.required && checkedItems[i.id]).length;
      acc[phase.id] = total > 0 ? Math.round((completed / total) * 100) : 0;
      return acc;
    }, {} as Record<string, number>);
  }, [checkedItems]);

  const filteredDocuments = useMemo(() => {
    const allDocs = getAllPancekDocuments();
    if (!searchQuery) return allDocs;
    const query = searchQuery.toLowerCase();
    return allDocs.filter(d => 
      d.nama.toLowerCase().includes(query) ||
      d.kode.toLowerCase().includes(query) ||
      d.deskripsi.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleCheckItem = useCallback((itemId: string, checked: boolean) => {
    const updated = { ...checkedItems, [itemId]: checked };
    setCheckedItems(updated);
    saveMutation.mutate(updated);
  }, [checkedItems, saveMutation]);

  const copyPrompt = (doc: PancekDocument) => {
    const prompt = `${doc.promptTemplate}

---
Dokumen: ${doc.nama}
Kategori: ${doc.kategori}
Dasar Hukum: ${doc.dasarHukum || "Panduan CEK KPK"}
Penanggung Jawab: ${doc.penanggungJawab}`;

    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt disalin",
      description: `Prompt untuk "${doc.nama}" telah disalin ke clipboard`
    });
  };

  const exportChecklist = () => {
    const lines = ["CHECKLIST PANCEK - PANDUAN CEGAH KORUPSI KPK", ""];
    
    PANCEK_PHASES.forEach(phase => {
      lines.push(`\n## ${phase.order}. ${phase.name.toUpperCase()}`);
      lines.push(`Progress: ${phaseProgress[phase.id]}%\n`);
      
      phase.checklistItems.forEach(item => {
        const status = checkedItems[item.id] ? "[x]" : "[ ]";
        const required = item.required ? "(Wajib)" : "(Opsional)";
        lines.push(`${status} ${item.id}. ${item.question} ${required}`);
      });
    });

    lines.push(`\n\n---\nTotal Progress: ${overallProgress}%`);
    lines.push(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-pancek-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Checklist diekspor",
      description: "File checklist telah diunduh"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Flag className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold" data-testid="text-pancek-title">Pancek</h1>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                Pengakuan Nasional
              </Badge>
            </div>
            <p className="text-muted-foreground">Panduan Cegah Korupsi - KPK Indonesia</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportChecklist} data-testid="button-export-checklist">
            <Download className="h-4 w-4 mr-2" />
            Export Checklist
          </Button>
          <a href="https://jaga.id" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" data-testid="button-jaga-id">
              <ExternalLink className="h-4 w-4 mr-2" />
              Platform Jaga.id
            </Button>
          </a>
        </div>
      </div>

      <Card className={`border-2 ${isVerified ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'}`} data-testid="card-verification-status">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isVerified ? (
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold" data-testid="text-verification-status">
                  {isVerified ? "PANCEK TERVERIFIKASI" : "BELUM TERVERIFIKASI"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isVerified 
                    ? "Selamat! Kesesuaian dan kecukupan telah mencapai threshold 70%"
                    : `Diperlukan ${remainingForVerification}% lagi untuk mencapai status Terverifikasi`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 ${isVerified ? 'text-green-600' : 'text-orange-600'}`} />
                <span className={`text-3xl font-bold ${isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {overallProgress}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Target: {VERIFICATION_THRESHOLD}%</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress Kesesuaian</span>
              <span className="font-medium">{overallProgress}% / {VERIFICATION_THRESHOLD}%</span>
            </div>
            <div className="relative">
              <Progress value={overallProgress} className="h-3" />
              <div 
                className="absolute top-0 h-3 w-0.5 bg-red-500" 
                style={{ left: `${VERIFICATION_THRESHOLD}%` }}
                title="Threshold 70%"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.totalPhases}</div>
            <div className="text-sm text-muted-foreground">Fase PDCAR</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.totalChecklistItems}</div>
            <div className="text-sm text-muted-foreground">Item Checklist</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.totalDocuments}</div>
            <div className="text-sm text-muted-foreground">Template Dokumen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
              <span className="text-sm text-muted-foreground">Kesesuaian</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview PDCAR
          </TabsTrigger>
          <TabsTrigger value="checklist" data-testid="tab-checklist">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Checklist Kepatuhan
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            <FileText className="h-4 w-4 mr-2" />
            Template Dokumen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4">
            {PANCEK_PHASES.map(phase => {
              const Icon = PHASE_ICONS[phase.icon];
              const progress = phaseProgress[phase.id];
              
              return (
                <Card 
                  key={phase.id} 
                  className={`hover-elevate cursor-pointer transition-all ${selectedPhase === phase.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => {
                    setSelectedPhase(phase.id);
                    setActiveTab("checklist");
                  }}
                  data-testid={`card-phase-${phase.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${PHASE_COLORS[phase.color]}`}>
                        {Icon && <Icon className={`h-6 w-6 ${ICON_COLORS[phase.color]}`} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">{phase.order}</Badge>
                            <h3 className="font-semibold text-lg">{phase.name}</h3>
                            <span className="text-muted-foreground">({phase.nameEn})</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                {phase.checklistItems.length} checklist | {phase.documents.length} dokumen
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={progress} className="h-2 w-24" />
                                <span className="text-sm font-medium">{progress}%</span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-2">{phase.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Referensi Dasar Hukum</CardTitle>
              <CardDescription>Peraturan perundangan yang menjadi dasar Pancek</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Undang-Undang</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• UU No. 28/1999 - Penyelenggaraan Negara Bersih dari KKN</li>
                    <li>• UU No. 31/1999 jo UU No. 20/2001 - Pemberantasan Tipikor</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Peraturan Pelaksana</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Perma No. 13/2016 - Pemidanaan Korporasi</li>
                    <li>• PP No. 43/2018 - Peran Serta Masyarakat</li>
                    <li>• SE Kemen BUMN No. SE-2/MBU/07/2019</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {PANCEK_PHASES.map(phase => {
              const Icon = PHASE_ICONS[phase.icon];
              return (
                <Button
                  key={phase.id}
                  variant={selectedPhase === phase.id ? "default" : "outline"}
                  onClick={() => setSelectedPhase(phase.id)}
                  className="gap-2"
                  data-testid={`button-phase-${phase.id}`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {phase.name}
                  <Badge variant="secondary" className="ml-1">
                    {phaseProgress[phase.id]}%
                  </Badge>
                </Button>
              );
            })}
          </div>

          {currentPhase && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className={PHASE_COLORS[currentPhase.color]}>
                    Fase {currentPhase.order}
                  </Badge>
                  <CardTitle>{currentPhase.name}</CardTitle>
                </div>
                <CardDescription>{currentPhase.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPhase.checklistItems.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      checkedItems[item.id] ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''
                    }`}
                    data-testid={`checklist-item-${item.id}`}
                  >
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={(checked) => handleCheckItem(item.id, checked as boolean)}
                      data-testid={`checkbox-${item.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label 
                          htmlFor={item.id} 
                          className={`font-medium cursor-pointer ${checkedItems[item.id] ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.id}. {item.question}
                        </label>
                        {item.required ? (
                          <Badge variant="destructive" className="text-xs">Wajib</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Opsional</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.reference && (
                        <p className="text-xs text-muted-foreground mt-1">Ref: {item.reference}</p>
                      )}
                    </div>
                    {checkedItems[item.id] ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-documents"
              />
            </div>
            <Badge variant="secondary">{filteredDocuments.length} dokumen</Badge>
          </div>

          <div className="grid gap-4">
            {PANCEK_PHASES.map(phase => {
              const phaseDocs = filteredDocuments.filter(d => d.phaseId === phase.id);
              if (phaseDocs.length === 0) return null;
              
              const Icon = PHASE_ICONS[phase.icon];
              
              return (
                <Card key={phase.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className={`h-5 w-5 ${ICON_COLORS[phase.color]}`} />}
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <Badge variant="secondary">{phaseDocs.length} dokumen</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {phaseDocs.map(doc => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                          data-testid={`doc-${doc.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">{doc.kode}</Badge>
                              <span className="font-medium">{doc.nama}</span>
                              <Badge className={
                                doc.tingkatKritis === "Wajib" ? "bg-red-100 text-red-700 dark:bg-red-900/30" :
                                doc.tingkatKritis === "Penting" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30" :
                                "bg-gray-100 text-gray-700 dark:bg-gray-900/30"
                              }>
                                {doc.tingkatKritis}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{doc.deskripsi}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Kategori: {doc.kategori}</span>
                              <span>PIC: {doc.penanggungJawab}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyPrompt(doc)}
                            data-testid={`button-copy-${doc.id}`}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Salin Prompt
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
