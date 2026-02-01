import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function LandingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

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
      title: "Sistem Anti Penyuapan",
      description: "Implementasi SNI ISO 37001:2016 dan Pancek KPK dengan panduan lengkap"
    },
    {
      icon: FileCheck,
      title: "270+ Template Dokumen",
      description: "Template siap pakai untuk SMAP dan Pancek, langsung generate dengan AI"
    },
    {
      icon: Users,
      title: "Manajemen Tim",
      description: "Kelola tim FKAP, Audit Internal, dan struktur organisasi compliance"
    },
    {
      icon: Building2,
      title: "Data Perusahaan",
      description: "Simpan profil perusahaan, proyek, vendor, dan kualifikasi SBU"
    },
    {
      icon: BookOpen,
      title: "AI Mentor",
      description: "Asisten AI yang siap membantu implementasi SMAP dan Pancek"
    },
    {
      icon: Award,
      title: "Tracking Sertifikasi",
      description: "Pantau progres menuju sertifikasi ISO 37001 dengan status real-time"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Gratis",
      period: "",
      description: "Untuk memulai perjalanan compliance",
      features: [
        "1 Profil Perusahaan",
        "Akses Pancek Basic",
        "5 Template Dokumen",
        "SMAP Mentor AI (terbatas)"
      ],
      cta: "Mulai Gratis",
      popular: false
    },
    {
      name: "Professional",
      price: "Rp 499.000",
      period: "/bulan",
      description: "Untuk perusahaan yang serius",
      features: [
        "Unlimited Perusahaan",
        "Akses SMAP + Pancek",
        "270+ Template Dokumen",
        "SMAP Mentor AI Unlimited",
        "Export PDF & Word",
        "Tracking Sertifikasi"
      ],
      cta: "Mulai Trial 14 Hari",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Untuk grup perusahaan besar",
      features: [
        "Semua fitur Professional",
        "Multi-User Access",
        "Dedicated Account Manager",
        "Training & Konsultasi",
        "Integrasi API",
        "SLA Support 24/7"
      ],
      cta: "Hubungi Sales",
      popular: false
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">Pilih Paket yang Sesuai</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mulai gratis dan upgrade sesuai kebutuhan perusahaan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                data-testid={`card-pricing-${index}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Paling Populer
                  </Badge>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                    data-testid={`button-pricing-${index}`}
                  >
                    <a href="/api/login">{plan.cta}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
