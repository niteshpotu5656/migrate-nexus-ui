
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWizard } from '@/context/WizardContext';
import { ManualRule } from '@/context/WizardContext';
import { Plus, Edit, Trash2, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step4_ManualOptions() {
  const { state, dispatch } = useWizard();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ManualRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<ManualRule>>({
    sourceTable: '',
    targetTable: '',
    columnMappings: {},
    transformations: [],
  });

  const addTransformation = () => {
    setNewRule(prev => ({
      ...prev,
      transformations: [
        ...(prev.transformations || []),
        { column: '', operation: 'rename', value: '' }
      ]
    }));
  };

  const updateTransformation = (index: number, field: string, value: string) => {
    setNewRule(prev => ({
      ...prev,
      transformations: prev.transformations?.map((t, i) => 
        i === index ? { ...t, [field]: value } : t
      ) || []
    }));
  };

  const removeTransformation = (index: number) => {
    setNewRule(prev => ({
      ...prev,
      transformations: prev.transformations?.filter((_, i) => i !== index) || []
    }));
  };

  const saveRule = () => {
    if (!newRule.sourceTable || !newRule.targetTable) {
      toast({
        title: 'Invalid rule',
        description: 'Please specify both source and target tables.',
        variant: 'destructive',
      });
      return;
    }

    const rule: ManualRule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      sourceTable: newRule.sourceTable!,
      targetTable: newRule.targetTable!,
      columnMappings: newRule.columnMappings || {},
      transformations: newRule.transformations || [],
    };

    if (editingRule) {
      dispatch({ type: 'UPDATE_MANUAL_RULE', payload: { id: rule.id, rule } });
    } else {
      dispatch({ type: 'ADD_MANUAL_RULE', payload: rule });
    }

    setNewRule({ sourceTable: '', targetTable: '', columnMappings: {}, transformations: [] });
    setEditingRule(null);
    setIsDialogOpen(false);
    
    toast({
      title: 'Rule saved',
      description: 'Manual transformation rule has been saved.',
    });
  };

  const editRule = (rule: ManualRule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setIsDialogOpen(true);
  };

  const deleteRule = (ruleId: string) => {
    dispatch({ type: 'REMOVE_MANUAL_RULE', payload: ruleId });
    toast({
      title: 'Rule deleted',
      description: 'Manual transformation rule has been deleted.',
    });
  };

  const selectedTables = state.schemaSelection?.selectedTables || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Manual Rules & Options</h3>
          <p className="text-sm text-muted-foreground">
            Configure custom transformation rules for complex migrations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingRule(null);
                setNewRule({ sourceTable: '', targetTable: '', columnMappings: {}, transformations: [] });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Edit Transformation Rule' : 'Add Transformation Rule'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source-table">Source Table</Label>
                  <Select
                    value={newRule.sourceTable}
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, sourceTable: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source table" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target-table">Target Table</Label>
                  <Input
                    id="target-table"
                    value={newRule.targetTable}
                    onChange={(e) => setNewRule(prev => ({ ...prev, targetTable: e.target.value }))}
                    placeholder="Enter target table name"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Column Transformations</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTransformation}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {newRule.transformations?.map((transformation, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <Input
                          placeholder="Column name"
                          value={transformation.column}
                          onChange={(e) => updateTransformation(index, 'column', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Select
                          value={transformation.operation}
                          onValueChange={(value) => updateTransformation(index, 'operation', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rename">Rename</SelectItem>
                            <SelectItem value="convert">Convert Type</SelectItem>
                            <SelectItem value="default">Set Default</SelectItem>
                            <SelectItem value="ignore">Ignore</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-5">
                        <Input
                          placeholder="Value"
                          value={transformation.value || ''}
                          onChange={(e) => updateTransformation(index, 'value', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTransformation(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveRule}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Transformation Rules ({state.manualRules.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.manualRules.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No custom rules defined</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add transformation rules to handle complex data mappings
              </p>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.manualRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 bg-surface rounded-lg border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {rule.sourceTable} → {rule.targetTable}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {rule.transformations.length} transformation(s)
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => editRule(rule)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {rule.transformations.length > 0 && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Transformations:</Label>
                      {rule.transformations.map((transform, index) => (
                        <div key={index} className="text-xs bg-background/50 p-2 rounded">
                          <span className="font-mono">{transform.column}</span>
                          <span className="text-muted-foreground mx-2">→</span>
                          <span className="text-primary">{transform.operation}</span>
                          {transform.value && (
                            <>
                              <span className="text-muted-foreground mx-2">:</span>
                              <span className="font-mono">{transform.value}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migration Options */}
      <Card className="migration-card">
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch-size">Batch Size</Label>
              <Input
                id="batch-size"
                type="number"
                defaultValue="1000"
                placeholder="Number of rows per batch"
              />
            </div>
            <div>
              <Label htmlFor="parallel-workers">Parallel Workers</Label>
              <Input
                id="parallel-workers"
                type="number"
                defaultValue="4"
                placeholder="Number of parallel workers"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="custom-sql">Custom Pre-Migration SQL</Label>
            <Textarea
              id="custom-sql"
              placeholder="Enter any custom SQL to run before migration..."
              className="h-24"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
