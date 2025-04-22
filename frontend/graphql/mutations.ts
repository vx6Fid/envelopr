"use client";
import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
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

export const DELETE_FILE = gql`
  mutation DeleteFile($fileID: ID!) {
    deleteFile(fileID: $fileID)
  }
`;

export const SHARE_FILE = gql`
  mutation ShareFile($fileID: ID!, $userID: ID!) {
    shareFile(fileID: $fileID, userID: $userID)
  }
`;

export const UPLOAD_FILE = gql`
  mutation UploadFile($name: String!, $url: String!) {
    uploadFile(name: $name, url: $url) {
      id
      name
    }
  }
`;

export const UPDATE_FILE = gql`
  mutation UpdateFile($id: ID!, $name: String, $url: String) {
    updateFile(id: $id, name: $name, url: $url) {
      id
      name
      url
    }
  }
`;

export const MAKE_FILE_PUBLIC = gql`
  mutation MakeFilePublic($fileID: ID!) {
    makeFilePublic(fileID: $fileID)
  }
`;
