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

export function createApolloClient(shopId, shopUrl, accessToken, authToken) {
  const backendLink = new HttpLink({
    uri: "/api/graphql",
  });

  const shopifyLink = new HttpLink({
    uri: `https://${shopUrl}/admin/api/2025-04/graphql.json`,
    headers: {
      "X-Shopify-Access-Token": accessToken,
    },
  });

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
