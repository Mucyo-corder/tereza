-- Add phone column to guests table if it doesn't exist
ALTER TABLE guests ADD COLUMN IF NOT EXISTS phone VARCHAR(15);
