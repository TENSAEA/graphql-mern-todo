import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!): Todo
    updateTodo(id: ID!, title: String, completed: Boolean): Todo
    deleteTodo(id: ID!): Todo
  }
`;

export default typeDefs;
