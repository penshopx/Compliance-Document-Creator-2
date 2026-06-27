import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  ClipboardCheck,
  Award,
  Wrench,
  FolderKanban,
  Handshake,
  FileText,
  UserCheck,
  Zap,
  FilePlus2,
  BookOpen,
  Library,
  ListChecks,
  Package,
  Home,
  Settings2,
  Fuel,
  Leaf,
  Store,
  HardHat,
  Gavel,
  Banknote,
  Map,
  Truck,
  Warehouse,
  FileSearch,
  Factory,
  CheckCircle,
  Globe,
  ShoppingCart,
  Calculator,
  FileSpreadsheet,
  Table,
  History,
  Settings,
  CreditCard,
  Receipt,
  Star,
  Copyright,
  Scale,
  TrendingUp,
  ArrowRightLeft,
  StickyNote,
  Percent,
  Key,
  AlertOctagon,
  Target,
  GitCompare,
  Search,
  Sun,
  Mountain,
  Trees,
  Droplets,
  FileBarChart,
  AlertTriangle,
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
  ChevronDown,
} from "lucide-react";
import { useIndustry } from "@/hooks/use-industry";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  LayoutDashboard,
  Building2,
  Users,
  Shield,
  ClipboardCheck,
  Award,
  Wrench,
  FolderKanban,
  Handshake,
  FileText,
  UserCheck,
  Zap,
  FilePlus2,
  BookOpen,
  Library,
  ListChecks,
  Package,
  Settings2,
  Fuel,
  Leaf,
  Store,
  HardHat,
  Gavel,
  Banknote,
  Map,
  Truck,
  Warehouse,
  FileSearch,
  Factory,
  CheckCircle,
  Globe,
  ShoppingCart,
  Calculator,
  FileSpreadsheet,
  Table,
  History,
  Settings,
  CreditCard,
  Receipt,
  Star,
  Copyright,
  Scale,
  TrendingUp,
  ArrowRightLeft,
  StickyNote,
  Percent,
  Key,
  AlertOctagon,
  Target,
  GitCompare,
  Search,
  Sun,
  Mountain,
  Trees,
  Droplets,
  FileBarChart,
  AlertTriangle,
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
};

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-600", text: "text-blue-600" },
  green: { bg: "bg-green-600", text: "text-green-600" },
  amber: { bg: "bg-amber-600", text: "text-amber-600" },
  yellow: { bg: "bg-yellow-600", text: "text-yellow-600" },
  orange: { bg: "bg-orange-600", text: "text-orange-600" },
  purple: { bg: "bg-purple-600", text: "text-purple-600" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-600" },
  red: { bg: "bg-red-600", text: "text-red-600" },
  cyan: { bg: "bg-cyan-600", text: "text-cyan-600" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600" },
};

export function AppSidebar() {
  const [location] = useLocation();
  const { currentIndustry, industries, setIndustry, currentIndustryId } = useIndustry();
  const [industriesOpen, setIndustriesOpen] = useState(false);

  const menuGroups = currentIndustry?.menuGroups || [];

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  const IndustryIcon = getIcon(currentIndustry?.icon || "Shield");
  const colors = colorMap[currentIndustry?.color || "blue"] || colorMap.blue;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-md ${colors.bg}`}>
            <IndustryIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">
              Compliance Hub
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {currentIndustry?.shortName || "Platform"}
            </span>
          </div>
        </div>
        
        {industries.length > 1 && (
        <Collapsible
          open={industriesOpen}
          onOpenChange={setIndustriesOpen}
          className="mt-3"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between text-xs h-8"
              data-testid="button-industry-selector"
            >
              <span className="flex items-center gap-2">
                <span className="text-sidebar-foreground/60">Industri:</span>
                <span className="font-semibold">
                  {currentIndustry?.shortName || "Pilih"}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  industriesOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="flex flex-wrap gap-1">
              {industries.map((ind) => (
                <Button
                  key={ind.id}
                  variant={currentIndustryId === ind.id ? "default" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => {
                    setIndustry(ind.id);
                    setIndustriesOpen(false);
                  }}
                  data-testid={`sidebar-industry-${ind.id}`}
                >
                  {ind.shortName}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {menuGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className={groupIdx > 0 ? "mt-6" : ""}>
            <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url}
                        className="h-10"
                      >
                        <Link href={item.url} data-testid={`nav-${item.url.replace("/", "") || "home"}`}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
            Bantuan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/knowledge-base"}
                  className="h-10"
                >
                  <Link href="/knowledge-base" data-testid="nav-knowledge-base">
                    <BookOpen className="h-4 w-4" />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/industry-settings"}
                  className="h-10"
                >
                  <Link href="/industry-settings" data-testid="nav-industry-settings">
                    <Settings2 className="h-4 w-4" />
                    <span>Pengaturan Industri</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/ai-settings"}
                  className="h-10"
                >
                  <Link href="/ai-settings" data-testid="nav-ai-settings">
                    <Key className="h-4 w-4" />
                    <span>Pengaturan AI</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-medium ${colors.text}`}>
            {currentIndustry?.tagline || "Platform Generik"}
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            {currentIndustry?.name || "Generator Dokumen"}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
