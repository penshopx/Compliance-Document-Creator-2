import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/hooks/use-industry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Settings2, 
  Download, 
  Upload, 
  Check, 
  FileText, 
  Bot, 
  LayoutDashboard,
  Shield,
  Award,
  Sparkles
} from "lucide-react";

export default function IndustrySettingsPage() {
  const { toast } = useToast();
  const { currentIndustry, industries, setIndustry, currentIndustryId } = useIndustry();
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportConfig = () => {
    if (!currentIndustry) return;
    
    const configJson = JSON.stringify(currentIndustry, null, 2);
    const blob = new Blob([configJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentIndustry.id}-config.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Konfigurasi diekspor",
      description: `File ${currentIndustry.id}-config.json telah diunduh`
    });
  };

  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const config = JSON.parse(text);
        
        toast({
          title: "Konfigurasi berhasil dibaca",
          description: `Industri "${config.name}" berhasil dimuat. Fitur import penuh akan tersedia segera.`
        });
      } catch {
        toast({
          title: "Gagal membaca file",
          description: "Pastikan file JSON valid",
          variant: "destructive"
        });
      }
    };
    input.click();
  };

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield": return <Shield className="h-6 w-6" />;
      case "Award": return <Award className="h-6 w-6" />;
      default: return <Settings2 className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Pengaturan Industri</h1>
              <p className="text-muted-foreground text-sm">
                Kelola konfigurasi platform untuk berbagai industri dan standar compliance
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  Pilih Industri
                </CardTitle>
                <CardDescription>
                  Konfigurasi aktif untuk platform Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {industries.map((ind) => {
                  const isActive = currentIndustryId === ind.id;
                  return (
                    <Card 
                      key={ind.id}
                      className={`cursor-pointer transition-all hover-elevate ${isActive ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setIndustry(ind.id)}
                      data-testid={`card-industry-${ind.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${ind.color === "green" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                            {getIndustryIcon(ind.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{ind.shortName}</h3>
                              {isActive && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{ind.tagline}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                <Card className="border-dashed cursor-pointer hover-elevate opacity-60">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Tambah Industri Baru</p>
                    <p className="text-xs text-muted-foreground">Segera tersedia</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Import / Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleExportConfig}
                  data-testid="button-export-config"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Konfigurasi
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleImportConfig}
                  data-testid="button-import-config"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Konfigurasi
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {currentIndustry && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${currentIndustry.color === "green" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
                        {getIndustryIcon(currentIndustry.icon)}
                      </div>
                      <div>
                        <CardTitle>{currentIndustry.name}</CardTitle>
                        <CardDescription>{currentIndustry.tagline}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{currentIndustry.shortName}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="templates">Template ({currentIndustry.templates.length})</TabsTrigger>
                      <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
                      <TabsTrigger value="menu">Menu</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-2">Deskripsi</h3>
                          <p className="text-sm text-muted-foreground">{currentIndustry.description}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Fitur Utama</h3>
                          <div className="grid md:grid-cols-2 gap-3">
                            {currentIndustry.landingContent.features.slice(0, 4).map((feature, idx) => (
                              <Card key={idx} className="bg-muted/30">
                                <CardContent className="p-3">
                                  <h4 className="font-medium text-sm">{feature.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">Statistik</h3>
                          <div className="grid grid-cols-4 gap-3">
                            {currentIndustry.landingContent.stats.map((stat, idx) => (
                              <Card key={idx} className="bg-muted/30">
                                <CardContent className="p-3 text-center">
                                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="templates">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {currentIndustry.templateCategories.map(cat => (
                            <Badge key={cat.id} variant="outline">{cat.label}</Badge>
                          ))}
                        </div>
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-2 pr-4">
                            {currentIndustry.templates.map((template) => (
                              <Card key={template.code} className="hover-elevate">
                                <CardContent className="p-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${template.color}`}>
                                      <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{template.title}</span>
                                        {template.clause && (
                                          <Badge variant="secondary" className="text-xs">
                                            Klausul {template.clause}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{template.description}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </TabsContent>

                    <TabsContent value="chatbot">
                      <div className="space-y-4">
                        <Card className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`p-2 rounded-lg ${currentIndustry.color === "green" ? "bg-green-100" : "bg-blue-100"}`}>
                                <Bot className={`h-5 w-5 ${currentIndustry.color === "green" ? "text-green-600" : "text-blue-600"}`} />
                              </div>
                              <div>
                                <h3 className="font-semibold">{currentIndustry.chatbot.name}</h3>
                                <p className="text-xs text-muted-foreground">{currentIndustry.chatbot.description}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Topik yang Disarankan</h4>
                                <div className="flex flex-wrap gap-1">
                                  {currentIndustry.chatbot.suggestedTopics.map((topic, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{topic}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="menu">
                      <div className="space-y-4">
                        {currentIndustry.menuGroups.map((group, idx) => (
                          <Card key={idx} className="bg-muted/30">
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-3">{group.label}</h3>
                              <div className="grid md:grid-cols-2 gap-2">
                                {group.items.map((item, iidx) => (
                                  <div 
                                    key={iidx} 
                                    className="flex items-center gap-2 text-sm p-2 rounded-md bg-background"
                                  >
                                    <span className="text-muted-foreground">{item.icon}</span>
                                    <span>{item.title}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">{item.url}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
