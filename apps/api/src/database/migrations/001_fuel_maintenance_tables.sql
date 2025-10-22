SET TIMEZONE='America/Sao_Paulo';

CREATE TABLE IF NOT EXISTS fuel_fill_ups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    car_id UUID NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    km INTEGER NOT NULL,
    volume NUMERIC(10,2) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    is_full_tank BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_fuel_fill_ups_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth_users(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_fuel_fill_ups_car_id 
        FOREIGN KEY (car_id) 
        REFERENCES cars(id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS maintenances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    car_id UUID NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    km INTEGER NOT NULL,
    type VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    local VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_maintenances_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth_users(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_maintenances_car_id 
        FOREIGN KEY (car_id) 
        REFERENCES cars(id) 
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_fuel_fill_ups_user_id ON fuel_fill_ups(user_id);
CREATE INDEX IF NOT EXISTS idx_fuel_fill_ups_car_id ON fuel_fill_ups(car_id);
CREATE INDEX IF NOT EXISTS idx_fuel_fill_ups_date ON fuel_fill_ups(date);
CREATE INDEX IF NOT EXISTS idx_fuel_fill_ups_user_car ON fuel_fill_ups(user_id, car_id);

CREATE INDEX IF NOT EXISTS idx_maintenances_user_id ON maintenances(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_car_id ON maintenances(car_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_date ON maintenances(date);
CREATE INDEX IF NOT EXISTS idx_maintenances_user_car ON maintenances(user_id, car_id);
CREATE INDEX IF NOT EXISTS idx_maintenances_type ON maintenances(type);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fuel_fill_ups_updated_at 
    BEFORE UPDATE ON fuel_fill_ups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenances_updated_at 
    BEFORE UPDATE ON maintenances 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();