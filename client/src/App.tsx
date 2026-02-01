import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isFullWidthPage = location === "/pdca";

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center gap-4 h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <div className="flex-1" />
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
        <SidebarProvider style={style as React.CSSProperties}>
          <AppContent />
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
