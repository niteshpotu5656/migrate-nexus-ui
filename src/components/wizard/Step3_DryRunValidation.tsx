
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWizard } from '@/context/WizardContext';
import { DryRunResult } from '@/context/WizardContext';
import { PlayCircle, AlertTriangle, CheckCircle, Clock, Database, Info, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step3_DryRunValidation() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationPhase, setValidationPhase] = useState('');

  const mockDryRunResult: DryRunResult = {
    issues: [
      {
        severity: 'error',
        table: 'users',
        message: 'Column "created_at" has incompatible data type TIMESTAMP vs DATETIME',
        suggestion: 'Convert TIMESTAMP to DATETIME format during migration'
      },
      {
        severity: 'error',
        table: 'orders',
        message: 'Primary key constraint name conflicts with target database reserved words',
        suggestion: 'Rename constraint from "order" to "order_pk"'
      },
      {
        severity: 'warning',
        table: 'orders',
        message: 'Large table (45K+ rows) may take significant time to migrate',
        suggestion: 'Consider migrating in smaller batches of 10,000 rows'
      },
      {
        severity: 'warning',
        table: 'products',
        message: 'Index "idx_product_name" uses unsupported collation in target database',
        suggestion: 'Will be recreated with compatible collation during migration'
      },
      {
        severity: 'warning',
        table: 'audit_logs',
        message: 'Very large table (456K+ rows) detected',
        suggestion: 'Consider excluding historical data older than 1 year'
      },
      {
        severity: 'info',
        table: 'categories',
        message: 'Table structure is fully compatible',
      },
      {
        severity: 'info',
        table: 'suppliers',
        message: 'Small table will migrate quickly',
      },
      {
        severity: 'info',
        table: 'inventory',
        message: 'All data types are compatible',
      },
    ],
    estimatedTime: 165, // minutes
    estimatedRows: 125000,
  };

  const runDryRun = async () => {
    if (!state.schemaSelection) {
      toast({
        title: 'Schema not selected',
        description: 'Please select schema objects first.',
        variant: 'destructive',
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);

    const phases = [
      'Analyzing source schema...',
      'Checking target compatibility...',
      'Validating data types...',
      'Examining constraints...',
      'Testing foreign keys...',
      'Calculating estimates...',
      'Generating report...'
    ];

    let phaseIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        
        // Update phase based on progress
        const currentPhaseIndex = Math.floor((newProgress / 100) * phases.length);
        if (currentPhaseIndex !== phaseIndex && currentPhaseIndex < phases.length) {
          phaseIndex = currentPhaseIndex;
          setValidationPhase(phases[phaseIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setValidationPhase('');
          
          // Save results to context and mock Supabase
          dispatch({ type: 'SET_DRY_RUN_RESULT', payload: mockDryRunResult });
          console.log('Saving dry run results to Supabase dry_run_reports table:', mockDryRunResult);
          
          const errorCount = mockDryRunResult.issues.filter(i => i.severity === 'error').length;
          const warningCount = mockDryRunResult.issues.filter(i => i.severity === 'warning').length;
          
          toast({
            title: 'Dry run completed',
            description: `Found ${errorCount} error(s) and ${warningCount} warning(s). Review issues before proceeding.`,
            variant: errorCount > 0 ? 'destructive' : 'default',
          });
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const getSeverityColor = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
    }
  };

  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const groupedIssues = state.dryRunResult?.issues.reduce((acc, issue) => {
    if (!acc[issue.table]) {
      acc[issue.table] = [];
    }
    acc[issue.table].push(issue);
    return acc;
  }, {} as Record<string, typeof state.dryRunResult.issues>) || {};

  const issueStats = state.dryRunResult?.issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Dry Run & Validation</h3>
        <p className="text-sm text-muted-foreground">
          Validate your migration configuration without making any changes
        </p>
      </div>

      {/* Dry Run Controls */}
      <Card className="migration-card">
        <CardContent className="p-6">
          {!isRunning && !state.dryRunResult && (
            <div className="text-center space-y-4">
              <Database className="w-16 h-16 text-primary mx-auto" />
              <div>
                <h4 className="text-lg font-medium text-foreground">Ready to validate</h4>
                <p className="text-sm text-muted-foreground">
                  Run a dry run to check for potential issues before migration
                </p>
              </div>
              <Button onClick={runDryRun} className="bg-primary hover:bg-primary/90">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Dry Run
              </Button>
            </div>
          )}

          {isRunning && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-medium text-foreground">Running Validation...</h4>
                <p className="text-sm text-muted-foreground">
                  {validationPhase || 'Analyzing schema compatibility and potential issues'}
                </p>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {progress.toFixed(0)}% complete
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {state.dryRunResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="migration-card">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="text-xl font-bold text-foreground">
                  {formatTime(state.dryRunResult.estimatedTime)}
                </p>
              </CardContent>
            </Card>

            <Card className="migration-card">
              <CardContent className="p-4 text-center">
                <Database className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Estimated Rows</p>
                <p className="text-xl font-bold text-foreground">
                  {state.dryRunResult.estimatedRows.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="migration-card">
              <CardContent className="p-4 text-center">
                <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-xl font-bold text-foreground">
                  {issueStats.error || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="migration-card">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-xl font-bold text-foreground">
                  {issueStats.warning || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <Card className="migration-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span>Validation Issues</span>
                <Badge variant="outline">
                  {state.dryRunResult.issues.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({state.dryRunResult.issues.length})</TabsTrigger>
                  <TabsTrigger value="error">Errors ({issueStats.error || 0})</TabsTrigger>
                  <TabsTrigger value="warning">Warnings ({issueStats.warning || 0})</TabsTrigger>
                  <TabsTrigger value="info">Info ({issueStats.info || 0})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {Object.entries(groupedIssues).map(([table, issues]) => (
                    <div key={table} className="border border-border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-foreground flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>{table}</span>
                        <Badge variant="outline">{issues.length} issue(s)</Badge>
                      </h4>
                      <div className="space-y-2">
                        {issues.map((issue, index) => (
                          <div key={index} className="p-3 bg-surface rounded border border-border/50">
                            <div className="flex items-start space-x-2">
                              {getSeverityIcon(issue.severity)}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                                    {issue.severity.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-1">{issue.message}</p>
                                {issue.suggestion && (
                                  <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span>{issue.suggestion}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {['error', 'warning', 'info'].map(severity => (
                  <TabsContent key={severity} value={severity} className="space-y-4 mt-4">
                    {state.dryRunResult!.issues
                      .filter(issue => issue.severity === severity)
                      .map((issue, index) => (
                        <div key={index} className="p-4 bg-surface rounded-lg border border-border space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getSeverityIcon(issue.severity)}
                              <Badge variant={getSeverityColor(issue.severity)}>
                                {issue.severity.toUpperCase()}
                              </Badge>
                              <span className="font-medium text-foreground">{issue.table}</span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">{issue.message}</p>
                          {issue.suggestion && (
                            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                              <Info className="w-3 h-3 mt-0.5" />
                              <span>{issue.suggestion}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button onClick={runDryRun} variant="outline">
              <PlayCircle className="w-4 h-4 mr-2" />
              Run Again
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              disabled={issueStats.error > 0}
            >
              {issueStats.error > 0 ? 'Fix Errors First' : 'Continue Migration'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
