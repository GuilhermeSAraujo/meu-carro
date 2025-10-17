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

CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    kilometers INTEGER NOT NULL,
    license_plate VARCHAR,
    tank_volume INTEGER NOT NULL,
    chassis VARCHAR,
    renavam VARCHAR,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraint
    CONSTRAINT fk_cars_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth_users(id) 
        ON DELETE CASCADE
);

-- Índices para melhorar performance
CREATE INDEX idx_cars_user_id ON cars(user_id);