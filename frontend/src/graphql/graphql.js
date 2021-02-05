import { gql } from '@apollo/client'

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

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription(
      $phone_number: String,
      $email_address: String,
      $meeting_item_id: Int,
      $meeting_id: Int
  ) {
    createSubscription(phone_number: $phone_number, email_address: $email_address,
    meeting_id: $meeting_id, meeting_item_id: $meeting_item_id) {
      id
    }
  }
`;
