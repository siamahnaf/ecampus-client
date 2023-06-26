import { gql } from "urql";

export const ADD_ROOM = gql`
mutation addRoom($roomInput: RoomInput!) {
    addRoom(roomInput: $roomInput) {
      success
      message
    }
}
`;

export const GET_ROOM_LIST = gql`
query getRoom($searchInput: SearchInput!) {
    getRooms(searchInput: $searchInput) {
      results {
        id
        room_no
        capacity
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

export const GET_ALL_ROOM = gql`
query getAllRoom {
    getAllRoom {
      id
      room_no
      capacity
      createdBy {
        name
        phone
      }
    }
}
`;

export const DELETE_ROOM = gql`
mutation deleteRoom($deleteRoomId: String!) {
  deleteRoom(id: $deleteRoomId) {
    success
    message
  }
}
`;

export const UPDATE_ROOM = gql`
mutation updateRoom($roomInput: RoomInput!, $updateRoomId: String!) {
    updateRoom(roomInput: $roomInput, id: $updateRoomId) {
      success
      message
    }
}
`;