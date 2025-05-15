import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectDB from "./app/config/db.js";
import dotenv from "dotenv";
import { typeDefs } from "./app/api/graphql/schema.js";
import { resolvers } from "./app/api/graphql/resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import User from "./app/api/models/users.model.js";
import jwt from "jsonwebtoken";
import dbConfig from "./app/config/db.config.js";

// Shopify API imports
import '@shopify/shopify-api/adapters/node';
import '@shopify/shopify-api/adapters/cf-worker';
import '@shopify/shopify-api/adapters/web-api';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

// Ngrok imports
import http from 'http';
import { connect } from '@ngrok/ngrok';

dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });

// const shopify = shopifyApi({
//   apiKey: process.env.S_API_KEY,
//   adminApiAccessToken: process.env.S_ACCESS_TOKEN,
//   apiSecretKey: process.env.S_API_SECRET,
//   scopes: ['read_orders', 'read_products'],
//   hostName: process.env.S_NAME,
//   apiVersion: LATEST_API_VERSION,
//   isCustomStoreApp: true,
// });

async function startServer() {
  try {
    console.log("Starting server...");
    await connectDB();

    const server = new ApolloServer({
      schema,
      introspection: true,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        return {
          message: error.message,
          extensions: error.extensions,
        };
      },
    });

    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        if (!token) return { user: null };
        
        try {
          const cleanToken = token.replace('Bearer ', '');
          const decoded = jwt.verify(cleanToken, dbConfig.secret);
          const user = await User.findById(decoded.id);
          return { user };
        } catch (err) {
          console.error("Authentication error:", err.message);
          return { user: null };
        }
      },
      listen: { port: 3001 },
    });

     // Create webserver with Shopify endpoints
    //  const app = http.createServer(async (req, res) => {
    //   if (req.url === '/') {
    //     res.writeHead(200);
    //     res.end('Tunnel funcionando!');
    //     return;
    //   }
    //   if (req.url === '/orders') {
    //     try {
    //       const client = new shopify.clients.Rest({
    //         session: {
    //           shop: process.env.S_NAME,
    //           accessToken: process.env.S_ACCESS_TOKEN,
    //         }
    //       });
    //       const response = await client.get({
    //         path: 'orders',
    //         query: {
    //           status: 'any',
    //           limit: 50,
    //           fields: 'id,order_number,created_at,total_price'
    //         }
    //       });
    
    //       res.writeHead(200, { 'Content-Type': 'application/json' });
    //       res.end(JSON.stringify(response.body));
    //     } catch (error) {
    //       res.writeHead(500, { 'Content-Type': 'application/json' });
    //       res.end(JSON.stringify({ error: error.message }));
    //     }
    //   } else {
    //     res.writeHead(404);
    //     res.end('No URL given');
    //   }
    // }).listen(8080, () => console.log('Node.js web server at 8080 is running...'));

    // Setup Ngrok tunnel
    const listener = await connect({
      addr: 3000,
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: "rattler-equipped-monthly.ngrok-free.app"
    });
    console.log(`🚧 Ngrok tunnel established at: ${listener.url()}`);

    console.log(`🚀 Apollo Server ready at ${url}graphql`);
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
}

startServer();