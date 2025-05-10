"use client";
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      tokenExpires
      user {
        id
        username
        createdAt
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      tokenExpires
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($fileID: ID!) {
    deleteFile(fileID: $fileID)
  }
`;

export const SHARE_FILE_USERNAME = gql`
  mutation ShareFileUsernameMutation($fileID: ID!, $username: String!) {
    shareFileUsername(fileID: $fileID, username: $username)
  }
`;

export const UPLOAD_FILE = gql`
  mutation UploadFile($name: String!, $content: String!) {
    uploadFile(name: $name, content: $content) {
      id
      name
    }
  }
`;

export const UPDATE_FILE = gql`
  mutation UpdateFile($id: ID!, $name: String) {
    updateFile(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_FILE_CONTENT = gql`
  mutation UpdateFileContent($id: ID!, $content: String!) {
    updateFileContent(id: $id, content: $content) {
      id
      content
    }
  }
`;

export const MAKE_FILE_PUBLIC = gql`
  mutation MakeFilePublic($fileID: ID!) {
    makeFilePublic(fileID: $fileID)
  }
`;
