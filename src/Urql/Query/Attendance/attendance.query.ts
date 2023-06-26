import { gql } from "urql";


export const ADD_ATTENDANCE = gql`
mutation createAttendanceSheet($attendanceInput: AttendanceInput!) {
    createAttendanceSheet(attendanceInput: $attendanceInput) {
      id
      present
      student {
        id
        roll
        name
        studentId
        session
        class {
          name
        }
      }
    }
}  
`;

export const ADD_PRESENT = gql`
mutation addPresent($presentInput: PresentInput!) {
  addPresent(presentInput: $presentInput) {
    success
    message
  }
}
`;