import { concat, gql } from "@apollo/client/core";
import apolloClient from "./apolloClient";

import Metric from "../app/interface/metric";
import Group from "../app/interface/group";

export const LOGIN_MUTATION = gql`
  mutation Login($input: UserLoginInput!) {
    loginUser(input: $input) {
      accessToken
      userID
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: UserCreateInput!) {
    createUser(input: $input) {
      name
      email
      password
      profilePicture
      cloudinaryID
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(ID: $id) {
      name
      email
      password
      profilePicture
      notifications
      userType
      cloudinaryID
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      name
      email
      notifications
      userType
      createdAt
    }
  }
`;

const GET_STORES = gql`
  query GetStores {
    stores {
      _id
      shopUrl
      name
      APIKey
      APISecretKey
      APIToken
      createdBy {
        _id
        name
        email
      }
      lastModifiedBy {
        _id
        name
        email
      }
      updatedAt
    }
  }
`;

const GET_STORE = gql`
  query GetStore($id: ID!) {
    store(ID: $id) {
      _id
      shopUrl
      name
      APIKey
      APISecretKey
      APIToken
      createdBy {
        _id
        name
        email
      }
      lastModifiedBy {
        _id
        name
        email
      }
      updatedAt
    }
  }
`;

const GET_STORES_NAME_AND_ID = gql`
  query GetStoresNameAndId {
    stores {
      _id
      shopUrl
      name
    }
  }
`;

const GET_USER_PHOTO = gql`
  query GetUserPhoto($id: ID!) {
    user(ID: $id) {
      profilePicture
    }
  }
`;

const GET_USER_NAME = gql`
  query GetUserName($id: ID!) {
    user(ID: $id) {
      name
    }
  }
`;

const GET_USER_TYPE = gql`
  query GetUserType($id: ID!) {
    user(ID: $id) {
      userType
    }
  }
`;

const GET_USER_TYPE_LIST = gql`
  query UserTypeList {
    userTypesList
  }
`;

const GET_GROUPS = gql`
  query GetGroups {
    groups {
      _id
      name
      metrics {
        _id
        name
      }
      icon
      status
    }
  }
`;

const GET_GROUPS2 = gql`
  query GetGroups {
    groups {
      _id
      name
      metrics
      createdBy {
        _id
        name
        email
      }
      status
      icon
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      name
      email
      password
      notifications
      profilePicture
      cloudinaryID
      userType
    }
  }
`;

export const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

export const UPDATE_STORE_MUTATION = gql`
  mutation UpdateStore($id: ID!, $input: StoreInput!) {
    updateStore(id: $id, input: $input) {
      shopUrl
      name
      lastModifiedBy {
        _id
      }
    }
  }
`;

export const REMOVE_STORE_MUTATION = gql`
  mutation RemoveStore($id: ID!) {
    removeStore(id: $id)
  }
`;

export const CREATE_STORE_MUTATION = gql`
  mutation CreateStore($input: StoreCreateInput!) {
    createStore(input: $input) {
      shopUrl
      name
      APIKey
      APISecretKey
      APIToken
    }
  }
`;

export const GET_METRICS = gql`
  query GetMetrics {
    metrics {
      _id
      name
      description
      status
      graphType
    }
  }
`;

export const UPDATE_METRIC_MUTATION = gql`
  mutation UpdateMetric($id: ID!, $input: MetricInput!) {
    updateMetric(id: $id, input: $input) {
      name
      status
      description
    }
  }
`;

export const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($input: GroupCreateInput!) {
    createGroup(input: $input) {
      name
      metrics {
        _id
        name
      }
      icon
      status
    }
  }
`;

export const UPDATE_GROUP_MUTATION = gql`
  mutation UpdateGroup($id: ID!, $input: GroupInput!) {
    updateGroup(id: $id, input: $input) {
      name
      status
      icon
    }
  }
`;

export const REMOVE_GROUP_MUTATION = gql`
  mutation RemoveGroup($id: ID!) {
    removeGroup(id: $id)
  }
`;

const GET_USER_SEARCHES = gql`
  query GetUserSearches($id: ID!) {
    userSearches(ID: $id) {
      _id
      name
      metrics {
        _id
        name
        status
      }
      isSaved
      metricsGroup {
        _id
      }
      store {
        _id
        name
      }
      updatedAt
      timePeriod
    }
  }
`;

const GET_USER_FAVORITE_SEARCHES = gql`
  query GetUserFavoriteSearches($id: ID!) {
    userFavoriteSearches(ID: $id) {
      _id
      name
      metrics {
        _id
        name
        status
      }
      metricsGroup {
        icon
        name
      }
      store {
        name
      }
      updatedAt
    }
  }
`;

export const REMOVE_SEARCH_MUTATION = gql`
  mutation RemoveSearch($id: ID!) {
    removeSearch(id: $id)
  }
`;

export const CREATE_SEARCH_MUTATION = gql`
  mutation CreateSearch($input: SearchCreateInput!) {
    createSearch(input: $input) {
      _id
      name
      metrics {
        _id
      }
      isSaved
      timePeriod
      metricsGroup {
        _id
      }
      store {
        _id
      }
    }
  }
`;

const GET_STORE_OF_SEARCH = gql`
  query GetStoreOfSearch($id: ID!) {
    search(ID: $id) {
      store {
        _id
      }
    }
  }
`;

const GET_SEARCH = gql`
  query GetSearch($id: ID!) {
    search(ID: $id) {
      _id
      name
      timePeriod
      isSaved
      updatedAt
      metrics {
        _id
        name
        graphType
        status
      }
      store {
        _id
        name
      }
      metricsGroup {
        _id
        name
      }
    }
  }
`;

export const UPDATE_SEARCH = gql`
  mutation UpdateSearch($id: ID!, $input: SearchInput!) {
    updateSearch(id: $id, input: $input) {
      name
      isSaved
      timePeriod
      updatedAt
      metrics {
        _id
        name
      }
      store {
        _id
        name
      }
      metricsGroup {
        _id
        name
      }
    }
  }
`;

export const createUser = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { input },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (input: { email: string; password: string }) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { input },
    });
    localStorage.setItem("authToken", data.loginUser.accessToken);
    localStorage.setItem("userID", data.loginUser.userID);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserPhoto = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_PHOTO,
      variables: { id },
    });
    return data.user;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found");
      throw new Error("Authentication required");
    }

    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id },
      fetchPolicy: "network-only",
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (!data || !data.user) {
      throw new Error("User data not found in response");
    }

    return data.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    if (error instanceof Error && "graphQLErrors" in error) {
      console.error("GraphQL errors:", (error as any).graphQLErrors);
    }
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USERS,
    });
    return data.users;
  } catch (error) {
    throw error;
  }
};

export const getUserType = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_TYPE,
      variables: { id },
    });
    return data.user.userType;
  } catch (error) {
    throw error;
  }
};

export const getUserName = async (id: string) => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_NAME,
      variables: { id },
    });
    return data.user;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: string,
  input: {
    email?: string;
    password?: string;
    name?: string;
    notifications?: boolean;
    profilePicture?: string;
    cloudinaryID?: string;
    userType?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: { id, input },
    });
    return data.updateUser;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};

export const removeUser = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_USER_MUTATION,
      variables: { id },
    });
    return data.removeUser;
  } catch (error) {
    throw error;
  }
};

export const getStore = async (id: string, token?: string) => {
  try {
    const authToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null);

    if (!authToken) {
      throw new Error("No authentication token available");
    }
    const { data } = await apolloClient.query({
      query: GET_STORE,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });
    return data?.store || [];
  } catch (error) {
    throw error;
  }
};

export const getStores = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await apolloClient.query({
      query: GET_STORES,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return data?.stores || [];
  } catch (error) {
    throw error;
  }
};

export const getStoresBasic = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await apolloClient.query({
      query: GET_STORES_NAME_AND_ID,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return data?.stores || [];
  } catch (error) {
    throw error;
  }
};

export const removeStore = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_STORE_MUTATION,
      variables: { id },
    });
    return data.removeStore;
  } catch (error) {
    throw error;
  }
};

export const updateStore = async (
  id: string,
  input: {
    shopUrl?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_STORE_MUTATION,
      variables: { id, input },
    });
    return data.updateStore;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};

export const createStore = async (input: {
  shopUrl: string;
  name: string;
  APIKey: string;
  APISecretKey: string;
  APIToken: string;
}) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_STORE_MUTATION,
      variables: { input },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const userTypesList = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_TYPE_LIST,
    });
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const getMetrics = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_METRICS,
    });
    return data?.metrics || [];
  } catch (error) {
    throw error;
  }
};

export const updateMetricStatus = async (
  id: string,
  input: {
    status?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_METRIC_MUTATION,
      variables: { id, input },
    });
    return data.updateMetric;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};

export const getActiveMetrics = async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_METRICS,
    });
    if (data.metrics) {
      const activeMetrics = data.metrics.filter(
        (m: Metric) => m.status === "active"
      );
      return activeMetrics;
    }
  } catch (error) {
    throw error;
  }
};

export const getGroups = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await apolloClient.query({
      query: GET_GROUPS,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return data?.groups || [];
  } catch (error) {
    throw error;
  }
};

export const getActiveGroups = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await apolloClient.query({
      query: GET_GROUPS,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    const activeGroups = data.groups.filter(
      (g: Group) => g.status === "active"
    );
    return activeGroups;
  } catch (error) {
    throw error;
  }
};

export const removeGroup = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_GROUP_MUTATION,
      variables: { id },
    });
    return data.removeStore;
  } catch (error) {
    throw error;
  }
};

export const updateGroup = async (
  id: string,
  input: {
    name?: string;
    metrics?: string[];
    status?: string;
    icon?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_GROUP_MUTATION,
      variables: { id, input },
    });
    return data.updateGroup;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};

export const createGroup = async (input: {
  name: string;
  metrics: string[];
  icon: string;
  status: string;
}) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_GROUP_MUTATION,
      variables: { input },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSearch = async (input: {
  timePeriod: string;
  metrics: string[];
  userID: string;
  metricsGroup: string;
  store: string;
}) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_SEARCH_MUTATION,
      variables: { input },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserSearches = async (id: string) => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await apolloClient.query({
      query: GET_USER_SEARCHES,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      variables: { id },
    });
    return data.userSearches || [];
  } catch (error) {
    throw error;
  }
};

export const getUserFavoriteSearches = async (id: string) => {
  try {
    const token = localStorage.getItem("authToken");
    const { data } = await apolloClient.query({
      query: GET_USER_FAVORITE_SEARCHES,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      variables: { id },
    });
    return data.userFavoriteSearches || [];
  } catch (error) {
    throw error;
  }
};

export const removeSearch = async (id: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SEARCH_MUTATION,
      variables: { id },
    });
    return data.removeSearch;
  } catch (error) {
    throw error;
  }
};

export const getStoreOfSearch = async (id: string, token?: string) => {
  try {
    const authToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null);

    if (!authToken) {
      throw new Error("No authentication token available");
    }
    const { data } = await apolloClient.query({
      query: GET_STORE_OF_SEARCH,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });
    return data?.search || [];
  } catch (error) {
    throw error;
  }
};

export const getSearch = async (id: string, token?: string) => {
  try {
    const authToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null);

    if (!authToken) {
      throw new Error("No authentication token available");
    }
    const { data } = await apolloClient.query({
      query: GET_SEARCH,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });
    return data?.search || [];
  } catch (error) {
    throw error;
  }
};

export const updateSearch = async (
  id: string,
  input: {
    isSaved?: boolean;
    name?: string;
    store?: string;
    metrics?: string[];
    metricsGroup?: string;
    timePeriod?: string;
  }
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SEARCH,
      variables: { id, input },
    });
    return data.updateSearch;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw error;
  }
};
