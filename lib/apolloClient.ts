import { ApolloClient, InMemoryCache, split, HttpLink, ApolloLink } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

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

    return forward(operation).map((response) => {
        if (response.errors) {
            console.error('GraphQL Errors:', response.errors);
        }
        return response;
    });
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: 'ws://localhost:3001/api/graphql',
        connectionParams: () => {
            const token = getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
        }
        
    })
);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink)
);

const apolloClient = new ApolloClient({
    link: splitLink,
    uri: "http://localhost:3001/api/graphql",
    cache: new InMemoryCache(),
    credentials: "include",
    
});

export default apolloClient;
