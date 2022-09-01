import { gql } from '@apollo/client';

export const UPDATE_EMAIL = gql`
  mutation updateEmail(
    $id: Int!,
    $email_address: String!
  ) {
    updateEmail(id: $id, email_address: $email_address) {
      id,
      email_address
    }
  }
`;

export const UPDATE_PHONE_NUMBER = gql`
  mutation updatePhoneNumber(
    $id: Int!,
    $phone_number: String!
  ) {
    updatePhoneNumber(id: $id, phone_number: $phone_number) {
      id,
      phone_number
    }
  }
`;