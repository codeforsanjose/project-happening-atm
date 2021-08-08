ALTER TABLE meeting_item
DROP CONSTRAINT fk_meeting_id,
ADD CONSTRAINT fk_meeting_id
FOREIGN KEY (meeting_id)
REFERENCES meeting(id)
ON DELETE CASCADE;
