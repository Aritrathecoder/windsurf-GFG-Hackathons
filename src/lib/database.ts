import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

const DB_PATH = path.join(process.cwd(), 'data', 'business.db');
const CSV_PATH = path.join(process.cwd(), 'data', 'sales_data.csv');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) return db;

  const dbExists = fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);
  
  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  if (!dbExists) {
    initializeDatabase(db);
  }

  return db;
}

function initializeDatabase(database: Database.Database) {
  // Create the sales table
  database.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      region TEXT NOT NULL,
      product_category TEXT NOT NULL,
      product_name TEXT NOT NULL,
      units_sold INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      revenue REAL NOT NULL,
      cost REAL NOT NULL,
      profit REAL NOT NULL,
      salesperson TEXT NOT NULL,
      customer_segment TEXT NOT NULL,
      channel TEXT NOT NULL
    );
  `);

  // Create indexes for common queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
    CREATE INDEX IF NOT EXISTS idx_sales_region ON sales(region);
    CREATE INDEX IF NOT EXISTS idx_sales_category ON sales(product_category);
    CREATE INDEX IF NOT EXISTS idx_sales_channel ON sales(channel);
    CREATE INDEX IF NOT EXISTS idx_sales_segment ON sales(customer_segment);
    CREATE INDEX IF NOT EXISTS idx_sales_salesperson ON sales(salesperson);
  `);

  // Load CSV data
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  const insertStmt = database.prepare(`
    INSERT INTO sales (date, region, product_category, product_name, units_sold, unit_price, revenue, cost, profit, salesperson, customer_segment, channel)
    VALUES (@date, @region, @product_category, @product_name, @units_sold, @unit_price, @revenue, @cost, @profit, @salesperson, @customer_segment, @channel)
  `);

  const insertMany = database.transaction((rows: Record<string, unknown>[]) => {
    for (const row of rows) {
      insertStmt.run(row);
    }
  });

  insertMany(parsed.data as Record<string, unknown>[]);
  console.log(`✅ Loaded ${parsed.data.length} rows into the database`);
}

export function executeQuery(sql: string): { columns: string[]; rows: Record<string, unknown>[] } {
  const database = getDatabase();
  
  // Security: Only allow SELECT statements
  const trimmedSql = sql.trim().toUpperCase();
  if (!trimmedSql.startsWith('SELECT')) {
    throw new Error('Only SELECT queries are allowed for security reasons.');
  }

  // Prevent dangerous operations
  const forbidden = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'EXEC', 'ATTACH'];
  for (const word of forbidden) {
    if (trimmedSql.includes(word)) {
      throw new Error(`Forbidden SQL operation detected: ${word}`);
    }
  }

  try {
    const stmt = database.prepare(sql);
    const rows = stmt.all() as Record<string, unknown>[];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { columns, rows };
  } catch (error) {
    throw new Error(`SQL execution error: ${(error as Error).message}`);
  }
}

export function getSchemaInfo(): string {
  const database = getDatabase();
  const tables = database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
  
  let schema = '';
  for (const table of tables) {
    const columns = database.prepare(`PRAGMA table_info(${table.name})`).all() as { name: string; type: string }[];
    schema += `Table: ${table.name}\nColumns:\n`;
    for (const col of columns) {
      schema += `  - ${col.name} (${col.type})\n`;
    }
    
    // Add sample data
    const sampleRows = database.prepare(`SELECT * FROM ${table.name} LIMIT 3`).all();
    schema += `Sample rows: ${JSON.stringify(sampleRows, null, 2)}\n\n`;
    
    // Add distinct values for categorical columns
    const categoricalCols = ['region', 'product_category', 'customer_segment', 'channel', 'salesperson'];
    for (const colName of categoricalCols) {
      if (columns.some(c => c.name === colName)) {
        const distinctValues = database.prepare(`SELECT DISTINCT ${colName} FROM ${table.name} ORDER BY ${colName}`).all() as any[];
        schema += `Distinct ${colName} values: ${distinctValues.map((v) => v[colName]).join(', ')}\n`;
      }
    }
    
    // Add date range
    if (columns.some(c => c.name === 'date')) {
      const dateRange = database.prepare(`SELECT MIN(date) as min_date, MAX(date) as max_date FROM ${table.name}`).get() as { min_date: string; max_date: string };
      schema += `Date range: ${dateRange.min_date} to ${dateRange.max_date}\n`;
    }

    // Add row count
    const count = database.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
    schema += `Total rows: ${count.count}\n`;
  }
  
  return schema;
}
