ALTER TABLE subscription
ADD CONSTRAINT fk_meeting_item_id FOREIGN KEY (meeting_item_id)
REFERENCES meeting_item (id) ON DELETE CASCADE;
