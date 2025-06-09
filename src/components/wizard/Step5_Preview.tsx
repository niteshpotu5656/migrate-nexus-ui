
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWizard } from '@/context/WizardContext';
import { 
  Database, 
  Table, 
  Eye, 
  Code, 
  Settings, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  PlayCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step5_Preview() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();

  const startMigration = () => {
    const migrationId = `migration-${Date.now()}`;
    dispatch({ type: 'START_MIGRATION', payload: migrationId });
    dispatch({ type: 'SET_STEP', payload: 6 });
    toast({
      title: 'Migration started',
      description: 'Your database migration has been initiated.',
    });
  };

  const dryRunIssues = state.dryRunResult?.issues || [];
  const errorCount = dryRunIssues.filter(issue => issue.severity === 'error').length;
  const warningCount = dryRunIssues.filter(issue => issue.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Migration Preview</h3>
        <p className="text-sm text-muted-foreground">
          Review your configuration before starting the migration
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Database */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Source Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline">
                {state.databaseConfig?.source.type?.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Host:</span>
              <span className="text-foreground font-mono">
                {state.databaseConfig?.source.host}:{state.databaseConfig?.source.port}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database:</span>
              <span className="text-foreground font-mono">
                {state.databaseConfig?.source.database}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SSL:</span>
              <Badge variant={state.databaseConfig?.source.ssl ? 'default' : 'secondary'}>
                {state.databaseConfig?.source.ssl ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Target Database */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-success" />
              <span>Target Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline">
                {state.databaseConfig?.target.type?.toUpperCase()}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Host:</span>
              <span className="text-foreground font-mono">
                {state.databaseConfig?.target.host}:{state.databaseConfig?.target.port}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database:</span>
              <span className="text-foreground font-mono">
                {state.databaseConfig?.target.database}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SSL:</span>
              <Badge variant={state.databaseConfig?.target.ssl ? 'default' : 'secondary'}>
                {state.databaseConfig?.target.ssl ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schema Selection Summary */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Table className="w-5 h-5 text-primary" />
            <span>Schema Objects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-surface rounded-lg">
              <Table className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {state.schemaSelection?.selectedTables.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Tables</p>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {state.schemaSelection?.selectedViews.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Views</p>
            </div>
            <div className="text-center p-4 bg-surface rounded-lg">
              <Code className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {state.schemaSelection?.selectedFunctions.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Functions</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-4 h-4 ${state.schemaSelection?.includeData ? 'text-success' : 'text-muted-foreground'}`} />
              <span className={state.schemaSelection?.includeData ? 'text-foreground' : 'text-muted-foreground'}>
                Include Data
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-4 h-4 ${state.schemaSelection?.includeIndexes ? 'text-success' : 'text-muted-foreground'}`} />
              <span className={state.schemaSelection?.includeIndexes ? 'text-foreground' : 'text-muted-foreground'}>
                Include Indexes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className={`w-4 h-4 ${state.schemaSelection?.includeConstraints ? 'text-success' : 'text-muted-foreground'}`} />
              <span className={state.schemaSelection?.includeConstraints ? 'text-foreground' : 'text-muted-foreground'}>
                Include Constraints
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {state.dryRunResult && (
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>Validation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-surface rounded-lg">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">
                  {Math.floor(state.dryRunResult.estimatedTime / 60)}h {state.dryRunResult.estimatedTime % 60}m
                </p>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <Database className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">
                  {state.dryRunResult.estimatedRows.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Rows</p>
              </div>
              <div className="text-center p-4 bg-surface rounded-lg">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">
                  {dryRunIssues.length}
                </p>
                <p className="text-sm text-muted-foreground">Issues Found</p>
              </div>
            </div>

            {(errorCount > 0 || warningCount > 0) && (
              <div className="flex items-center justify-center space-x-4 text-sm">
                {errorCount > 0 && (
                  <div className="flex items-center space-x-1 text-error">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{errorCount} error(s)</span>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="flex items-center space-x-1 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{warningCount} warning(s)</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Rules */}
      {state.manualRules.length > 0 && (
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Manual Rules ({state.manualRules.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {state.manualRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div>
                    <span className="font-medium text-foreground">
                      {rule.sourceTable} → {rule.targetTable}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {rule.transformations.length} transformation(s)
                    </p>
                  </div>
                  <Badge variant="outline">
                    {rule.transformations.length} rules
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Migration */}
      <Card className="migration-card glow-effect">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {errorCount > 0 ? (
              <>
                <AlertTriangle className="w-16 h-16 text-error mx-auto" />
                <div>
                  <h4 className="text-lg font-medium text-foreground">Cannot proceed</h4>
                  <p className="text-sm text-muted-foreground">
                    Please resolve {errorCount} critical error(s) before starting migration
                  </p>
                </div>
                <Button disabled variant="outline">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Migration
                </Button>
              </>
            ) : (
              <>
                <CheckCircle className="w-16 h-16 text-success mx-auto" />
                <div>
                  <h4 className="text-lg font-medium text-foreground">Ready to migrate</h4>
                  <p className="text-sm text-muted-foreground">
                    All validations passed. Click below to start the migration process.
                  </p>
                  {warningCount > 0 && (
                    <p className="text-sm text-warning mt-1">
                      ⚠️ {warningCount} warning(s) will be handled automatically
                    </p>
                  )}
                </div>
                <Button onClick={startMigration} className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Start Migration
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
