import http from "http";

// Shopify API imports
import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/web-api";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
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

  const routingLink = new ApolloLink((operation, forward) => {
    const context = operation.getContext();
    const isShopifyOperation = context.clientName === "shopify";

    return forward(operation);
  }).split(
    (operation) => operation.getContext().clientName === "shopify",
    shopifyLink,
    backendLink
  );
  const client = new ApolloClient({
    link: new HttpLink({
      uri: `/shopify-proxy/${shopId}`,
      credentials: "same-origin",
      headers: {
        "Authorization": authToken
      }
    }), 
    // add aqui o autorization header da route
    cache: new InMemoryCache(),
  });
  return client;
}
