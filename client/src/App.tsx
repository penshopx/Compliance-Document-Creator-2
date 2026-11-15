import { lazy, Suspense } from "react";
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
import HelpDeskChatbot from "@/components/help-desk-chatbot";
import KnowledgeChatbot from "@/components/knowledge-chatbot";
import AiAvailabilityBanner from "@/components/ai-availability-banner";
import { isIndustryEnabled } from "@/data/industry-configs";

const NotFound = lazy(() => import("@/pages/not-found"));
const LandingPage = lazy(() => import("@/pages/landing"));
const WelcomePage = lazy(() => import("@/pages/welcome"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const CompanyPage = lazy(() => import("@/pages/company"));
const ManagementPage = lazy(() => import("@/pages/management"));
const FkapPage = lazy(() => import("@/pages/fkap"));
const AuditInternalPage = lazy(() => import("@/pages/audit-internal"));
const EmployeesPage = lazy(() => import("@/pages/employees"));
const QualificationsPage = lazy(() => import("@/pages/qualifications"));
const EquipmentPage = lazy(() => import("@/pages/equipment"));
const ProjectsPage = lazy(() => import("@/pages/projects"));
const VendorsPage = lazy(() => import("@/pages/vendors"));
const DocumentsPage = lazy(() => import("@/pages/documents"));
const PDCAGenerator = lazy(() => import("@/pages/pdca-generator"));
const DocumentBuilder = lazy(() => import("@/pages/document-builder"));
const SMAPReferencePage = lazy(() => import("@/pages/smap-reference"));
const TemplateRepository = lazy(() => import("@/pages/template-repository"));
const SMAPChecklist = lazy(() => import("@/pages/smap-checklist"));
const ProdukSiap = lazy(() => import("@/pages/produk-siap"));
const PancekPage = lazy(() => import("@/pages/pancek"));
const PancekGenerator = lazy(() => import("@/pages/pancek-generator"));
const IndustrySettingsPage = lazy(() => import("@/pages/industry-settings"));
const AiSettingsPage = lazy(() => import("@/pages/ai-settings"));
const CheckoutPage = lazy(() => import("@/pages/checkout"));
const KnowledgeBasePage = lazy(() => import("@/pages/knowledge-base"));
const PathwayPage = lazy(() => import("@/pages/pathway"));
const AdminPaymentsPage = lazy(() => import("@/pages/admin-payments"));
const GustafdaDialog = lazy(() => import("@/pages/gustafta-dialog"));
const GustafdaCollab = lazy(() => import("@/pages/gustafta-collab"));
const ProjectIntegrityPage = lazy(() => import("@/pages/project-integrity"));
const DocumentSimulatorPage = lazy(() => import("@/pages/document-simulator"));

function Router() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground" role="status">Memuat halaman…</div>}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/welcome" component={WelcomePage} />
        <Route path="/checkout" component={CheckoutPage} />
        {isIndustryEnabled("pancek") && <Route path="/pancek/checklist">{() => <PancekPage initialTab="checklist" />}</Route>}
        {isIndustryEnabled("pancek") && <Route path="/pancek/documents">{() => <PancekPage initialTab="documents" />}</Route>}
        {isIndustryEnabled("pancek") && <Route path="/pancek">{() => <PancekPage />}</Route>}
        {isIndustryEnabled("pancek") && <Route path="/pancek-generator" component={PancekGenerator} />}
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/company" component={CompanyPage} />
        <Route path="/management" component={ManagementPage} />
        <Route path="/fkap" component={FkapPage} />
        <Route path="/audit-internal" component={AuditInternalPage} />
        <Route path="/employees" component={EmployeesPage} />
        <Route path="/qualifications" component={QualificationsPage} />
        <Route path="/equipment" component={EquipmentPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/project-integrity" component={ProjectIntegrityPage} />
        <Route path="/vendors" component={VendorsPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/document-simulator" component={DocumentSimulatorPage} />
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
        <Route path="/gustafta-dialog" component={GustafdaDialog} />
        <Route path="/gustafta-collab" component={GustafdaCollab} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isFullWidthPage = location === "/pdca";
  const isStandalonePage = location === "/" || location === "/welcome" || location.startsWith("/pancek") || location.startsWith("/checkout") || location.startsWith("/pathway") || location.startsWith("/admin");

  if (isStandalonePage) {
    return (
      <div className="min-h-screen w-full">
        <AiAvailabilityBanner />
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
          <AiAvailabilityBanner />
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
