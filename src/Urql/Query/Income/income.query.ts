import { gql } from "urql";

export const ADD_INCOME = gql`
mutation addIncome($incomeInput: IncomeInput!) {
    addIncome(incomeInput: $incomeInput) {
      success
      message
    }
}
`;


export const GET_INCOME_LIST = gql`
query getIncomes($searchInput: SearchInput!) {
    getIncomes(searchInput: $searchInput) {
      results {
        id
        head {
          title
          id
        }
        name
        invoice
        date
        amount
        description
        createdBy {
          phone
          name
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

export const GET_ALL_INCOME = gql`
query getAllIncome {
    getAllIncome {
      head {
        title
      }
      name
      invoice
      date
      amount
      createdBy {
        phone
        name
      }
    }
}  
`;

export const UPDATE_INCOME = gql`
mutation updateIncome($incomeInput: IncomeInput!, $updateIncomeId: String!) {
    updateIncome(incomeInput: $incomeInput, id: $updateIncomeId) {
      success
      message
    }
}
`;

export const DELETE_INCOME = gql`
mutation deleteIncome($deleteIncomeId: String!) {
    deleteIncome(id: $deleteIncomeId) {
      success
      message
    }
}
`;