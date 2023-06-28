import { gql } from "urql";

export const GET_WEAVERS = gql`
query getWeaver($getWeaversId: String!) {
    getWeavers(id: $getWeaversId) {
      student {
        id
        studentId
        name
        class {
          id
          name
        }
        shift {
          id
          name
        }
        section {
          id
          name
        }
        group {
          id
          name
        }
        image
        motherName
        fatherName
      }
      weavers {
        id
        fee {
          id
          name
        }
        discount
        discountUnit
        frequency
        createdBy {
          name
          phone
        }
      }
    }
  }  
`;

export const ADD_WEAVER = gql`
mutation addWeaver($weaverInput: WeaverInput!) {
  addWeaver(weaverInput: $weaverInput) {
    success
    message
  }
}
`;

export const DELETE_WEAVER = gql`
mutation deleteWeaver($deleteWeaverId: String!) {
  deleteWeaver(id: $deleteWeaverId) {
    success
    message
  }
}
`;

export const UPDATE_WEAVER = gql`
mutation updateWeaver($weaverInput: WeaverInput!, $updateWeaverId: String!) {
  updateWeaver(weaverInput: $weaverInput, id: $updateWeaverId) {
    success
    message
  }
}
`;