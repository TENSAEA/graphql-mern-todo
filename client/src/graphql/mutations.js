import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      id
      username
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`;
