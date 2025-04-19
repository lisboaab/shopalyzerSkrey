import { concat, gql } from "@apollo/client/core";
import apolloClient from "./apolloClient";

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
      createdAt}
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
  query GetUserPhoto($id: ID!) {
    user(ID: $id) {
      name
    }
  }
`;

const GET_USER_TYPE = gql`
  query GetUserPhoto($id: ID!) {
    user(ID: $id) {
      userType
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
    }
  }
`;

export const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
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
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id },
    });
    return data.user;
  } catch (error) {
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