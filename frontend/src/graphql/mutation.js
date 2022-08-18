import { gql } from '@apollo/client';

export const UPDATE_MEETING = gql`
  mutation UpdateMeeting(
    $id: Int!,
    $status: String,
    $meeting_type: String,
    $virtual_meeting_url: String,
    $meeting_start_timestamp: String,
    $meeting_end_timestamp: String,
    $virtual_meeting_id: String,
    $call_in_information: String,
    $email_before_meeting: String,
    $email_during_meeting: String,
    $eComment: String,
    $city_of_san_jose_meeting: String,
    $youtube_link: String,
  ) {
    updateMeeting(
      id: $id,
      status: $status,
      meeting_type: $meeting_type,
      virtual_meeting_url: $virtual_meeting_url,
      meeting_start_timestamp: $meeting_start_timestamp,
      meeting_end_timestamp: $meeting_end_timestamp,
      virtual_meeting_id: $virtual_meeting_id,
      call_in_information: $call_in_information,
      email_before_meeting: $email_before_meeting,
      email_during_meeting: $email_during_meeting,
      eComment: $eComment,
      city_of_san_jose_meeting: $city_of_san_jose_meeting,
      youtube_link: $youtube_link
    ) {
      id
    }
}
`;

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

export const CREATE_MEETING = gql`
  mutation CreateMeeting(
    $meeting_start_timestamp: String!
    $meeting_type: String
    $status: String
    $virtual_meeting_url: String
    $virtual_meeting_id: String
    $call_in_information: String
    $email_before_meeting: String
    $email_during_meeting: String
    $eComment: String
    $city_of_san_jose_meeting: String
    $youtube_link: String
  ) {
    createMeeting(
      meeting_start_timestamp: $meeting_start_timestamp
      meeting_type: $meeting_type
      status: $status
      virtual_meeting_url: $virtual_meeting_url
      virtual_meeting_id: $virtual_meeting_id
      call_in_information: $call_in_information
      email_before_meeting: $email_before_meeting
      email_during_meeting: $email_during_meeting
      eComment: $eComment
      city_of_san_jose_meeting: $city_of_san_jose_meeting
      youtube_link: $youtube_link) {
        id
      }
  }
`;

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

export const LOGIN_LOCAL = gql`
  query LoginLocal(
    $email_address: String!,
    $password: String!,
    
  ){
    loginLocal(
      email_address:$email_address,
      password:$password,
    ){
      token
    }
  }
`;

export const LOGIN_GOOGLE = gql`
  query LoginGoogle {
    loginGoogle{
      token
    }
  }
`;

export const LOGIN_MICROSOFT = gql`
query LoginMicrosoft {
  loginMicrosoft{
    token
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

export const DELETE_MEETING = gql`
  mutation deleteMeeting(
    $id: Int!
  ) {
    deleteMeeting(id: $id)
  }
`;

// New mutation for creating a new account.
// Mutation corresponds to existing backend "createAccount" mutation.
export const CREATE_ACCOUNT = gql`
  mutation CreateAccount(
    $email_address: String,
    $password: String,
    $phone_number: String,
    $roles: roles
  ){
    createAccount(
      email_address: $email_address,
      password: $password,
      phone_number: $phone_number,
      roles: $roles
  ){
    token
  }
  }
`;

export const FORGOT_PASSWORD = gql`
mutation ForgotPassword(
  $emailAddress: String
){
  forgotPassword(
    emailAddress: $emailAddress,
)
}
`;

export const RESET_PASSWORD = gql`
mutation ResetPassword(
  $id: Int,
  $password: String
){
  resetPassword(
    id: $id,
    password: $password
)
}
`;