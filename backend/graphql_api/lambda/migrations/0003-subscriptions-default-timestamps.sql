ALTER TABLE subscription ALTER COLUMN created_timestamp SET DEFAULT now();
ALTER TABLE subscription ALTER COLUMN updated_timestamp SET DEFAULT now();
