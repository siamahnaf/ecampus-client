import { gql } from "urql";

export const ADD_EXPENSE = gql`
mutation addExpense($expenseInput: ExpenseInput!) {
    addExpense(expenseInput: $expenseInput) {
      success
      message
    }
  }
`;

export const UPDATE_EXPENSE = gql`
mutation updateExpense($expenseInput: ExpenseInput!, $updateExpenseId: String!) {
    updateExpense(expenseInput: $expenseInput, id: $updateExpenseId) {
      success
      message
    }
  }
`;

export const DELETE_EXPENSE = gql`
mutation deleteExpense($deleteExpenseId: String!) {
    deleteExpense(id: $deleteExpenseId) {
      success
      message
    }
  }
`;

export const GET_EXPENSE_LIST = gql`
query getExpenses($searchInput: SearchInput!) {
    getExpenses(searchInput: $searchInput) {
      results {
        id
        head {
          id
          title
        }
        name
        amount
        invoice
        date
        file
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

export const GET_ALL_EXPENSE = gql`
query getAllExpense {
    getAllExpense {
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
`