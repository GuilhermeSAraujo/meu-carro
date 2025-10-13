-- Set timezone to São Paulo, Brazil
SET TIMEZONE='America/Sao_Paulo';

-- Create auth_users table
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  google_id VARCHAR NOT NULL,
  image VARCHAR,
  created_at TIMESTAMP(2) WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(2) WITH TIME ZONE DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP(2) WITH TIME ZONE
);
-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_idx ON auth_users(email);

