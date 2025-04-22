import { gql } from "@apollo/client";

export const MY_FILES = gql`
  query MyFiles {
    myFiles {
      id
      name
      url
      isPublic
      createdAt
    }
  }
`;

export const GET_FILE = gql`
  query File($fileID: ID!) {
    file(fileID: $fileID) {
      id
      name
      url
      isPublic
      sharedWith {
        id
        username
      }
    }
  }
`;
