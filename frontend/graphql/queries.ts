import { gql } from "@apollo/client";

export const MY_FILES = gql`
  query MyFiles {
    myFiles {
      id
      name
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
      isPublic
      content
      createdAt
      sharedWith {
        id
        username
      }
    }
  }
`;

export const PUBLIC_FILE = gql`
  query PublicFile($fileID: ID!) {
    publicFile(fileID: $fileID) {
      id
      name
      isPublic
      content
      createdAt
      sharedWith {
        id
        username
      }
    }
  }
`;
