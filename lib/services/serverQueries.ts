import { GET_STORE } from '../queries';
import { createServerApolloClient } from '../serverApolloClient';

export const getStoreServer = async (id: string, authToken: string) => {
  try {
    const client = createServerApolloClient(authToken);
    
    const { data } = await client.query({
      query: GET_STORE,
      variables: { id },
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });

    return data?.store;
  } catch (error) {
    console.error('Error in getStoreServer:', error);
    throw error;
  }
};
