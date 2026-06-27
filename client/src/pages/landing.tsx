import { useAuth } from "@/hooks/use-auth";
import { useIndustry } from "@/hooks/use-industry";
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
  Loader2,
  Bot,
  Settings2,
  Sparkles,
  Zap,
  Fuel,
  Leaf,
  Store,
  HardHat,
  Gavel,
  Banknote,
  Bell,
  Sun,
  Mountain,
  FileText,
  Upload,
  Lock,
  ClipboardCheck,
  AlertTriangle,
  Search,
  Calculator,
  TrendingUp,
  Briefcase,
  Receipt,
  FileSpreadsheet,
  LayoutDashboard,
  Wrench,
  FolderKanban,
  Handshake,
  UserCheck,
  FilePlus2,
  Library,
  ListChecks,
  Package,
  Home,
  Map,
  Truck,
  Warehouse,
  FileSearch,
  Factory,
  CheckCircle,
  Globe,
  ShoppingCart,
  Table,
  History,
  Settings,
  CreditCard,
  Star,
  Copyright,
  Scale,
  ArrowRightLeft,
  StickyNote,
  Percent,
  Key,
  AlertOctagon,
  Target,
  GitCompare,
  Trees,
  Droplets,
  FileBarChart,
  Mail,
  FileSignature,
  BarChart3,
  Building,
  CheckSquare,
  ClipboardList,
  MessageSquare,
  RefreshCw,
  Heart,
  GraduationCap,
  Laptop,
  Wheat,
  Palmtree,
  Radio,
  Play,
  Clock,
  ArrowDown,
  Quote,
  Timer,
  Rocket,
  ChevronRight,
  MousePointer2,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SubscriptionPlan } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, FileCheck, Users, Building2, BookOpen, Award, Bot, Settings2, Sparkles, Zap,
  Fuel, Leaf, Store, HardHat, Gavel, Banknote, Bell, Sun, Mountain, FileText,
  Upload, Lock, ClipboardCheck, AlertTriangle, Search, Calculator, TrendingUp, Briefcase,
  Receipt, FileSpreadsheet, LayoutDashboard, Wrench, FolderKanban, Handshake, UserCheck,
  FilePlus2, Library, ListChecks, Package, Home, Map, Truck, Warehouse, FileSearch,
  Factory, CheckCircle, Globe, ShoppingCart, Table, History, Settings, CreditCard, Star,
  Copyright, Scale, ArrowRightLeft, StickyNote, Percent, Key, AlertOctagon, Target,
  GitCompare, Trees, Droplets, FileBarChart, Mail, FileSignature, BarChart3, Building,
  CheckSquare, ClipboardList, MessageSquare, RefreshCw, Heart, GraduationCap, Laptop,
  Wheat, Palmtree, Radio,
};

const colorMap: Record<string, { bg: string; bgDark: string; text: string; textDark: string }> = {
  blue: { bg: "bg-blue-100", bgDark: "dark:bg-blue-900", text: "text-blue-600", textDark: "dark:text-blue-300" },
  green: { bg: "bg-green-100", bgDark: "dark:bg-green-900", text: "text-green-600", textDark: "dark:text-green-300" },
  amber: { bg: "bg-amber-100", bgDark: "dark:bg-amber-900", text: "text-amber-600", textDark: "dark:text-amber-300" },
  yellow: { bg: "bg-yellow-100", bgDark: "dark:bg-yellow-900", text: "text-yellow-600", textDark: "dark:text-yellow-300" },
  orange: { bg: "bg-orange-100", bgDark: "dark:bg-orange-900", text: "text-orange-600", textDark: "dark:text-orange-300" },
  purple: { bg: "bg-purple-100", bgDark: "dark:bg-purple-900", text: "text-purple-600", textDark: "dark:text-purple-300" },
  indigo: { bg: "bg-indigo-100", bgDark: "dark:bg-indigo-900", text: "text-indigo-600", textDark: "dark:text-indigo-300" },
  red: { bg: "bg-red-100", bgDark: "dark:bg-red-900", text: "text-red-600", textDark: "dark:text-red-300" },
  cyan: { bg: "bg-cyan-100", bgDark: "dark:bg-cyan-900", text: "text-cyan-600", textDark: "dark:text-cyan-300" },
  emerald: { bg: "bg-emerald-100", bgDark: "dark:bg-emerald-900", text: "text-emerald-600", textDark: "dark:text-emerald-300" },
};

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Direktur Kepatuhan",
    company: "PT Konstruksi Nusantara",
    avatar: "BS",
    content: "Platform ini membantu kami mendapatkan sertifikasi ISO 37001 dalam waktu 3 bulan. AI Mentor sangat membantu dalam menyusun dokumen yang kompleks.",
    rating: 5,
  },
  {
    name: "Siti Rahayu",
    role: "Manager SMAP",
    company: "PT Energi Hijau Indonesia",
    avatar: "SR",
    content: "Sangat terkesan dengan kelengkapan template dokumen. 270+ template yang tersedia sangat mempercepat proses implementasi SMAP kami.",
    rating: 5,
  },
  {
    name: "Ahmad Wijaya",
    role: "Kepala Bagian Hukum",
    company: "BUMN Infrastruktur",
    avatar: "AW",
    content: "Fitur PDCA Generator dengan 51 klausul sangat membantu tim kami memahami dan mengimplementasikan SNI ISO 37001 secara sistematis.",
    rating: 5,
  },
];

const trustedCompanies = [
  "PT Konstruksi Indonesia", "Pertamina", "PLN", "Telkom Indonesia",
  "Bank Mandiri", "Garuda Indonesia", "Angkasa Pura", "Waskita Karya"
];

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div ref={ref} className="text-center p-6">
      <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { currentIndustry, industries, setIndustry, currentIndustryId } = useIndustry();
  const [, setLocation] = useLocation();
  const [pricingTab, setPricingTab] = useState<"smap" | "pancek">("smap");
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });

  const { data: paymentConfig } = useQuery<{
    whatsapp: string;
    accountHolder: string;
    banks: { bca: string; mandiri: string; bri: string; bni: string };
    qrisImageUrl: string;
  }>({
    queryKey: ["/api/payment-config"],
  });

  const configuredBanks = paymentConfig
    ? [
        { name: "BCA", account: paymentConfig.banks.bca },
        { name: "Mandiri", account: paymentConfig.banks.mandiri },
        { name: "BRI", account: paymentConfig.banks.bri },
        { name: "BNI", account: paymentConfig.banks.bni },
      ].filter(b => b.account)
    : [];

  const waNumber = paymentConfig?.whatsapp || "";
  const openWA = () => {
    const msg = encodeURIComponent("Halo, saya tertarik dengan Compliance Hub. Bisa ceritakan lebih lanjut?");
    const dest = waNumber ? `https://wa.me/${waNumber}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(dest, "_blank");
  };
  
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
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/welcome");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">Memuat platform...</p>
        </div>
      </div>
    );
  }

  const landingContent = currentIndustry?.landingContent;
  const features = landingContent?.features || [];

  const getFeatureIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Shield;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 animate-pulse" />
                <Shield className="relative h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" data-testid="text-brand">
                Compliance Hub
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#domains" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-domains">5 Domain</a>
              <a href="#industries" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-industries">Industri</a>
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">Fitur</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-testimonials">Testimoni</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">Harga</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild data-testid="button-login">
                <a href="/api/login">Masuk</a>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600" asChild data-testid="button-register">
                <a href="/api/login">Mulai Gratis <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-20 px-4 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0" data-testid="badge-platform">
                <Sparkles className="h-4 w-4 mr-2" />
                {industries.length > 1
                  ? `Platform Generator Dokumen AI untuk ${industries.length}+ Industri`
                  : "Platform Generator Dokumen AI untuk SMAP (SNI ISO 37001:2016)"}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight" data-testid="text-headline">
                <span className="text-foreground">{landingContent?.headline || "Otomatisasi"}</span>{" "}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {landingContent?.headlineHighlight || "Dokumen Compliance"}
                </span>{" "}
                <span className="text-foreground">dengan AI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed" data-testid="text-subheadline">
                {landingContent?.subheadline || "Hemat 80% waktu pembuatan dokumen compliance. 270+ template siap pakai, AI Mentor 24/7, dan sistem terintegrasi untuk berbagai standar industri."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25" asChild data-testid="button-cta-primary">
                  <a href="/api/login">
                    <Rocket className="mr-2 h-5 w-5" />
                    {landingContent?.ctaPrimary || "Mulai Gratis Sekarang"}
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-cta-secondary">
                  <a href="#demo">
                    <Play className="mr-2 h-5 w-5" />
                    Lihat Demo
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <span>270+ template siap pakai</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Support Bahasa Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <span>SNI ISO 37001:2016</span>
                </div>
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">AI Mentor</div>
                        <div className="text-xs text-green-600 flex items-center gap-1">
                          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          Online 24/7
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                        <p className="text-sm">Buatkan dokumen Pedoman SMAP untuk PT Konstruksi Indonesia sesuai SNI ISO 37001:2016</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl rounded-tr-none p-4 max-w-[85%] ml-auto text-white">
                        <p className="text-sm">Baik, saya akan membuatkan dokumen Pedoman SMAP yang mencakup: Ruang Lingkup, Acuan Normatif, Istilah dan Definisi, Konteks Organisasi, Kepemimpinan...</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">270+</div>
                        <div className="text-xs text-muted-foreground">Template</div>
                      </div>
                      <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-xl">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">51</div>
                        <div className="text-xs text-muted-foreground">Klausul</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{industries.length}</div>
                        <div className="text-xs text-muted-foreground">Industri</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Hemat 80% waktu</span>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium">ISO 37001 Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
            <a href="#stats" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-sm">Scroll untuk melihat lebih</span>
              <ArrowDown className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 px-4 bg-white/50 dark:bg-slate-800/30 border-y border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value={500} label="Perusahaan Terdaftar" suffix="+" />
            <AnimatedStat value={15000} label="Dokumen Dihasilkan" suffix="+" />
            <AnimatedStat value={98} label="Tingkat Kepuasan" suffix="%" />
            <AnimatedStat value={80} label="Waktu Tersimpan" suffix="%" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-8">Dipercaya oleh perusahaan terkemuka di Indonesia</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {trustedCompanies.map((company, idx) => (
              <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="domains" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Framework Kepatuhan</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-domains-title">
              5 Domain <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Kepatuhan Usaha</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Semua dokumen bisnis Anda terorganisir dalam 5 domain kepatuhan yang jelas dan terstruktur
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="hover-elevate text-center" data-testid="card-domain-legalitas">
              <CardContent className="p-6">
                <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Legalitas</h3>
                <p className="text-sm text-muted-foreground mb-4">Dokumen dasar legalitas usaha</p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="secondary" className="text-xs">Akta</Badge>
                  <Badge variant="secondary" className="text-xs">NIB</Badge>
                  <Badge variant="secondary" className="text-xs">NPWP</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-domain-perijinan">
              <CardContent className="p-6">
                <div className="h-16 w-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Perijinan</h3>
                <p className="text-sm text-muted-foreground mb-4">Izin-izin sesuai bidang usaha</p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="secondary" className="text-xs">SBU</Badge>
                  <Badge variant="secondary" className="text-xs">SKK</Badge>
                  <Badge variant="secondary" className="text-xs">SIUP</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-domain-sertifikasi">
              <CardContent className="p-6">
                <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Sertifikasi</h3>
                <p className="text-sm text-muted-foreground mb-4">Standar mutu dan kepatuhan</p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="secondary" className="text-xs">ISO</Badge>
                  <Badge variant="secondary" className="text-xs">SNI</Badge>
                  <Badge variant="secondary" className="text-xs">K3</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-domain-tender">
              <CardContent className="p-6">
                <div className="h-16 w-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                  <Gavel className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Tender</h3>
                <p className="text-sm text-muted-foreground mb-4">Dokumen pengadaan barang/jasa</p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="secondary" className="text-xs">RAB</Badge>
                  <Badge variant="secondary" className="text-xs">Metode</Badge>
                  <Badge variant="secondary" className="text-xs">Penawaran</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate text-center" data-testid="card-domain-operasional">
              <CardContent className="p-6">
                <div className="h-16 w-16 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Operasional</h3>
                <p className="text-sm text-muted-foreground mb-4">Dokumen operasional harian</p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="secondary" className="text-xs">SOP</Badge>
                  <Badge variant="secondary" className="text-xs">Laporan</Badge>
                  <Badge variant="secondary" className="text-xs">QC</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              {industries.length > 1
                ? `Semua ${industries.length} sektor industri menggunakan framework 5 domain ini`
                : "SMAP (SNI ISO 37001:2016) menggunakan framework 5 domain ini"}
            </p>
            <Button variant="outline" asChild>
              <a href="#industries">Lihat Semua Industri <ChevronRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      <section id="industries" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              {industries.length > 1 ? `${industries.length} Industri Tersedia` : "SMAP Tersedia"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-industries-title">
              Solusi untuk <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Setiap Industri</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pilih industri Anda dan dapatkan template, checklist, dan AI Mentor yang sudah disesuaikan
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {industries.map((ind) => {
              const isActive = currentIndustryId === ind.id;
              const Icon = iconMap[ind.icon] || Shield;
              const colors = colorMap[ind.color] || colorMap.blue;
              return (
                <Card 
                  key={ind.id} 
                  className={`cursor-pointer transition-all duration-300 ${isActive ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20" : "hover-elevate"}`}
                  onClick={() => setIndustry(ind.id)}
                  data-testid={`card-industry-${ind.id}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${colors.bg} ${colors.bgDark}`}>
                      <Icon className={`h-6 w-6 ${colors.text} ${colors.textDark}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{ind.shortName}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ind.tagline}</p>
                    {isActive && (
                      <Badge className="mt-2 bg-blue-500">Aktif</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">{currentIndustry?.shortName || "Fitur Unggulan"}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
              Fitur yang Membuat Anda <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Lebih Produktif</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk implementasi {currentIndustry?.name || "sistem compliance"} dalam satu platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.slice(0, 6).map((feature, index) => {
              const FeatureIcon = getFeatureIcon(feature.icon);
              return (
                <Card key={index} className="group hover-elevate hover:shadow-xl transition-all duration-300" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                      <FeatureIcon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Pelajari lebih lanjut</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">AI Mentor yang Memahami Kebutuhan Anda</h3>
                <p className="text-white/80 mb-6">
                  Chatbot AI yang sudah dilatih khusus untuk membantu Anda membuat dokumen sesuai standar industri. Tersedia 24/7 untuk menjawab pertanyaan dan generate dokumen.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-white/20 text-white border-0">Bahasa Indonesia</Badge>
                  <Badge className="bg-white/20 text-white border-0">Context-Aware</Badge>
                  <Badge className="bg-white/20 text-white border-0">Real-time</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <Bot className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Mentor AI</div>
                  <div className="text-sm text-white/70">Per industri</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Help Bot</div>
                  <div className="text-sm text-white/70">Panduan app</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <Library className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Knowledge Base</div>
                  <div className="text-sm text-white/70">Referensi lengkap</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Instant</div>
                  <div className="text-sm text-white/70">Respon cepat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimoni</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Apa Kata <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Pengguna Kami</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ratusan perusahaan sudah merasakan manfaat platform kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card 
                key={idx} 
                className={`transition-all duration-500 ${activeTestimonial === idx ? "scale-105 shadow-xl ring-2 ring-blue-500/50" : "hover-elevate"}`}
                data-testid={`card-testimonial-${idx}`}
              >
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-blue-200 dark:text-blue-800 mb-4" />
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Harga Transparan</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">
              Investasi untuk <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Kepatuhan Bisnis</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pilih paket sesuai tahapan Anda - bayar hanya untuk yang Anda butuhkan
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Penawaran terbatas: Diskon 20% untuk pendaftaran bulan ini</span>
            </div>
          </div>
          
          <Tabs value={pricingTab} onValueChange={(v) => setPricingTab(v as "smap" | "pancek")} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12">
              <TabsTrigger value="smap" className="text-sm" data-testid="tab-smap">
                <Shield className="h-4 w-4 mr-2" />
                SMAP (ISO 37001)
              </TabsTrigger>
              <TabsTrigger value="pancek" className="text-sm" data-testid="tab-pancek">
                <Award className="h-4 w-4 mr-2" />
                Pancek (KPK)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="smap">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-2">SNI ISO 37001:2016</Badge>
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
                  <Card 
                    key={plan.id} 
                    className={`relative transition-all duration-300 hover:shadow-xl ${index === 2 ? "ring-2 ring-blue-500 shadow-xl scale-105" : "hover-elevate"}`} 
                    data-testid={`card-smap-${index}`}
                  >
                    {index === 2 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4">
                          <Star className="h-3 w-3 mr-1" />
                          Terlengkap
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit mb-2">Fase {index + 1}</Badge>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="text-xs">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                        <span className="text-sm text-muted-foreground">/bulan</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-2">Termasuk:</p>
                        <ul className="space-y-2">
                          {plan.features?.split(",").slice(0, 5).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                          {(plan.features?.split(",").length || 0) > 5 && (
                            <li className="text-sm text-muted-foreground pl-6">+{(plan.features?.split(",").length || 0) - 5} fitur lainnya</li>
                          )}
                        </ul>
                      </div>
                      <Button 
                        className={`w-full ${index === 2 ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}`} 
                        variant={index === 2 ? "default" : "outline"} 
                        asChild 
                        data-testid={`button-smap-${index}`}
                      >
                        <Link href={`/checkout?plan=${plan.id}`}>
                          Pilih Paket
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pancek">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-2">Panduan Cegah Korupsi KPK</Badge>
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
                  <Card 
                    key={plan.id} 
                    className={`relative transition-all duration-300 hover:shadow-xl ${index === 1 ? "ring-2 ring-blue-500 shadow-xl scale-105" : "hover-elevate"}`} 
                    data-testid={`card-pancek-${index}`}
                  >
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4">
                          <Star className="h-3 w-3 mr-1" />
                          Populer
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit mb-2">Fase {index + 1}</Badge>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="text-xs">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                        <span className="text-sm text-muted-foreground">/bulan</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-2">Termasuk:</p>
                        <ul className="space-y-2">
                          {plan.features?.split(",").slice(0, 5).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{feature.trim()}</span>
                            </li>
                          ))}
                          {(plan.features?.split(",").length || 0) > 5 && (
                            <li className="text-sm text-muted-foreground pl-6">+{(plan.features?.split(",").length || 0) - 5} fitur lainnya</li>
                          )}
                        </ul>
                      </div>
                      <Button 
                        className={`w-full ${index === 1 ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}`} 
                        variant={index === 1 ? "default" : "outline"} 
                        asChild 
                        data-testid={`button-pancek-${index}`}
                      >
                        <Link href={`/checkout?plan=${plan.id}`}>
                          Pilih Paket
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {(configuredBanks.length > 0 || paymentConfig?.qrisImageUrl) && (
            <Card className="mt-12 max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-0">
                <div className="grid sm:grid-cols-2">
                  {configuredBanks.length > 0 && (
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Transfer Bank
                      </h3>
                      <p className="text-xs text-muted-foreground">a.n. {paymentConfig?.accountHolder}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {configuredBanks.map((bank) => (
                          <div key={bank.name} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                              <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{bank.name}</div>
                              <div className="text-xs font-mono text-muted-foreground">{bank.account}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-cyan-600" />
                      E-Wallet & QRIS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["GoPay", "OVO", "Dana", "ShopeePay", "QRIS"].map((wallet) => (
                        <Badge key={wallet} variant="secondary" className="text-sm">
                          {wallet}
                        </Badge>
                      ))}
                    </div>
                    {paymentConfig?.qrisImageUrl ? (
                      <img src={paymentConfig.qrisImageUrl} alt="QRIS" className="max-w-[160px] rounded-lg mx-auto" />
                    ) : (
                      <p className="text-sm text-muted-foreground">Scan QRIS untuk pembayaran instan</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[length:200%_auto] animate-gradient text-white border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Siap Memulai Perjalanan Compliance Anda?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Konsultasikan kebutuhan SMAP atau Pancek Anda bersama tim kami — kami siap membantu dari nol hingga sertifikasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                  <a href="/api/login">
                    <Rocket className="mr-2 h-5 w-5" />
                    Coba Sekarang
                  </a>
                </Button>
                {waNumber && (
                  <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10" onClick={openWA} data-testid="button-wa-cta">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Hubungi via WhatsApp
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Setup 5 menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Support Bahasa Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>270+ template siap pakai</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-lg">Compliance Hub</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Platform Generator Dokumen AI untuk kepatuhan bisnis Indonesia — SMAP & Pancek.
              </p>
              {waNumber && (
                <button
                  onClick={openWA}
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                  data-testid="button-footer-wa"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat via WhatsApp
                </button>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Harga</a></li>
                <li><a href="#industries" className="hover:text-white transition-colors">Industri</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>SMAP (SNI ISO 37001:2016)</li>
                <li>Pancek (Panduan KPK)</li>
                <li>270+ Template Dokumen</li>
                <li>Konsultasi Compliance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {waNumber && (
                  <li>
                    <button onClick={openWA} className="hover:text-white transition-colors text-left">
                      WA: +{waNumber}
                    </button>
                  </li>
                )}
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Compliance Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
