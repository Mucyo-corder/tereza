import { Pool } from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log("Running migration...");
    const migrationPath = join(__dirname, 'migrations', '002_add_phone_column.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    await pool.query(migrationSQL);
    console.log("Migration completed successfully!");
    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
