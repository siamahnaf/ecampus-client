import { gql } from "urql";

export const NOTIFY_EVENT = gql`
subscription notifyEvent {
  notifyEvent {
    id
    title
    details
    path {
      id
      type
    }
    image
    read
    created_at
  }
}
`;

export const GET_NOTIFICATIONS = gql`
query getNotifications {
  getNotifications {
    id
    title
    details
    path {
      id
      type
    }
    image
    read
    created_at
  }
}
`;

export const SEARCH_USER = gql`
mutation searchProfile($userSearchInput: UserSearchInput!) {
  searchProfile(userSearchInput: $userSearchInput) {
    id
    name
    role
  }
}
`;

export const ADD_NOTIFICATION = gql`
mutation addNotification($notificationInput: NotificationInput!) {
  addNotification(notificationInput: $notificationInput) {
    success
    message
  }
}
`;

export const GET_ALL_NOTIFICATIONS = gql`
query getAllNotifications($searchInput: SearchInput!) {
    getAllNotifications(searchInput: $searchInput) {
      results {
        id
        title
        details
        image
        type
        receivers {
          to
        }
        created_at
        senderId {
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

export const GET_EXPORT_NOTIFICATION = gql`
query getAllNotificationsWithoutPagination {
    getAllNotificationsWithoutPagination {
      id
      title
      details
      image
      type
      receivers {
        to
      }
      created_at
      senderId {
        name
        phone
      }
    }
}  
`;

export const MARK_AS_READ = gql`
mutation markAsReadNotification($markAsReadNotificationId: String!) {
  markAsReadNotification(id: $markAsReadNotificationId) {
    success
    message
  }
}
`;