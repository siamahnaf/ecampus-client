import { gql } from "urql";

export const ADD_INCOME_HEAD = gql`
mutation addIncomeHead($incomeHeadInput: IncomeHeadInput!) {
    addIncomeHead(incomeHeadInput: $incomeHeadInput) {
      success
      message
    }
}
`

export const GET_INCOME_HEAD_LIST = gql`
query getIncomeHead($searchInput: SearchInput!) {
    getIncomeHeads(searchInput: $searchInput) {
      results {
        id
        title
        description
        createdBy {
          name
          id
        }
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

export const GET_ALL_INCOME_HEAD = gql`
query getAllIncomeHead {
    getAllIncomeHead {
      id
      title
      description
      createdBy {
        name
        id
      }
    }
}  
`;

export const DELETE_INCOME_HEAD = gql`
mutation deleteIncomeHead($deleteIncomeHeadId: String!) {
  deleteIncomeHead(id: $deleteIncomeHeadId) {
    success
    message
  }
}
`;

export const UPDATE_INCOME_HEAD = gql`
mutation updateIncomeHead($incomeHeadInput: IncomeHeadInput!, $updateIncomeHeadId: String!) {
  updateIncomeHead(incomeHeadInput: $incomeHeadInput, id: $updateIncomeHeadId) {
    success
    message
  }
}
`;