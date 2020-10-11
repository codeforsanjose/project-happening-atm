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
