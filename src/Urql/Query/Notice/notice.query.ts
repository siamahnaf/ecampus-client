import { gql } from "urql";

export const ADD_NOTICE = gql`
mutation addNotice($noticeInput: NoticeInput!) {
    addNotice(noticeInput: $noticeInput) {
      success
      message
    }
}
`;

export const GET_NOTICE = gql`
query getNotices($searchInput: SearchInput!) {
    getNotices(searchInput: $searchInput) {
      results {
        id
        title
        description
        pdf
        createdBy {
          name
          phone
        }
        created_at
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

export const GET_ALL_NOTICE = gql`
query getAllNotice {
    getAllNotice {
      id
      title
      description
      pdf
      createdBy {
        name
        phone
      }
      created_at
    }
}  
`;

export const DELETE_NOTICE = gql`
mutation deleteNotice($deleteNoticeId: String!) {
  deleteNotice(id: $deleteNoticeId) {
    success
    message
  }
}
`;

export const UPDATE_NOTICE = gql`
mutation updateNotice($noticeInput: NoticeInput!, $updateNoticeId: String!) {
  updateNotice(noticeInput: $noticeInput, id: $updateNoticeId) {
    success
    message
  }
}
`;