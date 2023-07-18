import { gql } from "urql";

export const GET_SUBJECT_RESULT = gql`
mutation getSubjectResult($resultSearchInput: ResultSearchInput!) {
    getSubjectResult(resultSearchInput: $resultSearchInput) {
      studentId {
        studentId
        roll
        name
      }
      marks {
        id
        cq
        mcq
        practical
        ca
        totalMarks
        fullMarks
        grade
      }
      gradeId {
        grades {
          name
          grade_point
          percent_upto
          percent_from
        }
      }
    }
}
`;

export const UPDATE_MARKS = gql`
mutation updateResult($marksInput: MarksInput!, $updateMarksId: String!) {
  updateMarks(marksInput: $marksInput, id: $updateMarksId) {
    success
    message
  }
}
`;

export const GET_RESULT_LIST = gql`
query getResults($resultPramsInput: ResultPramsInput!) {
  getResults(resultPramsInput: $resultPramsInput) {
    id
    studentId {
      roll
      studentId
      name
    }
    gradeId {
      grades {
        name
        grade_point
      }
    }
    marks {
      subjectId {
        name
      }
      fullMarks
      cq
      mcq
      practical
      ca
      totalMarks
      grade
      grade_point
    }
  }
}
`;