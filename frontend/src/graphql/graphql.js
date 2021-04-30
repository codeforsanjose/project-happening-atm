import { gql } from '@apollo/client';

// agenda items below
// getters
export const GET_ALL_MEETINGS = gql`
  query {
    getAllMeetings {
      id,
      meeting_start_timestamp,
      status
    }
  }
`;

export const GET_ALL_MEETINGS_WITH_ITEMS = gql`
  query {
    getAllMeetingsWithItems {
      meeting {
        id
        status
      }
      items {
        id
        status
        order_number
        title_loc_key
      }
    }
  }
`;

export const GET_MEETING_WITH_ITEMS = gql`
  query GetMeetingWithItems($id: Int!) {
    getMeetingWithItems(id: $id) {
      meeting {
        id,
        status,
        meeting_type,
        meeting_start_timestamp,
        meeting_end_timestamp,
        virtual_meeting_url
      }
      items {
        id,
        meeting_id,
        parent_meeting_item_id,
        order_number,
        status,
        item_start_timestamp,
        item_end_timestamp,
        content_categories,
        description_loc_key,
        title_loc_key     
      }

    }
  }
`;

// setters

export const UPDATE_MEETING_ITEM = gql`
  mutation UpdateMeetingItem(
    $id: Int,
    $order_number: Int!,
    $status: String,
    $content_categories: String!,
    $item_start_timestamp: String,
    $item_end_timestamp: String,
    $description_loc_key: String,
    $title_loc_key: String,
    $parent_meeting_item_id:Int,
  ) {
    updateMeetingItem(
      id:$id,
      order_number:$order_number,
      status:$status,
      item_start_timestamp:$item_start_timestamp,
      item_end_timestamp:$item_end_timestamp,
      content_categories:$content_categories,
      description_loc_key:$description_loc_key,
      title_loc_key:$title_loc_key,
      parent_meeting_item_id:$parent_meeting_item_id
    ) {
      id
    }
}
`;

// agenda items ended

export const CREATE_SUBSCRIPTIONS = gql`
  mutation CreateSubscriptions(
    $phone_number: String,
    $email_address: String,
    $meetings: [meetingInput]
  ) {
    createSubscriptions(phone_number: $phone_number, email_address: $email_address, meetings: $meetings) {
      id
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation confirmEmail(
    $token: String
  ) {
    confirmEmail(token: $token)
  }
`;

export const UNCONFIRM_EMAIL = gql`
  mutation unconfirmEmail(
    $token: String
  ) {
    unconfirmEmail(token: $token)
  }
`;
