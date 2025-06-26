import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client/core';

const isBrowser = typeof window !== 'undefined';

const createServerApolloClient = (token?: string) => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:3001/api/graphql',
    fetchOptions: {
      mode: 'cors'
    }
  });

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
      }
    }));

    return forward(operation);
  });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
};

export { createServerApolloClient };
