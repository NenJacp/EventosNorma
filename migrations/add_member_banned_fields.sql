-- Script SQL para agregar campos de ban a event_members
-- Ejecutar directamente en PostgreSQL

-- Agregar columna IsBanned
ALTER TABLE event_members ADD COLUMN IF NOT EXISTS "IsBanned" BOOLEAN NOT NULL DEFAULT FALSE;

-- Agregar columna BannedAt
ALTER TABLE event_members ADD COLUMN IF NOT EXISTS "BannedAt" TIMESTAMP WITH TIME ZONE NULL;

-- Verificar que se agregaron
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'event_members' 
AND column_name IN ('IsBanned', 'BannedAt');
