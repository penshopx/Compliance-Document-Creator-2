import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { IndustryProvider } from "@/hooks/use-industry";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import WelcomePage from "@/pages/welcome";
import Dashboard from "@/pages/dashboard";
import CompanyPage from "@/pages/company";
import ManagementPage from "@/pages/management";
import FkapPage from "@/pages/fkap";
import AuditInternalPage from "@/pages/audit-internal";
import EmployeesPage from "@/pages/employees";
import QualificationsPage from "@/pages/qualifications";
import EquipmentPage from "@/pages/equipment";
import ProjectsPage from "@/pages/projects";
import VendorsPage from "@/pages/vendors";
import DocumentsPage from "@/pages/documents";
import PDCAGenerator from "@/pages/pdca-generator";
import DocumentBuilder from "@/pages/document-builder";
import SMAPReferencePage from "@/pages/smap-reference";
import TemplateRepository from "@/pages/template-repository";
import SMAPChecklist from "@/pages/smap-checklist";
import ProdukSiap from "@/pages/produk-siap";
import PancekPage from "@/pages/pancek";
import IndustrySettingsPage from "@/pages/industry-settings";
import AiSettingsPage from "@/pages/ai-settings";
import HelpDeskChatbot from "@/components/help-desk-chatbot";
import KnowledgeChatbot from "@/components/knowledge-chatbot";
import CheckoutPage from "@/pages/checkout";
import KnowledgeBasePage from "@/pages/knowledge-base";
import PathwayPage from "@/pages/pathway";
import AdminPaymentsPage from "@/pages/admin-payments";
import { isIndustryEnabled } from "@/data/industry-configs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/checkout" component={CheckoutPage} />
      {isIndustryEnabled("pancek") && <Route path="/pancek" component={PancekPage} />}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/company" component={CompanyPage} />
      <Route path="/management" component={ManagementPage} />
      <Route path="/fkap" component={FkapPage} />
      <Route path="/audit-internal" component={AuditInternalPage} />
      <Route path="/employees" component={EmployeesPage} />
      <Route path="/qualifications" component={QualificationsPage} />
      <Route path="/equipment" component={EquipmentPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/vendors" component={VendorsPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/pdca" component={PDCAGenerator} />
      <Route path="/document-builder" component={DocumentBuilder} />
      <Route path="/smap-reference" component={SMAPReferencePage} />
      <Route path="/template-repository" component={TemplateRepository} />
      <Route path="/smap-checklist" component={SMAPChecklist} />
      <Route path="/produk-siap" component={ProdukSiap} />
      <Route path="/industry-settings" component={IndustrySettingsPage} />
      <Route path="/ai-settings" component={AiSettingsPage} />
      <Route path="/knowledge-base" component={KnowledgeBasePage} />
      <Route path="/pathway/:industryId/:domainId" component={PathwayPage} />
      <Route path="/admin/payments" component={AdminPaymentsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isFullWidthPage = location === "/pdca";
  const isStandalonePage = location === "/" || location === "/welcome" || location === "/pancek" || location.startsWith("/checkout") || location.startsWith("/pathway") || location.startsWith("/admin");

  if (isStandalonePage) {
    return (
      <div className="min-h-screen w-full">
        <Router />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center gap-4 h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <div className="flex-1" />
          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-right hidden sm:block">
                <div className="font-medium" data-testid="text-user-name">{user.firstName || user.email}</div>
              </div>
              <Avatar className="h-8 w-8" data-testid="avatar-user">
                <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || 'User'} />
                <AvatarFallback>{(user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" asChild data-testid="button-logout">
                <a href="/api/logout" title="Keluar">
                  <LogOut className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </header>
        <main className={`flex-1 overflow-auto ${isFullWidthPage ? "" : "p-6"}`}>
          <Router />
        </main>
      </div>
    </div>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <IndustryProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <AppContent />
          </SidebarProvider>
          <HelpDeskChatbot />
          <KnowledgeChatbot />
          <Toaster />
        </IndustryProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
