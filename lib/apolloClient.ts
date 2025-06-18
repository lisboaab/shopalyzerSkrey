import { ApolloClient, InMemoryCache, HttpLink, ApolloLink  } from '@apollo/client/core';

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

const httpLink = new HttpLink({
    uri: 'http://localhost:3001/api/graphql',
    fetchOptions: {
        mode: 'cors'
    }
});

const authLink = new ApolloLink((operation, forward) => {
    const token = getToken();

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        }
        
    }));
    return forward(operation).map((response) => {
        if (response.errors) {
            const authError = response.errors.find(
                err => err.extensions?.code === 'UNAUTHENTICATED'
            );
              if (authError && typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userID');
                window.location.href = '/auth';
            }
        }
        return response;
    });
});

const apolloClient = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
          fetchPolicy: 'network-only',
        },
      },
    credentials: "include",
});

export default apolloClient;
