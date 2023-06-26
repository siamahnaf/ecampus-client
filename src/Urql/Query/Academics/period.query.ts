import { gql } from "urql";

export const ADD_PERIOD = gql`
mutation addPeriod($periodInput: PeriodInput!) {
    addPeriod(periodInput: $periodInput) {
      success
      message
    }
}
`;

export const GET_PERIOD_LIST = gql`
query getPeriods($searchInput: SearchInput!) {
    getPeriods(searchInput: $searchInput) {
      results {
        id
        name
        shift {
          name
          id
        }
        start
        end
        is_break
        createdBy {
          name
          phone
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

export const GET_ALL_PERIOD = gql`
query getAllPeriod {
    getAllPeriod {
      id
      name
      shift {
        name
        id
      }
      start
      end
      is_break
      createdBy {
        name
        phone
      }
    }
}  
`;

export const DELETE_PERIOD = gql`
mutation deletePeriod($deletePeriodId: String!) {
  deletePeriod(id: $deletePeriodId) {
    success
    message
  }
}
`;

export const UPDATE_PERIOD = gql`
mutation updarePeriod($periodInput: PeriodInput!, $updatePeriodId: String!) {
    updatePeriod(periodInput: $periodInput, id: $updatePeriodId) {
      success
      message
    }
}
`;