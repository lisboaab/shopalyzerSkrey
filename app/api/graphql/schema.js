import { gql } from "apollo-server-micro";

export const typeDefs = gql`
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
    _id: ID
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
    description: String
    graphType: GraphType!
    status: Status!
  }

  type Store {
    _id: ID!
    name: String!
    shopUrl: String!
    APIKey: String!
    APISecretKey: String!
    APIToken: String!
    createdBy: User!
    lastModifiedBy: User!
    createdAt: String
    updatedAt: String
  }

  type Group {
    _id: ID!
    name: String!
    status: Status!
    createdBy: User!
    icon: String
    metrics: [Metric!]!
  }

  type Search {
    _id: ID!
    name: String!
    isSaved: Boolean!
    userID: User!
    timePeriod: String
    metrics: [Metric!]
    metricsGroup: Group
    store: Store!
    createdAt: String
    updatedAt: String
  }

  type Order {
    _id: ID
    name: String
    shopUrl: String
    APIKey: String
    APISecretKey: String
    
  }

  input UserCreateInput {
    name: String!
    email: String!
    password: String!
  }

  input StoreCreateInput {
    shopUrl: String!
    name: String!
    APIKey: String!
    APISecretKey: String!
    APIToken: String!
    createdBy: String
  }

  input MetricCreateInput {
    name: String!
    description: String!
    graphType: String!
    status: String
  }

  input GroupCreateInput {
    name: String!
    icon: String
    status: String
    metrics: [ID!]
    createdBy: String
  }

  input SearchCreateInput {
    timePeriod: String
    userID: String
    metrics: [ID!]
    metricsGroup: String
    store: String!
  }

  input UserInput {
    name: String
    email: String
    password: String
    profilePicture: String
    notifications: Boolean
    cloudinaryID: String
    userType: TypeUser
  }

  input StoreInput {
    name: String
    shopUrl: String
    APIKey: String
    APISecretKey: String
    APIToken: String
    lastModifiedBy: String
  }

  input MetricInput {
    name: String
    description: String
    graphType: String
    status: String
  }

  input GroupInput {
    name: String
    icon: String
    status: String
    metrics: [ID!]
  }

  input SearchInput {
    name: String
    store: String
    metrics: [ID!]
    metricsGroup: String
    isSaved: Boolean
    timePeriod: String
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
    userSearches(ID: ID!): [Search]
    userFavoriteSearches(ID: ID!): [Search]
    store(ID: ID!): Store
    group(ID: ID!): Group
    metric(ID: ID!): Metric
    userTypesList: [TypeUser]
    storeOrders(shopId: ID!, status: String, limit: Int): Order
  }

  type Mutation {
    createUser(input: UserCreateInput!): User
    updateUser(id: ID!, input: UserInput!): User
    removeUser(id: ID!): String
    createStore(input: StoreCreateInput!): Store
    updateStore(id: ID!, input: StoreInput!): Store
    removeStore(id: ID!): String
    loginUser(input: UserLoginInput!): LoginResponse
    createMetric(input: MetricCreateInput!): Metric
    removeMetric(id: ID!): String
    updateMetric(id: ID!, input: MetricInput!): Metric
    createGroup(input: GroupCreateInput!): Group
    updateGroup(id: ID!, input: GroupInput!): Group
    removeGroup(id: ID!): String
    createSearch(input: SearchCreateInput!): Search
    removeSearch(id: ID!): String
    updateSearch(id: ID!, input: SearchInput!): Search
  }
`;

