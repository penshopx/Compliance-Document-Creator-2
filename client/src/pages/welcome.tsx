import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Globe, Flag, Shield, FileCheck, CheckCircle2, ArrowRight, Building2, Scale, Award, 
  LogOut, Loader2, Gavel, Settings, FileText, Briefcase, ChevronRight, Building,
  Zap, Flame, Leaf, Store, Heart, GraduationCap, Laptop, Sprout, Factory, Home,
  Truck, Palmtree, Radio, HardHat
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useIndustry } from "@/hooks/use-industry";
import { useEffect, useState } from "react";
import { industryCompliances, domainInfo, type IndustryCompliance } from "@shared/data/industry-pathways";

const industryIcons: Record<string, any> = {
  konstruksi: HardHat,
  energi: Zap,
  migas: Flame,
  lingkungan: Leaf,
  umkm: Store,
  iso: Award,
  k3: Shield,
  tender: Briefcase,
  keuangan: Building,
  kesehatan: Heart,
  pendidikan: GraduationCap,
  teknologi: Laptop,
  pertanian: Sprout,
  manufaktur: Factory,
  properti: Home,
  logistik: Truck,
  pariwisata: Palmtree,
  telekomunikasi: Radio,
  smap: Globe,
  pancek: Flag,
};

const industryColors: Record<string, string> = {
  konstruksi: "orange",
  energi: "yellow",
  migas: "red",
  lingkungan: "green",
  umkm: "emerald",
  iso: "blue",
  k3: "red",
  tender: "purple",
  keuangan: "blue",
  kesehatan: "red",
  pendidikan: "indigo",
  teknologi: "cyan",
  pertanian: "green",
  manufaktur: "gray",
  properti: "emerald",
  logistik: "orange",
  pariwisata: "cyan",
  telekomunikasi: "indigo",
  smap: "blue",
  pancek: "red",
};

const domainIcons: Record<string, any> = {
  legalitas: FileText,
  perijinan: FileCheck,
  sertifikasi: Award,
  tender: Briefcase,
  operasional: Settings,
};

const domainColors: Record<string, { bg: string; text: string; border: string }> = {
  legalitas: { 
    bg: "bg-blue-100 dark:bg-blue-900/30", 
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  perijinan: { 
    bg: "bg-green-100 dark:bg-green-900/30", 
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800"
  },
  sertifikasi: { 
    bg: "bg-purple-100 dark:bg-purple-900/30", 
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800"
  },
  tender: { 
    bg: "bg-amber-100 dark:bg-amber-900/30", 
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800"
  },
  operasional: { 
    bg: "bg-orange-100 dark:bg-orange-900/30", 
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800"
  },
};

export default function WelcomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { currentIndustry, setIndustry, industries } = useIndustry();
  const [, setLocation] = useLocation();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industryData, setIndustryData] = useState<IndustryCompliance | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (selectedIndustry) {
      const data = industryCompliances[selectedIndustry];
      setIndustryData(data || null);
    } else {
      setIndustryData(null);
    }
  }, [selectedIndustry]);

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setIndustry(industryId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Compliance Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-right hidden sm:block">
              <div className="font-medium" data-testid="text-welcome-user">{user?.firstName || user?.email || 'User'}</div>
            </div>
            <Avatar className="h-8 w-8" data-testid="avatar-welcome-user">
              <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
              <AvatarFallback>{(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" asChild data-testid="button-welcome-logout">
              <a href="/api/logout" title="Keluar">
                <LogOut className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-welcome-title">Compliance Hub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selamat datang, {user?.firstName || 'User'}! Pilih industri dan jalur kepatuhan untuk memulai.
          </p>
        </div>

        {!selectedIndustry ? (
          <>
            <div className="max-w-6xl mx-auto mb-8">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Building2 className="h-8 w-8 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Pilih Sektor Industri Anda</h3>
                      <p className="text-muted-foreground">
                        Pilih sektor industri untuk melihat jalur kepatuhan yang relevan. 
                        Setiap industri memiliki 5 domain kepatuhan: Legalitas, Perijinan, Sertifikasi, Tender, dan Operasional.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {industries.length > 1 ? `${industries.length} Sektor Industri` : "Sektor Industri"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {industries
                  .filter((ind) => industryCompliances[ind.id])
                  .map((ind) => {
                  const industryId = ind.id;
                  const industry = industryCompliances[industryId];
                  const Icon = industryIcons[industryId] || Building2;
                  const color = industryColors[industryId] || "blue";
                  
                  const colorClasses: Record<string, string> = {
                    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
                    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
                    cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
                    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
                    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
                    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
                    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                    gray: "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400",
                  };

                  return (
                    <Card 
                      key={industryId}
                      className="hover-elevate cursor-pointer transition-all duration-300"
                      onClick={() => handleIndustrySelect(industryId)}
                      data-testid={`card-industry-${industryId}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`h-12 w-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mx-auto mb-3`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold text-sm">{industry.industryName}</h4>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="max-w-6xl mx-auto mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    5 Domain Kepatuhan
                  </CardTitle>
                  <CardDescription>
                    Semua dokumen bisnis terorganisir dalam 5 domain kepatuhan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(domainInfo).map(([key, domain]) => {
                      const Icon = domainIcons[key];
                      const colors = domainColors[key];
                      return (
                        <div key={key} className={`text-center p-4 rounded-xl border ${colors.border}`}>
                          <div className={`h-12 w-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{domain.name}</h4>
                          <p className="text-xs text-muted-foreground">{domain.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : industryData ? (
          <>
            <div className="max-w-6xl mx-auto mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedIndustry(null)}
                data-testid="button-back-to-industries"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Kembali ke Pilihan Industri
              </Button>
            </div>

            <div className="max-w-6xl mx-auto mb-8">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const Icon = industryIcons[selectedIndustry] || Building2;
                      return <Icon className="h-10 w-10 text-primary" />;
                    })()}
                    <div>
                      <h2 className="text-2xl font-bold">{industryData.industryName}</h2>
                      <p className="text-muted-foreground">
                        Pilih salah satu dari 5 domain kepatuhan untuk memulai
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(industryData.pathways).map(([domainKey, pathway]) => {
                  const Icon = domainIcons[domainKey];
                  const colors = domainColors[domainKey];
                  const domainData = domainInfo[domainKey as keyof typeof domainInfo];

                  return (
                    <Card 
                      key={pathway.id} 
                      className={`hover-elevate transition-all duration-300 border-2 ${colors.border}`}
                      data-testid={`card-pathway-${domainKey}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <Badge variant="secondary" className={`${colors.bg} ${colors.text} mb-1`}>
                              {domainData.name}
                            </Badge>
                            <CardTitle className="text-lg">{pathway.name}</CardTitle>
                          </div>
                        </div>
                        <CardDescription className="mt-2">
                          {pathway.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Dokumen Utama:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {pathway.documents.slice(0, 3).map((doc) => (
                              <li key={doc.id} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                <span className="truncate">{doc.name}</span>
                              </li>
                            ))}
                            {pathway.documents.length > 3 && (
                              <li className="text-xs text-muted-foreground ml-6">
                                +{pathway.documents.length - 3} dokumen lainnya
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="pt-3 border-t">
                          <h4 className="text-sm font-medium mb-2">Checklist:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {pathway.checklist.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="h-4 w-4 rounded border shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link href={`/pathway/${selectedIndustry}/${domainKey}`}>
                          <Button className="w-full mt-2" data-testid={`button-pathway-${domainKey}`}>
                            Mulai {domainData.name}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {(selectedIndustry === 'smap' || selectedIndustry === 'pancek') && (
              <div className="max-w-6xl mx-auto mt-8">
                <Card className="border-2 border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        {selectedIndustry === 'smap' ? (
                          <Globe className="h-10 w-10 text-blue-600" />
                        ) : (
                          <Flag className="h-10 w-10 text-red-600" />
                        )}
                        <div>
                          <h3 className="text-lg font-bold">
                            {selectedIndustry === 'smap' ? 'Dashboard SMAP Lengkap' : 'Dashboard Pancek Lengkap'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedIndustry === 'smap' 
                              ? 'Akses dashboard SMAP dengan 270+ template, checklist, dan AI prompt generator'
                              : 'Akses dashboard Pancek dengan 6 fase PDCAR dan integrasi Platform Jaga.id'}
                          </p>
                        </div>
                      </div>
                      <Link href={selectedIndustry === 'smap' ? '/dashboard' : '/pancek'}>
                        <Button size="lg" data-testid={`button-full-dashboard-${selectedIndustry}`}>
                          Buka Dashboard {selectedIndustry.toUpperCase()}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Data industri tidak ditemukan</p>
            <Button variant="ghost" onClick={() => setSelectedIndustry(null)} className="mt-4">
              Kembali
            </Button>
          </div>
        )}

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Compliance Hub - Platform Kepatuhan Multi-Industri Indonesia</p>
          <p className="mt-1">Legalitas • Perijinan • Sertifikasi • Tender • Operasional</p>
        </div>
      </div>
    </div>
  );
}
