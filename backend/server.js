import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { z } from "zod";
import dotenv from "dotenv";
import ExcelJS from "exceljs";

dotenv.config();
const dbUrl = new URL(process.env.DATABASE_URL);

console.log("DATABASE DEBUG:");
console.log("DB user:", dbUrl.username);
console.log("DB host:", dbUrl.hostname);
console.log("DB port:", dbUrl.port);
console.log("DB database:", dbUrl.pathname);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", database: "disconnected", error: error.message });
  }
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false,
});

const guestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15).optional(),
});

app.get("/api/guests", async (req, res) => {
  try {
    console.log("Fetching guests from database...");
    const result = await pool.query(
      "SELECT id, name, COALESCE(phone, '') as phone, submitted_at FROM guests ORDER BY submitted_at ASC"
    );
    console.log("Guests fetched successfully:", result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ error: "Failed to fetch guests", details: error.message });
  }
});

app.post("/api/guests", async (req, res) => {
  try {
    console.log("Received guest request:", req.body);
    const { name, phone } = guestSchema.parse(req.body);
    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanPhone = phone ? phone.trim() : null;

    console.log("Attempting to insert guest:", cleanName);
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

    console.log("Guest added successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding guest:", error);
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
    res.status(500).json({ error: "Failed to add guest", details: error.message });
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

app.get("/api/guests/export", async (req, res) => {
  try {
    console.log("Fetching all guests for Excel export...");
    const result = await pool.query(
      "SELECT id, name, COALESCE(phone, '') as phone, submitted_at FROM guests ORDER BY submitted_at ASC"
    );
    const guests = result.rows;
    console.log(`Exporting ${guests.length} guests to Excel...`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registration Report");

    worksheet.mergeCells("A1:C1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "DUKUNDE KILIZIYA - Registration Report";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center" };

    worksheet.mergeCells("A2:C2");
    const dateCell = worksheet.getCell("A2");
    dateCell.value = `Generated: ${new Date().toLocaleString()}`;
    dateCell.font = { size: 10, italic: true };
    dateCell.alignment = { horizontal: "center" };

    worksheet.addRow([]);

    const headers = ["#", "Full Name", "Phone Number"];
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF006400" }
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    guests.forEach((guest, index) => {
      const row = worksheet.addRow([
        index + 1,
        guest.name,
        guest.phone || ""
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };

        if (colNumber === 3) {
          cell.numFmt = "@";
        }
      });
    });

    const countRowIndex = guests.length + 5;
    const countRow = worksheet.addRow(["", "Total Registered:", guests.length]);
    countRow.getCell(2).font = { bold: true };
    countRow.getCell(3).font = { bold: true };

    countRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 20;

    const filename = `Registration_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();

    console.log("Excel export completed successfully");
  } catch (error) {
    console.error("Error exporting guests to Excel:", error);
    res.status(500).json({ error: "Failed to export guests to Excel", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});