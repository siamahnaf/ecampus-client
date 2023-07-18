import { gql } from "urql";

export const ADD_CONF = gql`
mutation addConf($confInput: ConfInput!) {
    addConf(confInput: $confInput) {
      success
      message
    }
}
`;

export const GET_CONF_LIST = gql`
query getConfs($searchInput: SearchInput!) {
    getConfs(searchInput: $searchInput) {
      results {
        id
        classId {
          id
          name
        }
        examId {
          id
          name
        }
        subjects {
          totalMarks
          subjectId {
            name
            id
          }
        }
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


export const GET_ALL_CONFS = gql`
query getAllConf {
    getAllConfs {
      id
      classId {
        id
        name
      }
      examId {
        id
        name
      }
      subjects {
        totalMarks
        subjectId {
          name
          id
        }
      }
      createdBy {
        name
        phone
      }
    }
}  
`;

export const DELETE_CONF = gql`
mutation deleteConf($deleteConfId: String!) {
    deleteConf(id: $deleteConfId) {
      success
      message
    }
}
`;