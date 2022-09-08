import { gql } from '@apollo/client';


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

export const GET_MEETING = gql`
  query GetMeeting($id: Int!) {
    getMeeting(id: $id) {
      id,
      status,
      meeting_type,
      meeting_start_timestamp,
      meeting_end_timestamp,
      virtual_meeting_url,
      virtual_meeting_id,
      call_in_information,
      email_before_meeting,
      email_during_meeting,
      ecomment,
      youtube_link 
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
        virtual_meeting_url,
        virtual_meeting_id,
        call_in_information,
        email_before_meeting,
        email_during_meeting,
        ecomment,
        youtube_link,
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

// Get existing email_address for create account validations
export const GET_ALL_ACCOUNT_EMAILS = gql`
  query {
    getAllAccountEmails {
      id,
      email_address
     }
  }
`;

// Get account details by email address

export const GET_ACCOUNT_BY_EMAIL = gql`
  query GetAccountByEmail($email_address: String) {
    getAccountByEmail(email_address: $email_address){
      id
    }
  }
`;

export const GET_RESET_PASSWORD_TOKEN = gql`
query GetResetPasswordToken(
  $id: Int
){
  getResetPasswordToken(
    id: $id
){
  password_reset_token
}
}
`;

export const GET_SUB_BY_EMAIL_MEETINGID = gql`
query GetSubByEmailAndID(
  $phone_number: String!, 
  $meeting_id: Int!, 
  $email_address: String!){
    getSubscriptionsByEmailAndMeetingID(phone_number:$phone_number,
      email_address: $email_address,
      meeting_id: $meeting_id,){
      id,
      phone_number,
      email_address,
      meeting_item_id,
      meeting_id,
    }
}
`;