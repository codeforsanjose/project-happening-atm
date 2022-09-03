const { gql } = require('apollo-server');

module.exports = gql`
type Query {
    getMeeting(id: Int!): meeting
    getAllMeetings: [meeting]

    getMeetingItem(id: Int!): meeting_item
    getAllMeetingItems: [meeting_item]

    getMeetingWithItems(id: Int!): meeting_with_items
    getAllMeetingsWithItems: [meeting_with_items]

    getSubscription(id: Int!): subscription
    getSubscriptionsByEmailAndMeetingID(phone_number: String!, email_address: String!, meeting_id: Int!): [subscription]
    getAllSubscriptions: [subscription]

    getAllAccounts: [account]
    getAccountByEmail(email_address: String): account
    getAccountById(id: Int): account

    loginLocal(email_address: String!, password: String!): auth_data
    loginGoogle: auth_data
    loginMicrosoft: auth_data

    # TODO: Need to add verify token query

    # TODO: Need to add reset password query

    getResetPasswordToken(id: Int): account
}

type Mutation {
    createMeeting(meeting_start_timestamp: String!, meeting_type: String, status: String, virtual_meeting_url: String, virtual_meeting_id: String, call_in_information: String, email_before_meeting: String, email_during_meeting: String, eComment: String, city_of_san_jose_meeting: String, youtube_link: String): meeting
    updateMeeting(id: Int!, status: String, meeting_type: String, virtual_meeting_url: String, meeting_start_timestamp: String, meeting_end_timestamp: String, , virtual_meeting_id: String, call_in_information: String, email_before_meeting: String, email_during_meeting: String, eComment: String, city_of_san_jose_meeting: String, youtube_link: String): meeting

    createMeetingItem(meeting_id: Int!, order_number: Int!, item_start_timestamp: String, item_end_timestamp: String, status: String, content_categories: String!, description_loc_key: String, title_loc_key: String, parent_meeting_item_id: Int): meeting_item
    updateMeetingItem(id: Int, order_number: Int!, status: String, item_start_timestamp: String, item_end_timestamp: String, content_categories: String!, description_loc_key: String, title_loc_key: String, parent_meeting_item_id: Int): meeting_item

    createSubscriptions(phone_number: String, email_address:String, meetings: [meetingInput]): [subscription]
    deleteSubscription(phone_number: String!, email_address: String!, meeting_id: Int!, meeting_item_id: Int!): Boolean

    confirmEmail(token: String): Boolean
    unconfirmEmail(token: String): Boolean
    updateEmail(id: Int!, email_address: String!): account

    updatePhoneNumber(id: Int!, phone_number: String!): account

    createAccount(email_address: String, password: String, phone_number: String, roles: roles): auth_data

    deleteMeeting(id: Int!): String

    forgotPassword(emailAddress: String): ID
    resetPassword(id: Int, password: String ): ID
    updatePassword(currentPassword: String, newPassword: String ): ID

}

type subscription {
    id: Int
    phone_number: String
    email_address: String
    meeting_item_id: Int
    meeting_id: Int
    created_timestamp: String
    updated_timestamp: String
}

input meetingInput {
    meeting_item_id: Int
}

type meeting_with_items {
    meeting: meeting
    items: [meeting_item]
}

type meeting {
    id: Int
    status: String
    meeting_type: String
    created_timestamp: String
    updated_timestamp: String
    meeting_start_timestamp: String
    meeting_end_timestamp: String
    virtual_meeting_url: String
    virtual_meeting_id: String
    call_in_information: String
    email_before_meeting: String
    email_during_meeting: String
    ecomment: String
    city_of_san_jose_meeting: String
    youtube_link: String
}

type meeting_item {
    id: Int
    meeting_id: Int
    parent_meeting_item_id: Int
    order_number: Int
    status: String
    created_timestamp: String
    updated_timestamp: String
    item_start_timestamp: String
    item_end_timestamp: String
    content_categories: String
    description_loc_key: String
    title_loc_key: String
}

type account {
  id: Int
  first_name: String
  last_name: String
  unsubscribe_token: String
  email_address: String
  phone_number: String
  phone_number_subscribed: Boolean
  email_address_subscribed: Boolean
  password: String
  password_reset_token: String
  password_reset_expire: String
  roles: [roles]!
  created_timestamp: String
  updated_timestamp: String
}

enum roles{
  ADMIN
  USER
}


type auth_data {
  token: String!
  email: String
}
`;