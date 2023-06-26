import { gql } from "urql";

export const ADD_SECTION = gql`
mutation addSection($sectionInput: SectionInput!) {
    addSection(sectionInput: $sectionInput) {
      success
      message
    }
}
`;

export const GET_SECTION_LIST = gql`
query getSections($searchInput: SearchInput!) {
  getSections(searchInput: $searchInput) {
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

export const GET_ALL_SECTIONS = gql`
query getAllSections {
  getAllSections {
    id
    name
    createdBy {
      name
      phone
    }
  }
}
`;

export const DELETE_SECTION_LIST = gql`
mutation deleteSection($deleteSectionId: String!) {
  deleteSection(id: $deleteSectionId) {
    success
    message
  }
}
`;

export const UPDATE_SECTION = gql`
mutation updateSection($sectionInput: SectionInput!, $updateSectionId: String!) {
  updateSection(sectionInput: $sectionInput, id: $updateSectionId) {
    success
    message
  }
}
`;