
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useWizard } from '@/context/WizardContext';
import { DatabaseConfig } from '@/context/WizardContext';
import { Database, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const databaseTypes = [
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'mssql', label: 'Microsoft SQL Server' },
];

export function Step1_DBConfig() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [sourceConfig, setSourceConfig] = useState(
    state.databaseConfig?.source || {
      type: 'postgresql',
      host: '',
      port: 5432,
      database: '',
      username: '',
      password: '',
      ssl: false,
    }
  );
  const [targetConfig, setTargetConfig] = useState(
    state.databaseConfig?.target || {
      type: 'mysql',
      host: '',
      port: 3306,
      database: '',
      username: '',
      password: '',
      ssl: false,
    }
  );
  const [testResults, setTestResults] = useState<{
    source: 'testing' | 'success' | 'failed' | null;
    target: 'testing' | 'success' | 'failed' | null;
  }>({ source: null, target: null });

  const testConnection = async (type: 'source' | 'target') => {
    setTestResults(prev => ({ ...prev, [type]: 'testing' }));
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResults(prev => ({ ...prev, [type]: success ? 'success' : 'failed' }));
      
      toast({
        title: success ? 'Connection successful' : 'Connection failed',
        description: success 
          ? `Successfully connected to ${type} database` 
          : `Failed to connect to ${type} database. Please check your credentials.`,
        variant: success ? 'default' : 'destructive',
      });
    }, 2000);
  };

  const saveConfiguration = () => {
    const config: DatabaseConfig = {
      source: sourceConfig,
      target: targetConfig,
    };
    dispatch({ type: 'SET_DATABASE_CONFIG', payload: config });
    toast({
      title: 'Configuration saved',
      description: 'Database configuration has been saved successfully.',
    });
  };

  const getDefaultPort = (dbType: string) => {
    const ports: Record<string, number> = {
      postgresql: 5432,
      mysql: 3306,
      sqlite: 0,
      oracle: 1521,
      mssql: 1433,
    };
    return ports[dbType] || 5432;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Database */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Source Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="source-type">Database Type</Label>
              <Select
                value={sourceConfig.type}
                onValueChange={(value: any) => {
                  setSourceConfig({
                    ...sourceConfig,
                    type: value,
                    port: getDefaultPort(value),
                  });
                  setTestResults(prev => ({ ...prev, source: null }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  {databaseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sourceConfig.type !== 'sqlite' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-host">Host</Label>
                    <Input
                      id="source-host"
                      value={sourceConfig.host}
                      onChange={(e) => setSourceConfig({ ...sourceConfig, host: e.target.value })}
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="source-port">Port</Label>
                    <Input
                      id="source-port"
                      type="number"
                      value={sourceConfig.port}
                      onChange={(e) => setSourceConfig({ ...sourceConfig, port: parseInt(e.target.value) || 5432 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="source-database">Database Name</Label>
                  <Input
                    id="source-database"
                    value={sourceConfig.database}
                    onChange={(e) => setSourceConfig({ ...sourceConfig, database: e.target.value })}
                    placeholder="myapp_prod"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="source-username">Username</Label>
                    <Input
                      id="source-username"
                      value={sourceConfig.username}
                      onChange={(e) => setSourceConfig({ ...sourceConfig, username: e.target.value })}
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="source-password">Password</Label>
                    <Input
                      id="source-password"
                      type="password"
                      value={sourceConfig.password}
                      onChange={(e) => setSourceConfig({ ...sourceConfig, password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="source-ssl"
                    checked={sourceConfig.ssl}
                    onCheckedChange={(checked) => setSourceConfig({ ...sourceConfig, ssl: checked })}
                  />
                  <Label htmlFor="source-ssl">Enable SSL</Label>
                </div>
              </>
            )}

            <Button
              onClick={() => testConnection('source')}
              disabled={testResults.source === 'testing'}
              className="w-full"
              variant="outline"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testResults.source === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>

            {testResults.source && (
              <div className={`flex items-center space-x-2 text-sm ${
                testResults.source === 'success' ? 'text-success' : 'text-error'
              }`}>
                {testResults.source === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>
                  {testResults.source === 'success' ? 'Connection successful' : 'Connection failed'}
                </span>
              </div>
            )}
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
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-type">Database Type</Label>
              <Select
                value={targetConfig.type}
                onValueChange={(value: any) => {
                  setTargetConfig({
                    ...targetConfig,
                    type: value,
                    port: getDefaultPort(value),
                  });
                  setTestResults(prev => ({ ...prev, target: null }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  {databaseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {targetConfig.type !== 'sqlite' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-host">Host</Label>
                    <Input
                      id="target-host"
                      value={targetConfig.host}
                      onChange={(e) => setTargetConfig({ ...targetConfig, host: e.target.value })}
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-port">Port</Label>
                    <Input
                      id="target-port"
                      type="number"
                      value={targetConfig.port}
                      onChange={(e) => setTargetConfig({ ...targetConfig, port: parseInt(e.target.value) || 3306 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="target-database">Database Name</Label>
                  <Input
                    id="target-database"
                    value={targetConfig.database}
                    onChange={(e) => setTargetConfig({ ...targetConfig, database: e.target.value })}
                    placeholder="myapp_new"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-username">Username</Label>
                    <Input
                      id="target-username"
                      value={targetConfig.username}
                      onChange={(e) => setTargetConfig({ ...targetConfig, username: e.target.value })}
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-password">Password</Label>
                    <Input
                      id="target-password"
                      type="password"
                      value={targetConfig.password}
                      onChange={(e) => setTargetConfig({ ...targetConfig, password: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="target-ssl"
                    checked={targetConfig.ssl}
                    onCheckedChange={(checked) => setTargetConfig({ ...targetConfig, ssl: checked })}
                  />
                  <Label htmlFor="target-ssl">Enable SSL</Label>
                </div>
              </>
            )}

            <Button
              onClick={() => testConnection('target')}
              disabled={testResults.target === 'testing'}
              className="w-full"
              variant="outline"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testResults.target === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>

            {testResults.target && (
              <div className={`flex items-center space-x-2 text-sm ${
                testResults.target === 'success' ? 'text-success' : 'text-error'
              }`}>
                {testResults.target === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>
                  {testResults.target === 'success' ? 'Connection successful' : 'Connection failed'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={saveConfiguration} className="bg-primary hover:bg-primary/90">
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
