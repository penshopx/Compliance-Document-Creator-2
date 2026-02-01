import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  FileCheck, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Award,
  Loader2
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SubscriptionPlan } from "@shared/schema";

export default function LandingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  const [pricingTab, setPricingTab] = useState<"smap" | "pancek">("smap");
  
  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });
  
  const smapPlans = plans?.filter(p => p.category === "smap") || [];
  const pancekPlans = plans?.filter(p => p.category === "pancek") || [];
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/welcome");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: "4 Fase Produk Siap SMAP",
      description: "Siap Dokumen → Siap Audit Internal → Siap Audit Eksternal → Siap Surveilance untuk sertifikasi SNI ISO 37001:2016"
    },
    {
      icon: Award,
      title: "3 Fase Kesiapan Pancek",
      description: "Siap Pengisian Kuesioner → Siap Terverifikasi → Siap Surveilance untuk Platform Jaga.id KPK"
    },
    {
      icon: FileCheck,
      title: "270+ Template Dokumen",
      description: "Template siap pakai untuk setiap fase SMAP dan Pancek, dilengkapi AI Prompt Generator"
    },
    {
      icon: Users,
      title: "Manajemen Tim Lengkap",
      description: "Kelola Tim FKAP, Tim Audit Internal, Manajemen, dan Pegawai untuk kepatuhan"
    },
    {
      icon: Building2,
      title: "Data Perusahaan Terintegrasi",
      description: "Profil perusahaan, proyek, vendor, peralatan, dan kualifikasi SBU dalam satu sistem"
    },
    {
      icon: BookOpen,
      title: "Dual AI Mentor",
      description: "SMAP Mentor untuk ISO 37001 dan Pancek Mentor untuk Panduan Cegah Korupsi KPK"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl" data-testid="text-brand">Compliance Hub</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Fitur</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">Harga</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild data-testid="button-login">
                <a href="/api/login">Masuk</a>
              </Button>
              <Button asChild data-testid="button-register">
                <a href="/api/login">Daftar <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4" data-testid="badge-construction">
              Untuk Perusahaan Konstruksi Indonesia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-headline">
              Sistem Manajemen <span className="text-primary">Anti Penyuapan</span> & Cegah Korupsi
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-subheadline">
              Platform lengkap untuk implementasi SNI ISO 37001:2016 (SMAP) dan Panduan Cegah Korupsi KPK (Pancek) dengan AI-powered document generation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild data-testid="button-cta-primary">
                <a href="/api/login">
                  Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-cta-secondary">
                <a href="#features">Pelajari Lebih Lanjut</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Gratis untuk memulai</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Tanpa kartu kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Setup dalam 5 menit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">Fitur Lengkap untuk Kepatuhan</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk implementasi sistem anti penyuapan dan cegah korupsi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Dual Pathway</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">SMAP & Pancek dalam Satu Platform</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 dark:text-blue-300">S</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">SMAP - SNI ISO 37001:2016</h3>
                    <p className="text-muted-foreground text-sm">Standar internasional untuk Sistem Manajemen Anti Penyuapan. Dengan 4 fase Produk Siap dan tracking progres sertifikasi.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                    <span className="font-bold text-green-600 dark:text-green-300">P</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Pancek - Panduan Cegah Korupsi KPK</h3>
                    <p className="text-muted-foreground text-sm">Panduan nasional dengan 6 fase PDCAR (Plan, Do, Check, Act, Respon) terintegrasi Platform Jaga.id.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">270+</div>
                  <div className="text-sm text-muted-foreground">Template Dokumen</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">51</div>
                  <div className="text-sm text-muted-foreground">Klausul PDCA</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">46</div>
                  <div className="text-sm text-muted-foreground">Referensi SMAP</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary">30+</div>
                  <div className="text-sm text-muted-foreground">Checklist Item</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">Pilih Paket Sesuai Tahapan Anda</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Harga berdasarkan fase kesiapan sertifikasi - bayar sesuai kebutuhan
            </p>
          </div>
          
          <Tabs value={pricingTab} onValueChange={(v) => setPricingTab(v as "smap" | "pancek")} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="smap" data-testid="tab-smap">
                <Shield className="h-4 w-4 mr-2" />
                SMAP (ISO 37001)
              </TabsTrigger>
              <TabsTrigger value="pancek" data-testid="tab-pancek">
                <Award className="h-4 w-4 mr-2" />
                Pancek (KPK)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="smap">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-2">SNI ISO 37001:2016</Badge>
                <p className="text-muted-foreground">4 Fase Produk Siap SMAP - Dari Dokumen hingga Perpanjangan Sertifikat</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {smapPlans.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p>Memuat paket SMAP...</p>
                  </div>
                )}
                {smapPlans.map((plan, index) => (
                  <Card key={plan.id} className={`relative ${index === 2 ? "border-primary shadow-lg" : ""}`} data-testid={`card-smap-${index}`}>
                    {index === 2 && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Terlengkap</Badge>}
                    <CardHeader className="pb-2">
                      <Badge variant="secondary" className="w-fit mb-2">Fase {index + 1}</Badge>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="text-xs">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                        <span className="text-sm text-muted-foreground">/bulan</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-2">Fitur:</p>
                        <ul className="space-y-1">
                          {plan.features?.split(",").slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                          {(plan.features?.split(",").length || 0) > 4 && (
                            <li className="text-xs text-muted-foreground">+{(plan.features?.split(",").length || 0) - 4} fitur lainnya</li>
                          )}
                        </ul>
                      </div>
                      {plan.materials && (
                        <div>
                          <p className="text-xs font-medium mb-2">Materi:</p>
                          <ul className="space-y-1">
                            {plan.materials.split(",").slice(0, 3).map((material, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <FileCheck className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                                <span>{material.trim()}</span>
                              </li>
                            ))}
                            {(plan.materials.split(",").length || 0) > 3 && (
                              <li className="text-xs text-muted-foreground">+{(plan.materials.split(",").length || 0) - 3} materi lainnya</li>
                            )}
                          </ul>
                        </div>
                      )}
                      <Button className="w-full" size="sm" variant={index === 2 ? "default" : "outline"} asChild data-testid={`button-smap-${index}`}>
                        <Link href={`/checkout?plan=${plan.id}`}>Pilih Paket</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pancek">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-2">Panduan Cegah Korupsi KPK</Badge>
                <p className="text-muted-foreground">3 Fase Kesiapan Pancek - Dari Kuesioner hingga Surveilance</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {pancekPlans.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p>Memuat paket Pancek...</p>
                  </div>
                )}
                {pancekPlans.map((plan, index) => (
                  <Card key={plan.id} className={`relative ${index === 1 ? "border-primary shadow-lg" : ""}`} data-testid={`card-pancek-${index}`}>
                    {index === 1 && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Populer</Badge>}
                    <CardHeader className="pb-2">
                      <Badge variant="secondary" className="w-fit mb-2">Fase {index + 1}</Badge>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="text-xs">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                        <span className="text-sm text-muted-foreground">/bulan</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-2">Fitur:</p>
                        <ul className="space-y-1">
                          {plan.features?.split(",").slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                          {(plan.features?.split(",").length || 0) > 4 && (
                            <li className="text-xs text-muted-foreground">+{(plan.features?.split(",").length || 0) - 4} fitur lainnya</li>
                          )}
                        </ul>
                      </div>
                      {plan.materials && (
                        <div>
                          <p className="text-xs font-medium mb-2">Materi:</p>
                          <ul className="space-y-1">
                            {plan.materials.split(",").slice(0, 3).map((material, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <FileCheck className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                                <span>{material.trim()}</span>
                              </li>
                            ))}
                            {(plan.materials.split(",").length || 0) > 3 && (
                              <li className="text-xs text-muted-foreground">+{(plan.materials.split(",").length || 0) - 3} materi lainnya</li>
                            )}
                          </ul>
                        </div>
                      )}
                      <Button className="w-full" size="sm" variant={index === 1 ? "default" : "outline"} asChild data-testid={`button-pancek-${index}`}>
                        <Link href={`/checkout?plan=${plan.id}`}>Pilih Paket</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Card className="mt-12 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-6 text-center">Metode Pembayaran Indonesia</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Transfer Bank
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "BCA", account: "1234567890" },
                      { name: "Mandiri", account: "1234567890123" },
                      { name: "BRI", account: "123456789012345" },
                      { name: "BNI", account: "1234567890" }
                    ].map((bank) => (
                      <div key={bank.name} className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-sm">{bank.name}</div>
                        <div className="text-xs text-muted-foreground">{bank.account}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">a.n. PT Compliance Hub Indonesia</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    E-Wallet & QRIS
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["GoPay", "OVO", "Dana", "ShopeePay"].map((wallet) => (
                      <div key={wallet} className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-sm">{wallet}</div>
                        <div className="text-xs text-muted-foreground">Via QRIS</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Scan QRIS setelah checkout</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground mb-3">Konfirmasi pembayaran via WhatsApp:</p>
                <Button variant="outline" asChild>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                    WhatsApp: 0812-3456-7890
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Memulai Perjalanan Compliance?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Bergabung dengan perusahaan konstruksi Indonesia yang sudah menggunakan Compliance Hub untuk implementasi SMAP dan Pancek.
          </p>
          <Button size="lg" asChild data-testid="button-final-cta">
            <a href="/api/login">
              Daftar Sekarang - Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Compliance Hub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2024 Compliance Hub. Platform Kepatuhan untuk Konstruksi Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
