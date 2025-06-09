
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function UpdateChecker() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Update Checker</h1>
        <p className="text-muted-foreground mt-1">
          Check for application updates and manage versions
        </p>
      </div>

      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Coming Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Update checker functionality will be implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
