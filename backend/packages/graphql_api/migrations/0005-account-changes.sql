ALTER TABLE account
ADD first_name VARCHAR(50);

ALTER TABLE account
drop name;

ALTER TABLE account
ADD last_name VARCHAR(50);

ALTER Table account
ADD auth_type VARCHAR(10);

ALTER TABLE account
ADD password VARCHAR;

ALTER TABLE account
ADD password_reset_token VARCHAR;

ALTER TABLE account
ADD password_reset_expire TIMESTAMP;

ALTER TABLE account
ADD updated_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

