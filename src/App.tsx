
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WizardProvider } from "@/context/WizardContext";
import { AppShell } from "@/components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import MigrationWizard from "./pages/MigrationWizard";
import MigrationHistory from "./pages/MigrationHistory";
import RuleTemplates from "./pages/RuleTemplates";
import CredentialVault from "./pages/CredentialVault";
import Analytics from "./pages/Analytics";
import ExportPanel from "./pages/ExportPanel";
import DeltaSync from "./pages/DeltaSync";
import DeveloperConsole from "./pages/DeveloperConsole";
import UpdateChecker from "./pages/UpdateChecker";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WizardProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<AppShell />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="migration-wizard" element={<MigrationWizard />} />
              <Route path="migration-history" element={<MigrationHistory />} />
              <Route path="rule-templates" element={<RuleTemplates />} />
              <Route path="credential-vault" element={<CredentialVault />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="export-panel" element={<ExportPanel />} />
              <Route path="delta-sync" element={<DeltaSync />} />
              <Route path="developer-console" element={<DeveloperConsole />} />
              <Route path="update-checker" element={<UpdateChecker />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WizardProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
