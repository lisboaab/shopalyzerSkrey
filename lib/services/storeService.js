// Queries
import { getStore } from "@/lib/queries";

export async function getStoreCredentials(storeId, authToken) {
  if (!authToken) {
    throw new Error('No authentication token available');
  }
  
  try {
    const store = await getStore(storeId, authToken);
    
    if (!store) {
      throw new Error('Store not found');
    }
    return {
      name: store.name,
      shopUrl: store.shopUrl,
      APIToken: store.APIToken,
      APIKey: store.APIKey,
      APISecretKey: store.APISecretKey,
      apiVersion: '2025-04'
    };
  } catch (error) {
    console.error('Error fetching store credentials:', error);
    throw error;
  }
}