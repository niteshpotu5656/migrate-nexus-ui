
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

export default function DeltaSync() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Delta Sync</h1>
        <p className="text-muted-foreground mt-1">
          Synchronize incremental changes between databases
        </p>
      </div>

      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <span>Coming Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Delta sync functionality will be implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
