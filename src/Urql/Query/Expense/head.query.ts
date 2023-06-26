import { gql } from "urql";

export const ADD_EXPENSE_HEAD = gql`
mutation addExpenseHead($expenseHeadInput: ExpenseHeadInput!) {
    addExpenseHead(expenseHeadInput: $expenseHeadInput) {
      success
      message
    }
  }
`;

export const UPDATE_EXPENSE_HEAD = gql`
mutation updateExpenseHead($expenseHeadInput: ExpenseHeadInput!, $updateExpenseHeadId: String!) {
    updateExpenseHead(expenseHeadInput: $expenseHeadInput, id: $updateExpenseHeadId) {
      success
      message
    }
  }
`;

export const DELETE_EXPENSE_HEAD = gql`
mutation deleteExpense($deleteExpenseHeadId: String!) {
    deleteExpenseHead(id: $deleteExpenseHeadId) {
      success
      message
    }
  }
`;

export const GET_EXPENSE_HEADS = gql`
query getExpenseHeads($searchInput: SearchInput!) {
    getExpenseHeads(searchInput: $searchInput) {
      results {
        id
        title
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

export const GET_ALL_EXPENSE_HEAD = gql`
query getAllExpenseHead {
    getAllExpenseHead {
      id
      title
      description
      createdBy {
        phone
        name
      }
    }
}  
`
