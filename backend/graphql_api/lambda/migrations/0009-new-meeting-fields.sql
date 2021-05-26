ALTER TABLE meeting
ADD COLUMN virtual_meeting_id VARCHAR(50),
ADD COLUMN call_in_information VARCHAR(50),
ADD COLUMN email_before_meeting VARCHAR(50),
ADD COLUMN email_during_meeting VARCHAR(50),
ADD COLUMN eComment VARCHAR(255),
ADD COLUMN city_of_san_jose_meeting VARCHAR(255),
ADD COLUMN youtube_link VARCHAR(255);
