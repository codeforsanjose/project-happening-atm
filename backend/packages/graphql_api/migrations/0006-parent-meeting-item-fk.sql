ALTER TABLE meeting_item
ADD CONSTRAINT fk_parent_meeting_item_id FOREIGN KEY (parent_meeting_item_id)
REFERENCES meeting_item (id) ON DELETE CASCADE;