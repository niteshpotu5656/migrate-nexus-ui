
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWizard } from '@/context/WizardContext';
import { 
  Database, 
  PlayCircle, 
  PauseCircle, 
  Square, 
  Download,
  CheckCircle,
  AlertCircle,
  Clock 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step6_MigrationConsole() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [currentTable, setCurrentTable] = useState('');
  const [stats, setStats] = useState({
    tablesCompleted: 0,
    rowsTransferred: 0,
    startTime: new Date(),
    eta: 0,
  });

  useEffect(() => {
    if (state.isRunning) {
      simulateMigration();
    }
  }, [state.isRunning]);

  const simulateMigration = () => {
    const tables = state.schemaSelection?.selectedTables || [];
    let currentTableIndex = 0;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        
        // Update current table
        const tableProgress = (newProgress / 100) * tables.length;
        currentTableIndex = Math.floor(tableProgress);
        if (currentTableIndex < tables.length) {
          setCurrentTable(tables[currentTableIndex]);
        }

        // Add logs
        if (newProgress % 10 < 5) {
          const messages = [
            `Migrating table: ${tables[currentTableIndex] || 'unknown'}`,
            `Copying data batch: ${Math.floor(newProgress * 100)} rows transferred`,
            `Creating indexes for table: ${tables[currentTableIndex] || 'unknown'}`,
            `Applying constraints to table: ${tables[currentTableIndex] || 'unknown'}`,
          ];
          
          dispatch({
            type: 'ADD_LOG',
            payload: {
              level: 'info',
              message: messages[Math.floor(Math.random() * messages.length)]
            }
          });
        }

        // Update stats
        setStats(prev => ({
          ...prev,
          tablesCompleted: currentTableIndex,
          rowsTransferred: Math.floor((newProgress / 100) * 125000),
          eta: Math.floor((100 - newProgress) * 2), // 2 minutes per percent remaining
        }));

        if (newProgress >= 100) {
          clearInterval(interval);
          dispatch({ type: 'STOP_MIGRATION' });
          dispatch({
            type: 'ADD_LOG',
            payload: {
              level: 'success',
              message: 'Migration completed successfully!'
            }
          });
          toast({
            title: 'Migration completed',
            description: 'Database migration finished successfully.',
          });
          return 100;
        }
        
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopMigration = () => {
    dispatch({ type: 'STOP_MIGRATION' });
    dispatch({
      type: 'ADD_LOG',
      payload: {
        level: 'warn',
        message: 'Migration stopped by user'
      }
    });
    toast({
      title: 'Migration stopped',
      description: 'Migration has been stopped.',
      variant: 'destructive',
    });
  };

  const downloadLogs = () => {
    const logContent = state.logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-logs-${state.migrationId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-error" />;
      case 'warn': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-primary" />;
    }
  };

  const formatDuration = (startTime: Date) => {
    const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Migration Console</h3>
          <p className="text-sm text-muted-foreground">
            Monitor the migration progress and logs in real-time
          </p>
        </div>
        <div className="flex space-x-2">
          {state.isRunning ? (
            <Button onClick={stopMigration} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop Migration
            </Button>
          ) : (
            <Button onClick={downloadLogs} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Logs
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="migration-card">
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{Math.round(progress)}%</p>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </CardContent>
        </Card>

        <Card className="migration-card">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {stats.tablesCompleted}/{state.schemaSelection?.selectedTables.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">Tables Completed</p>
          </CardContent>
        </Card>

        <Card className="migration-card">
          <CardContent className="p-4 text-center">
            <PlayCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {stats.rowsTransferred.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Rows Transferred</p>
          </CardContent>
        </Card>

        <Card className="migration-card">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {state.isRunning ? formatDuration(stats.startTime) : 'Completed'}
            </p>
            <p className="text-sm text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="migration-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-foreground">Migration Progress</h4>
                {currentTable && (
                  <p className="text-sm text-muted-foreground">
                    Currently processing: <span className="font-mono text-primary">{currentTable}</span>
                  </p>
                )}
              </div>
              <Badge variant={state.isRunning ? 'default' : progress === 100 ? 'default' : 'secondary'}>
                {state.isRunning ? 'Running' : progress === 100 ? 'Completed' : 'Stopped'}
              </Badge>
            </div>
            <Progress value={progress} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
              {state.isRunning && stats.eta > 0 && (
                <span>ETA: {Math.floor(stats.eta / 60)}m {stats.eta % 60}s</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Migration Logs</span>
            </div>
            <Badge variant="outline">
              {state.logs.length} entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="console-output">
            {state.logs.length === 0 ? (
              <p className="text-muted-foreground">No logs yet...</p>
            ) : (
              <div className="space-y-1">
                {state.logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    {getLogIcon(log.level)}
                    <span className="text-muted-foreground text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`flex-1 ${
                      log.level === 'error' ? 'text-error' :
                      log.level === 'warn' ? 'text-warning' :
                      log.level === 'success' ? 'text-success' :
                      'text-foreground'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Actions */}
      {progress === 100 && !state.isRunning && (
        <Card className="migration-card glow-effect">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <div>
                <h4 className="text-lg font-medium text-foreground">Migration Completed Successfully!</h4>
                <p className="text-sm text-muted-foreground">
                  Your database has been migrated successfully. You can now download the logs or start a new migration.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={downloadLogs} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Logs
                </Button>
                <Button onClick={() => dispatch({ type: 'RESET_WIZARD' })} className="bg-primary hover:bg-primary/90">
                  New Migration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
