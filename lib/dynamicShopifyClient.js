import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getStoreCredentials } from './services/storeService';

// Create a function to initialize the Shopify client with dynamic credentials
export const createDynamicShopifyClient = async (storeId) => {
  try {
    // Get credentials for the specified store from your database
    const { shopUrl, APIToken, apiVersion } = await getStoreCredentials(storeId);
    
    // Create an HTTP link to the Shopify GraphQL API
    const httpLink = createHttpLink({
      uri: `https://${shopUrl}/admin/api/${apiVersion}/graphql.json`,
    });
    
    // Add authentication headers
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          'X-Shopify-Access-Token': APIToken,
        },
      };
    });
    
    // Create and return the Apollo Client
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      name: 'shopify-client',
      version: '1.0',
    });
  } catch (error) {
    console.error('Error creating Shopify client:', error);
    throw error;
  }
};

// Maintain a cache of clients to avoid creating new ones for the same store
const clientCache = new Map();

export const getShopifyClient = async (storeId) => {
  // Check if we already have a client for this store
  if (clientCache.has(storeId)) {
    return clientCache.get(storeId);
  }
  
  // Create a new client
  const client = await createDynamicShopifyClient(storeId);
  
  // Store in cache
  clientCache.set(storeId, client);
  
  return client;
};

// Clear client from cache (useful when access token changes)
export const clearShopifyClient = (storeId) => {
  clientCache.delete(storeId);
};