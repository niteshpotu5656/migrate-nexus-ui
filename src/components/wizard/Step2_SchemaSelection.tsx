
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useWizard } from '@/context/WizardContext';
import { SchemaSelection } from '@/context/WizardContext';
import { Table, Eye, Code, Database, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const mockTables = [
  { name: 'users', rows: 15420, size: '2.3 MB', lastModified: '2024-01-15' },
  { name: 'orders', rows: 45231, size: '12.1 MB', lastModified: '2024-01-20' },
  { name: 'products', rows: 3421, size: '1.8 MB', lastModified: '2024-01-18' },
  { name: 'categories', rows: 156, size: '45 KB', lastModified: '2024-01-10' },
  { name: 'payments', rows: 23412, size: '5.7 MB', lastModified: '2024-01-22' },
  { name: 'reviews', rows: 8934, size: '3.2 MB', lastModified: '2024-01-19' },
  { name: 'inventory', rows: 12543, size: '4.1 MB', lastModified: '2024-01-21' },
  { name: 'customers', rows: 18765, size: '6.8 MB', lastModified: '2024-01-17' },
  { name: 'suppliers', rows: 234, size: '120 KB', lastModified: '2024-01-12' },
  { name: 'audit_logs', rows: 456789, size: '234 MB', lastModified: '2024-01-23' },
];

const mockViews = [
  { name: 'user_orders_summary', dependencies: ['users', 'orders'], lastModified: '2024-01-16' },
  { name: 'product_analytics', dependencies: ['products', 'reviews'], lastModified: '2024-01-18' },
  { name: 'monthly_sales', dependencies: ['orders', 'payments'], lastModified: '2024-01-20' },
  { name: 'customer_insights', dependencies: ['customers', 'orders'], lastModified: '2024-01-19' },
];

const mockFunctions = [
  { name: 'calculate_tax', returns: 'DECIMAL', params: 2, lastModified: '2024-01-10' },
  { name: 'generate_order_id', returns: 'VARCHAR', params: 0, lastModified: '2024-01-08' },
  { name: 'update_inventory', returns: 'VOID', params: 3, lastModified: '2024-01-15' },
  { name: 'validate_email', returns: 'BOOLEAN', params: 1, lastModified: '2024-01-12' },
];

export function Step2_SchemaSelection() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    // Simulate schema loading from Supabase
    console.log('Loading schema from Supabase schemas table for:', state.databaseConfig.source);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Schema loaded',
        description: `Successfully loaded ${mockTables.length} tables, ${mockViews.length} views, and ${mockFunctions.length} functions.`,
      });
    }, 2000);
  };

  useEffect(() => {
    if (state.databaseConfig && !state.schemaSelection) {
      loadSchema();
    }
  }, [state.databaseConfig]);

  const filteredTables = mockTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredViews = mockViews.filter(view => 
    view.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFunctions = mockFunctions.filter(func => 
    func.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const allFilteredTables = filteredTables.map(t => t.name);
    setSelection(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.length === allFilteredTables.length 
        ? [] 
        : allFilteredTables
    }));
  };

  const selectBySize = (sizeCategory: 'small' | 'medium' | 'large') => {
    let tablesToSelect: string[] = [];
    
    switch (sizeCategory) {
      case 'small':
        tablesToSelect = mockTables.filter(t => t.rows < 1000).map(t => t.name);
        break;
      case 'medium':
        tablesToSelect = mockTables.filter(t => t.rows >= 1000 && t.rows < 50000).map(t => t.name);
        break;
      case 'large':
        tablesToSelect = mockTables.filter(t => t.rows >= 50000).map(t => t.name);
        break;
    }
    
    setSelection(prev => ({
      ...prev,
      selectedTables: [...new Set([...prev.selectedTables, ...tablesToSelect])]
    }));
  };

  const saveSelection = () => {
    if (selection.selectedTables.length === 0) {
      toast({
        title: 'No tables selected',
        description: 'Please select at least one table to proceed.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({ type: 'SET_SCHEMA_SELECTION', payload: selection });
    
    // Mock save to Supabase
    console.log('Saving schema selection to Supabase:', selection);
    
    toast({
      title: 'Selection saved',
      description: `Saved selection of ${selection.selectedTables.length} tables, ${selection.selectedViews.length} views, and ${selection.selectedFunctions.length} functions.`,
    });
  };

  const totalRows = filteredTables
    .filter(table => selection.selectedTables.includes(table.name))
    .reduce((sum, table) => sum + table.rows, 0);

  const estimatedSize = filteredTables
    .filter(table => selection.selectedTables.includes(table.name))
    .reduce((sum, table) => {
      const sizeInMB = parseFloat(table.size.replace(/[^\d.]/g, ''));
      return sum + (table.size.includes('KB') ? sizeInMB / 1024 : sizeInMB);
    }, 0);

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

      {/* Search and Quick Actions */}
      <Card className="migration-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tables, views, functions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => selectBySize('small')}>
                Small Tables
              </Button>
              <Button variant="outline" size="sm" onClick={() => selectBySize('medium')}>
                Medium Tables
              </Button>
              <Button variant="outline" size="sm" onClick={() => selectBySize('large')}>
                Large Tables
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <span>Tables ({filteredTables.length})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={selectAllTables}>
                {selection.selectedTables.length === filteredTables.length ? 'Deselect All' : 'Select All'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {filteredTables.map((table) => (
              <div key={table.name} className="flex items-center space-x-3 p-3 rounded hover:bg-surface-hover border border-border/50">
                <Checkbox
                  id={`table-${table.name}`}
                  checked={selection.selectedTables.includes(table.name)}
                  onCheckedChange={() => toggleTable(table.name)}
                />
                <div className="flex-1">
                  <Label htmlFor={`table-${table.name}`} className="font-medium cursor-pointer">
                    {table.name}
                  </Label>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{table.rows.toLocaleString()} rows</span>
                    <span>•</span>
                    <span>{table.size}</span>
                    <Badge variant="outline" className="text-xs">
                      {table.rows < 1000 ? 'Small' : table.rows < 50000 ? 'Medium' : 'Large'}
                    </Badge>
                  </div>
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
              <span>Views ({filteredViews.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {filteredViews.map((view) => (
              <div key={view.name} className="flex items-center space-x-3 p-3 rounded hover:bg-surface-hover border border-border/50">
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
              <span>Functions ({filteredFunctions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {filteredFunctions.map((func) => (
              <div key={func.name} className="flex items-center space-x-3 p-3 rounded hover:bg-surface-hover border border-border/50">
                <Checkbox
                  id={`function-${func.name}`}
                  checked={selection.selectedFunctions.includes(func.name)}
                  onCheckedChange={() => toggleFunction(func.name)}
                />
                <div className="flex-1">
                  <Label htmlFor={`function-${func.name}`} className="font-medium cursor-pointer">
                    {func.name}
                  </Label>
                  <div className="text-xs text-muted-foreground">
                    <span>Returns: {func.returns}</span>
                    <span className="mx-2">•</span>
                    <span>{func.params} param(s)</span>
                  </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Selected Objects</p>
                <p className="text-lg font-semibold text-foreground">
                  {selection.selectedTables.length + selection.selectedViews.length + selection.selectedFunctions.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Total Rows</p>
                <p className="text-lg font-semibold text-foreground">{totalRows.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Estimated Size</p>
                <p className="text-lg font-semibold text-foreground">{estimatedSize.toFixed(1)} MB</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Est. Duration</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.ceil(totalRows / 10000)} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={saveSelection} 
          className="bg-primary hover:bg-primary/90"
          disabled={selection.selectedTables.length === 0}
        >
          Save Selection & Continue
        </Button>
      </div>
    </div>
  );
}
