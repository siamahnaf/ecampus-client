import { gql } from "urql";

export const ADD_SETTINGS = gql`
mutation addSettings($settingInput: SettingsInput!) {
    addSettings(settingInput: $settingInput) {
      success
      message
    }
}
`;

export const GET_SETTINGS = gql`
query getSettings {
  getSettings {
    icon
    logo
    name
    slogan
    url
    metaTitle
    ogTitle
    metaDescription
    ogDescription
    metaTag
    ogImage
    ogUrl
    email
    phone
    office
    headOffice
    moreInfo {
      title
      value
    }
    socials {
      icon
      url
    }
  }
}
`;