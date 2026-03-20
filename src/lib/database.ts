import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

const DB_PATH = path.join(process.cwd(), 'data', 'business.db');
// New CSV Path
const YOUTUBE_CSV_PATH = path.join(process.cwd(), '3. YouTube Content Creation', 'YouTube Content Creation.csv');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
  }

  const dbExists = fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);
  
  db.pragma('journal_mode = WAL');

  // Even if DB exists, sometimes we want to refresh if table is missing
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='youtube_stats'").get();
  if (!tableCheck) {
    initializeDatabase(db);
  }

  return db;
}

function initializeDatabase(database: Database.Database) {
  console.log('💎 Initializing YouTube Statistics Database...');
  
  // Create the youtube_stats table
  database.exec(`
    CREATE TABLE IF NOT EXISTS youtube_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      video_id TEXT NOT NULL,
      category TEXT NOT NULL,
      language TEXT NOT NULL,
      region TEXT NOT NULL,
      duration_sec INTEGER,
      views INTEGER,
      likes INTEGER,
      comments INTEGER,
      shares INTEGER,
      sentiment_score REAL,
      ads_enabled BOOLEAN
    );
  `);

  // Create indexes for YouTube queries
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_yt_timestamp ON youtube_stats(timestamp);
    CREATE INDEX IF NOT EXISTS idx_yt_category ON youtube_stats(category);
    CREATE INDEX IF NOT EXISTS idx_yt_region ON youtube_stats(region);
    CREATE INDEX IF NOT EXISTS idx_yt_language ON youtube_stats(language);
  `);

  // Load YouTube CSV data
  if (fs.existsSync(YOUTUBE_CSV_PATH)) {
    console.log('📂 Loading YouTube CSV data (this may take a few seconds)...');
    const csvContent = fs.readFileSync(YOUTUBE_CSV_PATH, 'utf-8');
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const insertStmt = database.prepare(`
      INSERT INTO youtube_stats (timestamp, video_id, category, language, region, duration_sec, views, likes, comments, shares, sentiment_score, ads_enabled)
      VALUES (@timestamp, @video_id, @category, @language, @region, @duration_sec, @views, @likes, @comments, @shares, @sentiment_score, @ads_enabled)
    `);

    const insertMany = database.transaction((rows: any[]) => {
      for (const row of rows) {
        // Clean boolean values for SQLite
        if (row.ads_enabled === 'True' || row.ads_enabled === true) row.ads_enabled = 1;
        else row.ads_enabled = 0;
        
        insertStmt.run(row);
      }
    });

    insertMany(parsed.data);
    console.log(`✅ Loaded ${parsed.data.length} YouTube content records into the database`);
  } else {
    console.warn('⚠️ YouTube CSV file not found at:', YOUTUBE_CSV_PATH);
  }
}

export function executeQuery(sql: string): { columns: string[]; rows: Record<string, unknown>[] } {
  const database = getDatabase();
  
  const trimmedSql = sql.trim().toUpperCase();
  if (!trimmedSql.startsWith('SELECT')) {
    throw new Error('Only SELECT queries are allowed for security reasons.');
  }

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
    throw new Error(`SQL execution error: ${(error as Error).message}\nQuery: ${sql}`);
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
    schema += `Sample data: ${JSON.stringify(sampleRows)}\n\n`;
    
    // Categorical analysis
    const categories = ['category', 'region', 'language'];
    for (const cat of categories) {
      if (columns.some(c => c.name === cat)) {
        const distinct = database.prepare(`SELECT DISTINCT ${cat} FROM ${table.name} LIMIT 20`).all() as any[];
        schema += `Unique ${cat} sample: ${distinct.map(d => d[cat]).join(', ')}\n`;
      }
    }
    
    // Date context
    const dateCol = columns.find(c => c.name === 'timestamp' || c.name === 'date');
    if (dateCol) {
      const dates = database.prepare(`SELECT MIN(${dateCol.name}) as start, MAX(${dateCol.name}) as end FROM ${table.name}`).get() as any;
      schema += `Timeline range: ${dates.start} to ${dates.end}\n`;
    }

    const count = database.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
    schema += `Data volume: ${count.count} records\n`;
  }
  
  return schema;
}
