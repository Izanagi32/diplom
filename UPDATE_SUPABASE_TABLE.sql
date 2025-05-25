-- Додавання полів статусу та пріоритету до таблиці requests
ALTER TABLE requests 
ADD COLUMN status TEXT DEFAULT 'pending',
ADD COLUMN priority TEXT DEFAULT 'medium',
ADD COLUMN status_comment TEXT,
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Створення індексу для статусу
CREATE INDEX idx_requests_status ON requests(status);

-- Створення функції для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Створення тригера для автоматичного оновлення updated_at
CREATE TRIGGER update_requests_updated_at 
    BEFORE UPDATE ON requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Додавання політики для оновлення (дозволити всім)
CREATE POLICY "Allow update access for all users" ON requests
  FOR UPDATE USING (true); 