import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink  } from '@apollo/client/core';

const getToken = () => localStorage.getItem('authToken');

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
    // console.log('bearer token: ', operation)
    return forward(operation).map((response) => {
        if (response.errors) {
            // console.error('GraphQL Errors:', response.errors);
            const authError = response.errors.find(
                err => err.extensions?.code === 'UNAUTHENTICATED'
            );
            
            if (authError) {
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
