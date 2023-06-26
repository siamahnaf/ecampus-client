import { gql } from "urql";

export const GET_PROFILE = gql`
query getProfile {
    getProfile {
      id
      phone
      name
      image
      role
    }
}
`;

export const LOGOUT = gql`
mutation logout {
  logout {
    success
    message
  }
}
`;

export const UPDATE_PROFILE = gql`
mutation updateProfile($profileInput: ProfileInput!) {
  updateProfile(profileInput: $profileInput) {
    success
    message
  }
}
`;