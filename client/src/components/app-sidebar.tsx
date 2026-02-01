import { Link, useLocation } from "wouter";
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
} from "lucide-react";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Profil Perusahaan", url: "/company", icon: Building2 },
  { title: "Manajemen Perusahaan", url: "/management", icon: Users },
  { title: "Tim FKAP", url: "/fkap", icon: Shield },
  { title: "Tim Audit Internal", url: "/audit-internal", icon: ClipboardCheck },
];

const dataMenuItems = [
  { title: "Karyawan", url: "/employees", icon: UserCheck },
  { title: "Klasifikasi SBU", url: "/qualifications", icon: Award },
  { title: "Peralatan", url: "/equipment", icon: Wrench },
  { title: "Proyek", url: "/projects", icon: FolderKanban },
  { title: "Vendor & Mitra", url: "/vendors", icon: Handshake },
];

const documentMenuItems = [
  { title: "Produk Siap SMAP", url: "/produk-siap", icon: Package },
  { title: "Checklist SMAP", url: "/smap-checklist", icon: ListChecks },
  { title: "Template Repository", url: "/template-repository", icon: Library },
  { title: "Referensi Dokumen", url: "/smap-reference", icon: BookOpen },
  { title: "Generator Dokumen", url: "/documents", icon: FileText },
  { title: "Document Builder", url: "/document-builder", icon: FilePlus2 },
  { title: "PDCA Generator", url: "/pdca", icon: Zap },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sidebar-primary">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">
              Compliance Hub
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              SMAP Document Builder
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="h-10"
                  >
                    <Link href={item.url} data-testid={`nav-${item.url.replace("/", "") || "dashboard"}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
            Data Perusahaan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="h-10"
                  >
                    <Link href={item.url} data-testid={`nav-${item.url.replace("/", "")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider px-2 mb-2">
            Dokumen SMAP
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documentMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="h-10"
                  >
                    <Link href={item.url} data-testid={`nav-${item.url.replace("/", "")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-sidebar-primary">
            SNI ISO 37001:2016
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            Sistem Manajemen Anti Penyuapan
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
