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
};

export function AppSidebar() {
  const [location] = useLocation();
  const { currentIndustry, industries, setIndustry, currentIndustryId } = useIndustry();

  const menuGroups = currentIndustry?.menuGroups || [];

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-md ${currentIndustry?.color === "green" ? "bg-green-600" : "bg-sidebar-primary"}`}>
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
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
        
        <div className="mt-3 flex gap-1">
          {industries.map((ind) => (
            <Button
              key={ind.id}
              variant={currentIndustryId === ind.id ? "default" : "ghost"}
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => setIndustry(ind.id)}
              data-testid={`sidebar-industry-${ind.id}`}
            >
              {ind.shortName}
            </Button>
          ))}
        </div>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className={`text-xs font-medium ${currentIndustry?.color === "green" ? "text-green-600" : "text-sidebar-primary"}`}>
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
