CREATE DATABASE devdb;
\c devdb 

CREATE TABLE meeting (
    id SERIAL NOT NULL PRIMARY KEY,
    meeting_type VARCHAR(255),
    status VARCHAR(255),
    created_timestamp TIMESTAMP NOT NULL,
    updated_timestamp TIMESTAMP NOT NULL,
    meeting_start_timestamp TIMESTAMP NOT NULL,
    meeting_end_timestamp TIMESTAMP,
    virtual_meeting_url VARCHAR(255)
);

CREATE TABLE meeting_item (
    id SERIAL NOT NULL PRIMARY KEY,
    meeting_id INT NOT NULL,
    order_number INT,
    created_timestamp TIMESTAMP NOT NULL,
    updated_timestamp TIMESTAMP NOT NULL,
    item_start_timestamp TIMESTAMP,
    item_end_timestamp TIMESTAMP,
    status VARCHAR(255),
    content_categories VARCHAR(255),
    description_loc_key VARCHAR(255),
    title_loc_key VARCHAR(255),
    CONSTRAINT fk_meeting_id
        FOREIGN KEY(meeting_id)
            REFERENCES meeting(id)
);

CREATE TABLE subscription (
    id SERIAL NOT NULL PRIMARY KEY,
    meeting_item_id INT,
    meeting_id INT,
    created_timestamp TIMESTAMP NOT NULL,
    updated_timestamp TIMESTAMP NOT NULL,
    phone_number VARCHAR(255),
    email_address VARCHAR(255)
);

CREATE TABLE admin (
    id SERIAL NOT NULL PRIMARY KEY,
    email_address VARCHAR(255)
);

INSERT INTO meeting(meeting_type, status, created_timestamp, updated_timestamp, meeting_start_timestamp, meeting_end_timestamp, virtual_meeting_url)
VALUES ('test', 'PENDING', current_timestamp, current_timestamp, current_timestamp, current_timestamp, 'google.com');


INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
VALUES (1, 1, current_timestamp, current_timestamp, current_timestamp, current_timestamp, 'PENDING', '[]', 'Description loc key', 'Title loc key');

INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
VALUES (1, 2, current_timestamp, current_timestamp, current_timestamp, current_timestamp, 'PENDING', '[]', 'Description loc key', 'Title loc key');

INSERT INTO meeting_item(meeting_id, order_number, created_timestamp, updated_timestamp, item_start_timestamp, item_end_timestamp, status, content_categories, description_loc_key, title_loc_key)
VALUES (1, 2, current_timestamp, current_timestamp, current_timestamp, current_timestamp, 'PENDING', '[]', 'Description loc key', 'Title loc key');


INSERT INTO subscription(meeting_item_id, meeting_id, created_timestamp, updated_timestamp, phone_number, email_address)
VALUES (1, 1, current_timestamp, current_timestamp, current_timestamp, 'fake@faker.gov');

INSERT INTO subscription(meeting_item_id, meeting_id, created_timestamp, updated_timestamp, phone_number, email_address)
VALUES (2, 1, current_timestamp, current_timestamp, current_timestamp, 'fake@faker.gov');

INSERT INTO subscription(meeting_item_id, meeting_id, created_timestamp, updated_timestamp, phone_number, email_address)
VALUES (3, 1, current_timestamp, current_timestamp, current_timestamp, 'fake@faker.gov');