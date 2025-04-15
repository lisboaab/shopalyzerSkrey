import { gql } from "apollo-server-micro";

const typeDefs = gql`
  enum TypeUser {
    admin
    default
  }

  type LoginResponse {
    accessToken: String
    userID: ID
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    userType: TypeUser!
    profilePicture: String
    cloudinaryID: String
    notifications: Boolean
    token: String
  }

  input UserCreateInput {
    name: String!
    email: String!
    password: String!
  }

  input UserInput {
    name: String
    email: String
    password: String
    profilePicture: String
    notifications: Boolean
    cloudinaryID: String
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  type Query {
    user(ID: ID!): User
    users: [User]
  }

  type Mutation {
    createUser(input: UserCreateInput!): User
    updateUser(id: ID!, input: UserInput!): User
    removeUser(id: ID!): String
    loginUser(input: UserLoginInput!): LoginResponse
  }
`;

export default typeDefs;
