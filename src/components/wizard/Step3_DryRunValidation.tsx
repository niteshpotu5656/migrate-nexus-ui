
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWizard } from '@/context/WizardContext';
import { DryRunResult } from '@/context/WizardContext';
import { PlayCircle, AlertTriangle, CheckCircle, Clock, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step3_DryRunValidation() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const mockDryRunResult: DryRunResult = {
    issues: [
      {
        severity: 'error',
        table: 'users',
        message: 'Column "created_at" has incompatible data type',
        suggestion: 'Convert TIMESTAMP to DATETIME format'
      },
      {
        severity: 'warning',
        table: 'orders',
        message: 'Large table may take significant time to migrate',
        suggestion: 'Consider migrating in smaller batches'
      },
      {
        severity: 'warning',
        table: 'products',
        message: 'Index "idx_product_name" not supported in target database',
        suggestion: 'Will be recreated with compatible syntax'
      },
      {
        severity: 'info',
        table: 'categories',
        message: 'Table migration looks good',
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

    // Simulate dry run progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          dispatch({ type: 'SET_DRY_RUN_RESULT', payload: mockDryRunResult });
          toast({
            title: 'Dry run completed',
            description: 'Validation completed with some issues found.',
          });
          return 100;
        }
        return prev + 10;
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
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

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
                  Analyzing schema compatibility and potential issues
                </p>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {progress}% complete
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {state.dryRunResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Issues Found</p>
                <p className="text-xl font-bold text-foreground">
                  {state.dryRunResult.issues.length}
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.dryRunResult.issues.map((issue, index) => (
                <div
                  key={index}
                  className="p-4 bg-surface rounded-lg border border-border space-y-2"
                >
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
                    <p className="text-sm text-muted-foreground">
                      💡 Suggestion: {issue.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button onClick={runDryRun} variant="outline">
              <PlayCircle className="w-4 h-4 mr-2" />
              Run Again
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Continue Migration
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
