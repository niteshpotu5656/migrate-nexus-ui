
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Eye, Download, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const mockMigrations = [
  {
    id: 'mig-001',
    name: 'PostgreSQL → MySQL Migration',
    status: 'completed',
    startTime: '2024-01-15 14:30:00',
    endTime: '2024-01-15 17:15:00',
    duration: '2h 45m',
    recordsTransferred: 1250000,
    sourceDb: 'PostgreSQL 14.2',
    targetDb: 'MySQL 8.0',
  },
  {
    id: 'mig-002',
    name: 'Oracle → PostgreSQL Migration',
    status: 'running',
    startTime: '2024-01-15 16:15:00',
    endTime: null,
    duration: '1h 23m',
    recordsTransferred: 850000,
    sourceDb: 'Oracle 19c',
    targetDb: 'PostgreSQL 15.1',
  },
  {
    id: 'mig-003',
    name: 'MySQL → SQLite Migration',
    status: 'failed',
    startTime: '2024-01-15 12:00:00',
    endTime: '2024-01-15 12:45:00',
    duration: '45m',
    recordsTransferred: 125000,
    sourceDb: 'MySQL 8.0',
    targetDb: 'SQLite 3.40',
  },
];

export default function MigrationHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'running': return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-error" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-success/10 text-success">Completed</Badge>;
      case 'running': return <Badge className="bg-warning/10 text-warning">Running</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Migration History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your database migration history
          </p>
        </div>
      </div>

      {/* Migrations List */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <span>Recent Migrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMigrations.map((migration) => (
              <div
                key={migration.id}
                className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(migration.status)}
                    <div>
                      <h4 className="font-semibold text-foreground">{migration.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {migration.sourceDb} → {migration.targetDb}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(migration.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Started</p>
                    <p className="text-foreground font-medium">{migration.startTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="text-foreground font-medium">{migration.duration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Records</p>
                    <p className="text-foreground font-medium">
                      {migration.recordsTransferred.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
