import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const dbUrl = new URL(process.env.DATABASE_URL);

console.log("DATABASE DEBUG:");
console.log("DB user:", dbUrl.username);
console.log("DB host:", dbUrl.hostname);
console.log("DB port:", dbUrl.port);
console.log("DB database:", dbUrl.pathname);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const guestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15).optional(),
});

app.get("/api/guests", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, COALESCE(phone, '') as phone, submitted_at FROM guests ORDER BY submitted_at ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

app.post("/api/guests", async (req, res) => {
  try {
    const { name, phone } = guestSchema.parse(req.body);
    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanPhone = phone ? phone.trim() : null;

    let result;
    if (cleanPhone) {
      result = await pool.query(
        "INSERT INTO guests (name, phone) VALUES ($1, $2) RETURNING id, name, phone, submitted_at",
        [cleanName, cleanPhone]
      );
    } else {
      result = await pool.query(
        "INSERT INTO guests (name) VALUES ($1) RETURNING id, name, submitted_at",
        [cleanName]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input. Name must be 2-100 characters." });
    }
    if (error.code === "23505") {
      return res.status(409).json({ error: "Aya mazina asanzwe ku rutonde ❤️" });
    }
    if (error.code === "42703") {
      // Column "phone" does not exist - try without phone
      try {
        const { name } = guestSchema.parse(req.body);
        const cleanName = name.trim().replace(/\s+/g, " ");
        const result = await pool.query(
          "INSERT INTO guests (name) VALUES ($1) RETURNING id, name, submitted_at",
          [cleanName]
        );
        res.status(201).json(result.rows[0]);
        return;
      } catch (fallbackError) {
        console.error("Error adding guest (fallback):", fallbackError);
        return res.status(500).json({ error: "Failed to add guest" });
      }
    }
    console.error("Error adding guest:", error);
    res.status(500).json({ error: "Failed to add guest" });
  }
});

app.delete("/api/guests", async (req, res) => {
  try {
    await pool.query("DELETE FROM guests");
    res.json({ message: "All guests deleted successfully" });
  } catch (error) {
    console.error("Error deleting guests:", error);
    res.status(500).json({ error: "Failed to delete guests" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});