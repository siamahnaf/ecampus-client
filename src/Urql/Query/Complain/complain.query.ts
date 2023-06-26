import { gql } from "urql";

export const GET_COMPLAIN_LIST = gql`
query getComplains($searchInput: SearchInput!) {
    getComplains(searchInput: $searchInput) {
      results {
        id
        title
        description
        complainBy {
          name
          phone
          studentId
        }
        status
      }
      meta {
        itemCount
        totalItems
        itemsPerPage
        totalPages
        currentPage
      }
    }
}
`;

export const GET_ALL_COMPLAIN = gql`
query getAllComplain {
    getAllComplain {
      id
      title
      description
      complainBy {
        name
        phone
        studentId
      }
      status
    }
}
`;

export const UPDATE_COMPLAIN = gql`
mutation updateComplainStatus($complainStatusInput: ComplainStatusInput!) {
  updateComplainStatus(complainStatusInput: $complainStatusInput) {
    success
    message
  }
}
`;