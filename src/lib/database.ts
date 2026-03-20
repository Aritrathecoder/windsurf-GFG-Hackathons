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

  // Even if DB exists, refresh if table is missing or empty
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='youtube_stats'").get();
  const rowCount = tableCheck ? (db.prepare("SELECT COUNT(*) as count FROM youtube_stats").get() as { count: number }).count : 0;
  
  if (!tableCheck || rowCount === 0) {
    initializeDatabase(db);
  }

  return db;
}

function initializeDatabase(database: Database.Database) {
  try {
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

    // Manual seed with high-quality modern data (2024-2025)
    console.log('📂 Seeding with modern sample data...');
    const modernData = [
      { timestamp: '2024-12-01 10:00:00', video_id: 'v1', category: 'Tech', language: 'English', region: 'US', duration_sec: 600, views: 1200000, likes: 54000, comments: 4200, shares: 1200, sentiment_score: 0.85, ads_enabled: 1 },
      { timestamp: '2025-01-15 14:30:00', video_id: 'v2', category: 'Gaming', language: 'English', region: 'UK', duration_sec: 1200, views: 3500000, likes: 210000, comments: 15600, shares: 8900, sentiment_score: 0.92, ads_enabled: 1 },
      { timestamp: '2025-02-10 09:15:00', video_id: 'v3', category: 'Education', language: 'Hindi', region: 'IN', duration_sec: 800, views: 800000, likes: 32000, comments: 2800, shares: 900, sentiment_score: 0.78, ads_enabled: 0 },
      { timestamp: '2025-03-05 18:00:00', video_id: 'v4', category: 'Entertainment', language: 'English', region: 'US', duration_sec: 450, views: 10000000, likes: 850000, comments: 92000, shares: 45000, sentiment_score: 0.95, ads_enabled: 1 },
      { timestamp: '2024-11-20 12:00:00', video_id: 'v5', category: 'Tech', language: 'Spanish', region: 'ES', duration_sec: 500, views: 450000, likes: 18000, comments: 1200, shares: 600, sentiment_score: 0.82, ads_enabled: 1 },
      { timestamp: '2025-03-18 20:00:00', video_id: 'v6', category: 'Gaming', language: 'Japanese', region: 'JP', duration_sec: 1500, views: 2200000, likes: 140000, comments: 8500, shares: 3200, sentiment_score: 0.88, ads_enabled: 1 },
      { timestamp: '2024-09-12 11:00:00', video_id: 'v7', category: 'Lifestyle', language: 'French', region: 'FR', duration_sec: 300, views: 120000, likes: 5000, comments: 400, shares: 150, sentiment_score: 0.75, ads_enabled: 0 },
      { timestamp: '2025-03-20 16:00:00', video_id: 'v8', category: 'Tech', language: 'English', region: 'US', duration_sec: 750, views: 5600000, likes: 320000, comments: 28000, shares: 14000, sentiment_score: 0.91, ads_enabled: 1 },
    ];

    const insertStmt = database.prepare(`
      INSERT INTO youtube_stats (timestamp, video_id, category, language, region, duration_sec, views, likes, comments, shares, sentiment_score, ads_enabled)
      VALUES (@timestamp, @video_id, @category, @language, @region, @duration_sec, @views, @likes, @comments, @shares, @sentiment_score, @ads_enabled)
    `);

    const seedTransaction = database.transaction((rows: any[]) => {
      for (const row of rows) insertStmt.run(row);
    });

    seedTransaction(modernData);
    console.log(`✅ Seeded ${modernData.length} records of modern analytics data.`);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
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

    const count = database.prepare(`SELECT COUNT(*) as count FROM youtube_stats`).get() as { count: number };
    schema += `Data volume: ${count.count} records\n`;
  }
  
  return schema;
}
