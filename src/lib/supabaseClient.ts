
// Mock Supabase client for development
// This will be replaced with actual Supabase integration later

export interface MockSupabaseClient {
  from: (table: string) => {
    select: (columns?: string) => Promise<{ data: any[]; error: null }>;
    insert: (data: any) => Promise<{ data: any; error: null }>;
    update: (data: any) => { match: (conditions: any) => Promise<{ data: any; error: null }> };
    delete: () => { match: (conditions: any) => Promise<{ data: any; error: null }> };
  };
}

const mockData = {
  connections: [],
  schemas: [
    {
      id: 1,
      connection_id: 1,
      table_name: 'users',
      columns: JSON.stringify([
        { name: 'id', type: 'INTEGER', nullable: false },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false }
      ])
    }
  ],
  dry_run_reports: [],
  rule_templates: [],
  migrations: [],
  logs: []
};

export const supabase: MockSupabaseClient = {
  from: (table: string) => ({
    select: async (columns?: string) => {
      console.log(`Mock Supabase: SELECT ${columns || '*'} FROM ${table}`);
      return { data: mockData[table as keyof typeof mockData] || [], error: null };
    },
    insert: async (data: any) => {
      console.log(`Mock Supabase: INSERT INTO ${table}`, data);
      return { data, error: null };
    },
    update: (data: any) => ({
      match: async (conditions: any) => {
        console.log(`Mock Supabase: UPDATE ${table} SET`, data, 'WHERE', conditions);
        return { data, error: null };
      }
    }),
    delete: () => ({
      match: async (conditions: any) => {
        console.log(`Mock Supabase: DELETE FROM ${table} WHERE`, conditions);
        return { data: null, error: null };
      }
    })
  })
};
