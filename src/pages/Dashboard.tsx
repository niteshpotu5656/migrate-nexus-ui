
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Server,
  HardDrive,
  Cpu,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const recentMigrations = [
    {
      id: 'mig-001',
      name: 'PostgreSQL → MySQL Migration',
      status: 'completed',
      progress: 100,
      duration: '2h 45m',
      recordsTransferred: 1250000,
      startTime: '2024-01-15 14:30:00',
    },
    {
      id: 'mig-002',
      name: 'Oracle → PostgreSQL Migration',
      status: 'running',
      progress: 68,
      duration: '1h 23m',
      recordsTransferred: 850000,
      startTime: '2024-01-15 16:15:00',
    },
    {
      id: 'mig-003',
      name: 'MySQL → SQLite Migration',
      status: 'failed',
      progress: 35,
      duration: '45m',
      recordsTransferred: 125000,
      startTime: '2024-01-15 12:00:00',
    },
  ];

  const systemStats = {
    cpu: 45,
    memory: 67,
    disk: 82,
    network: 23,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Migration Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your database migrations and system performance
          </p>
        </div>
        <Link to="/migration-wizard">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Migration
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="migration-card glow-effect">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Migrations</p>
                <p className="text-3xl font-bold text-foreground">247</p>
                <p className="text-xs text-success mt-1">↗ +12 this week</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="migration-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-success">94.2%</p>
                <p className="text-xs text-success mt-1">↗ +2.1% this month</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="migration-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                <p className="text-3xl font-bold text-foreground">2h 15m</p>
                <p className="text-xs text-warning mt-1">↘ -15m this week</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="migration-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Transferred</p>
                <p className="text-3xl font-bold text-foreground">1.2TB</p>
                <p className="text-xs text-primary mt-1">↗ +340GB this week</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Migrations */}
        <Card className="lg:col-span-2 migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Recent Migrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMigrations.map((migration) => (
                <div
                  key={migration.id}
                  className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{migration.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Started: {migration.startTime}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {migration.status === 'completed' && (
                        <span className="status-success">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      )}
                      {migration.status === 'running' && (
                        <span className="status-running">
                          <Clock className="w-4 h-4" />
                        </span>
                      )}
                      {migration.status === 'failed' && (
                        <span className="status-error">
                          <AlertCircle className="w-4 h-4" />
                        </span>
                      )}
                      <span className="text-sm font-medium capitalize text-foreground">
                        {migration.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{migration.progress}%</span>
                    </div>
                    <Progress value={migration.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Duration: {migration.duration}</span>
                      <span>Records: {migration.recordsTransferred.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/migration-history">
              <Button variant="outline" className="w-full mt-4">
                View All Migrations
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* System Stats */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-primary" />
              <span>System Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span className="text-sm text-foreground">{systemStats.cpu}%</span>
              </div>
              <Progress value={systemStats.cpu} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <span className="text-sm text-foreground">{systemStats.memory}%</span>
              </div>
              <Progress value={systemStats.memory} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Disk Usage</span>
                </div>
                <span className="text-sm text-foreground">{systemStats.disk}%</span>
              </div>
              <Progress value={systemStats.disk} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Network I/O</span>
                </div>
                <span className="text-sm text-foreground">{systemStats.network}%</span>
              </div>
              <Progress value={systemStats.network} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
