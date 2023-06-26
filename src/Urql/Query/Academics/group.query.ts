import { gql } from "urql";

export const ADD_GROUP = gql`
mutation addGroup($groupInput: GroupInput!) {
    createGroup(groupInput: $groupInput) {
      success
      message
    }
}
`;

export const GET_GROUP_LIST = gql`
query getGroups($searchInput: SearchInput!) {
    getGroups(searchInput: $searchInput) {
      results {
        id
        name
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

export const GET_ALL_GROUP = gql`
query getAllGroups {
  getAllGroups {
    id
    name
    createdBy {
      name
      phone
    }
  }
}
`;

export const DELETE_GROUP_LIST = gql`
mutation deleteGroup($deleteGroupId: String!) {
  deleteGroup(id: $deleteGroupId) {
    success
    message
  }
}
`;

export const UPDATE_GROUP = gql`
mutation updateGroup($groupInput: GroupInput!, $updateGroupId: String!) {
    updateGroup(groupInput: $groupInput, id: $updateGroupId) {
      success
      message
    }
}
`;