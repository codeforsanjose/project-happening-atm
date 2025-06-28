CREATE TABLE IF NOT EXISTS account (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(50),
  unsubscribe_token VARCHAR(50),
  email_address VARCHAR(50) UNIQUE NOT NULL,
  phone_number VARCHAR(50),
  phone_number_subscribed BOOLEAN DEFAULT 'f',
  email_address_subscribed BOOLEAN DEFAULT 'f',
  created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  roles VARCHAR(50)[] DEFAULT '{user}'
);
