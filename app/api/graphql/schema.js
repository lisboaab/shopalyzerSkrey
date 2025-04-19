import { gql } from "apollo-server-micro";

const typeDefs = gql`
  enum TypeUser {
    admin
    default
  }

  enum GraphType {
    bar
    line
    pie
    donut
    card
  }

  enum Status {
    active
    inactive
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
    createdAt: String
    updatedAt: String
  }

  type Metric {
    _id: ID!
    name: String!
    description: String!
    graphType: GraphType!
    status: Status!
  }

  type Search {
    _id: ID!
    userID: String!
    title: String!
    isSaved: Boolean
  }

  type Store {
    _id: ID!
    name: String!
    APIKey: String!
    APIToken: String!
    createdBy: String!
  }

  type Group {
    _id: ID!
    name: String!
    status: Boolean!
    createdBy: String!
    icon: String
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
    stores: [Store]
    groups: [Group] 
    metrics: [Metric]
    searches: [Search]
    search(ID: ID!): Search
    store(ID: ID!): Store
    group(ID: ID!): Group
    metric(ID: ID!): Metric
  }

  type Mutation {
    createUser(input: UserCreateInput!): User
    updateUser(id: ID!, input: UserInput!): User
    removeUser(id: ID!): String
    loginUser(input: UserLoginInput!): LoginResponse
  }
`;

export default typeDefs;
