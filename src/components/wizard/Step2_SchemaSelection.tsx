
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/context/WizardContext';
import { SchemaSelection } from '@/context/WizardContext';
import { Table, Eye, Code, Database, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockTables = [
  { name: 'users', rows: 15420, size: '2.3 MB' },
  { name: 'orders', rows: 45231, size: '12.1 MB' },
  { name: 'products', rows: 3421, size: '1.8 MB' },
  { name: 'categories', rows: 156, size: '45 KB' },
  { name: 'payments', rows: 23412, size: '5.7 MB' },
  { name: 'reviews', rows: 8934, size: '3.2 MB' },
  { name: 'inventory', rows: 12543, size: '4.1 MB' },
  { name: 'customers', rows: 18765, size: '6.8 MB' },
];

const mockViews = [
  { name: 'user_orders_summary', dependencies: ['users', 'orders'] },
  { name: 'product_analytics', dependencies: ['products', 'reviews'] },
  { name: 'monthly_sales', dependencies: ['orders', 'payments'] },
];

const mockFunctions = [
  { name: 'calculate_tax', returns: 'DECIMAL' },
  { name: 'generate_order_id', returns: 'VARCHAR' },
  { name: 'update_inventory', returns: 'VOID' },
];

export function Step2_SchemaSelection() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<SchemaSelection>(
    state.schemaSelection || {
      selectedTables: [],
      selectedViews: [],
      selectedFunctions: [],
      includeData: true,
      includeIndexes: true,
      includeConstraints: true,
    }
  );

  const loadSchema = async () => {
    if (!state.databaseConfig) {
      toast({
        title: 'Database not configured',
        description: 'Please configure your database connection first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate loading schema
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Schema loaded',
        description: 'Successfully loaded database schema information.',
      });
    }, 2000);
  };

  useEffect(() => {
    if (state.databaseConfig && !state.schemaSelection) {
      loadSchema();
    }
  }, [state.databaseConfig]);

  const toggleTable = (tableName: string) => {
    setSelection(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(tableName)
        ? prev.selectedTables.filter(t => t !== tableName)
        : [...prev.selectedTables, tableName]
    }));
  };

  const toggleView = (viewName: string) => {
    setSelection(prev => ({
      ...prev,
      selectedViews: prev.selectedViews.includes(viewName)
        ? prev.selectedViews.filter(v => v !== viewName)
        : [...prev.selectedViews, viewName]
    }));
  };

  const toggleFunction = (functionName: string) => {
    setSelection(prev => ({
      ...prev,
      selectedFunctions: prev.selectedFunctions.includes(functionName)
        ? prev.selectedFunctions.filter(f => f !== functionName)
        : [...prev.selectedFunctions, functionName]
    }));
  };

  const selectAllTables = () => {
    setSelection(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.length === mockTables.length ? [] : mockTables.map(t => t.name)
    }));
  };

  const saveSelection = () => {
    dispatch({ type: 'SET_SCHEMA_SELECTION', payload: selection });
    toast({
      title: 'Selection saved',
      description: 'Schema selection has been saved successfully.',
    });
  };

  const totalRows = mockTables
    .filter(table => selection.selectedTables.includes(table.name))
    .reduce((sum, table) => sum + table.rows, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Select Schema Objects</h3>
          <p className="text-sm text-muted-foreground">Choose which database objects to migrate</p>
        </div>
        <Button onClick={loadSchema} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh Schema'}
        </Button>
      </div>

      {/* Migration Options */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Migration Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-data"
                checked={selection.includeData}
                onCheckedChange={(checked) => setSelection(prev => ({ ...prev, includeData: checked }))}
              />
              <Label htmlFor="include-data">Include Data</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-indexes"
                checked={selection.includeIndexes}
                onCheckedChange={(checked) => setSelection(prev => ({ ...prev, includeIndexes: checked }))}
              />
              <Label htmlFor="include-indexes">Include Indexes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-constraints"
                checked={selection.includeConstraints}
                onCheckedChange={(checked) => setSelection(prev => ({ ...prev, includeConstraints: checked }))}
              />
              <Label htmlFor="include-constraints">Include Constraints</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Table className="w-5 h-5 text-primary" />
                <span>Tables ({mockTables.length})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={selectAllTables}>
                {selection.selectedTables.length === mockTables.length ? 'Deselect All' : 'Select All'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {mockTables.map((table) => (
              <div key={table.name} className="flex items-center space-x-3 p-2 rounded hover:bg-surface-hover">
                <Checkbox
                  id={`table-${table.name}`}
                  checked={selection.selectedTables.includes(table.name)}
                  onCheckedChange={() => toggleTable(table.name)}
                />
                <div className="flex-1">
                  <Label htmlFor={`table-${table.name}`} className="font-medium cursor-pointer">
                    {table.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {table.rows.toLocaleString()} rows • {table.size}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Views */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>Views ({mockViews.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {mockViews.map((view) => (
              <div key={view.name} className="flex items-center space-x-3 p-2 rounded hover:bg-surface-hover">
                <Checkbox
                  id={`view-${view.name}`}
                  checked={selection.selectedViews.includes(view.name)}
                  onCheckedChange={() => toggleView(view.name)}
                />
                <div className="flex-1">
                  <Label htmlFor={`view-${view.name}`} className="font-medium cursor-pointer">
                    {view.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Depends on: {view.dependencies.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Functions */}
        <Card className="migration-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-primary" />
              <span>Functions ({mockFunctions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {mockFunctions.map((func) => (
              <div key={func.name} className="flex items-center space-x-3 p-2 rounded hover:bg-surface-hover">
                <Checkbox
                  id={`function-${func.name}`}
                  checked={selection.selectedFunctions.includes(func.name)}
                  onCheckedChange={() => toggleFunction(func.name)}
                />
                <div className="flex-1">
                  <Label htmlFor={`function-${func.name}`} className="font-medium cursor-pointer">
                    {func.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Returns: {func.returns}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {selection.selectedTables.length > 0 && (
        <Card className="migration-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Selected: {selection.selectedTables.length} tables, {selection.selectedViews.length} views, {selection.selectedFunctions.length} functions
              </span>
              <span className="text-foreground font-medium">
                Total rows: {totalRows.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button onClick={saveSelection} className="bg-primary hover:bg-primary/90">
          Save Selection
        </Button>
      </div>
    </div>
  );
}
