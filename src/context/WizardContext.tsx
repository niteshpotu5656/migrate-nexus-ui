
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface DatabaseConfig {
  source: {
    type: 'postgresql' | 'mysql' | 'sqlite' | 'oracle' | 'mssql';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
  };
  target: {
    type: 'postgresql' | 'mysql' | 'sqlite' | 'oracle' | 'mssql';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
  };
}

export interface SchemaSelection {
  selectedTables: string[];
  selectedViews: string[];
  selectedFunctions: string[];
  includeData: boolean;
  includeIndexes: boolean;
  includeConstraints: boolean;
}

export interface DryRunResult {
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    table: string;
    message: string;
    suggestion?: string;
  }>;
  estimatedTime: number;
  estimatedRows: number;
}

export interface ManualRule {
  id: string;
  sourceTable: string;
  targetTable: string;
  columnMappings: Record<string, string>;
  transformations: Array<{
    column: string;
    operation: 'rename' | 'convert' | 'default' | 'ignore';
    value?: string;
  }>;
}

export interface WizardState {
  currentStep: number;
  isCompleted: boolean;
  databaseConfig: DatabaseConfig | null;
  schemaSelection: SchemaSelection | null;
  dryRunResult: DryRunResult | null;
  manualRules: ManualRule[];
  migrationId: string | null;
  isRunning: boolean;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
  }>;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_DATABASE_CONFIG'; payload: DatabaseConfig }
  | { type: 'SET_SCHEMA_SELECTION'; payload: SchemaSelection }
  | { type: 'SET_DRY_RUN_RESULT'; payload: DryRunResult }
  | { type: 'ADD_MANUAL_RULE'; payload: ManualRule }
  | { type: 'UPDATE_MANUAL_RULE'; payload: { id: string; rule: Partial<ManualRule> } }
  | { type: 'REMOVE_MANUAL_RULE'; payload: string }
  | { type: 'START_MIGRATION'; payload: string }
  | { type: 'STOP_MIGRATION' }
  | { type: 'ADD_LOG'; payload: { level: 'info' | 'warn' | 'error' | 'success'; message: string } }
  | { type: 'RESET_WIZARD' };

const initialState: WizardState = {
  currentStep: 1,
  isCompleted: false,
  databaseConfig: null,
  schemaSelection: null,
  dryRunResult: null,
  manualRules: [],
  migrationId: null,
  isRunning: false,
  logs: []
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_DATABASE_CONFIG':
      return { ...state, databaseConfig: action.payload };
    case 'SET_SCHEMA_SELECTION':
      return { ...state, schemaSelection: action.payload };
    case 'SET_DRY_RUN_RESULT':
      return { ...state, dryRunResult: action.payload };
    case 'ADD_MANUAL_RULE':
      return { ...state, manualRules: [...state.manualRules, action.payload] };
    case 'UPDATE_MANUAL_RULE':
      return {
        ...state,
        manualRules: state.manualRules.map(rule =>
          rule.id === action.payload.id ? { ...rule, ...action.payload.rule } : rule
        )
      };
    case 'REMOVE_MANUAL_RULE':
      return {
        ...state,
        manualRules: state.manualRules.filter(rule => rule.id !== action.payload)
      };
    case 'START_MIGRATION':
      return {
        ...state,
        migrationId: action.payload,
        isRunning: true,
        logs: [{ timestamp: new Date().toISOString(), level: 'info', message: 'Migration started' }]
      };
    case 'STOP_MIGRATION':
      return { ...state, isRunning: false };
    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, { timestamp: new Date().toISOString(), ...action.payload }]
      };
    case 'RESET_WIZARD':
      return initialState;
    default:
      return state;
  }
}

const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
} | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
