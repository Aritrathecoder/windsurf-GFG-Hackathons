const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), 'data', 'business.db');
const db = new Database(dbPath);
const rowCount = db.prepare('SELECT COUNT(*) as count FROM youtube_stats').get();
console.log('Row count:', rowCount.count);
if (rowCount.count > 0) {
    const sample = db.prepare('SELECT * FROM youtube_stats LIMIT 1').get();
    console.log('Sample:', JSON.stringify(sample, null, 2));
}
