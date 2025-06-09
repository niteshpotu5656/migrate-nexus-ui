
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function RuleTemplates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rule Templates</h1>
        <p className="text-muted-foreground mt-1">
          Manage and share transformation rule templates
        </p>
      </div>

      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Coming Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Rule templates functionality will be implemented in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
