-- Migration: Initial WebAuthn Schema
-- Run with: psql -d sage_os -f lib/db/migrations/001_initial_webauthn.sql

SET search_path TO public;

-- This migration creates the initial WebAuthn authentication schema
-- See lib/db/schema.sql for the complete schema definition

-- Note: The schema.sql file contains the full CREATE TABLE statements
-- This migration file is for tracking migration history
-- In production, you would use a migration tool or run schema.sql directly

SELECT 'Migration 001: Initial WebAuthn schema - run schema.sql' AS status;
