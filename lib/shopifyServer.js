import http from "http";

// Shopify API imports
import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/web-api";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from "@apollo/client";

const clients = {};

export function createApolloClient(shopId, authToken) {

  const client = new ApolloClient({
    link: new HttpLink({
      uri: `/shopify-proxy/${shopId}`,
      credentials: "same-origin",
      headers: {
        "Authorization": authToken
      }
    }), 
    cache: new InMemoryCache(),
  });
  return client;
}


export function getApolloClient(shopId, authToken) {
  console.log("clients: ", clients)
  if (!clients[shopId]) {
    clients[shopId] = createApolloClient(shopId, authToken)
  }
  return clients[shopId];
}
