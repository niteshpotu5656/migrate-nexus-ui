
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Settings,
  Database,
  History,
  FileText,
  Key,
  BarChart3,
  Download,
  Sync,
  Terminal,
  CheckCircle,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', icon: Home, url: '/dashboard' },
  { title: 'New Migration', icon: Database, url: '/migration-wizard' },
  { title: 'Migration History', icon: History, url: '/migration-history' },
  { title: 'Rule Templates', icon: FileText, url: '/rule-templates' },
  { title: 'Credential Vault', icon: Key, url: '/credential-vault' },
  { title: 'Analytics', icon: BarChart3, url: '/analytics' },
  { title: 'Export Panel', icon: Download, url: '/export-panel' },
  { title: 'Delta Sync', icon: Sync, url: '/delta-sync' },
  { title: 'Developer Console', icon: Terminal, url: '/developer-console' },
  { title: 'Update Checker', icon: CheckCircle, url: '/update-checker' },
  { title: 'Settings', icon: Settings, url: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <ShadSidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">DB Migrator</h1>
            <p className="text-xs text-sidebar-foreground/60">Universal Migration Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                className="w-full justify-start hover:bg-sidebar-accent"
              >
                <Link to={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/60 space-y-1">
          <p>Version 2.1.0</p>
          <p>Built with ❤️ by Lovable</p>
        </div>
      </SidebarFooter>
    </ShadSidebar>
  );
}
