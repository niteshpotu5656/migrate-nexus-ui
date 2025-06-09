
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function ExportPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Export Panel</h1>
        <p className="text-muted-foreground mt-1">
          Export migration configurations and results
        </p>
      </div>

      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-primary" />
            <span>Coming Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Export functionality will be implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
