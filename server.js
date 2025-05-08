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

dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
  try {
    console.log("Starting server...");
    await connectDB();

    const server = new ApolloServer({
      schema,
      introspection: true,
      formatError: (error) => {
        console.error("GraphQL Error:", error);
        // Return formatted error to client
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

    console.log(`🚀 Server ready at ${url}graphql`);
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
}

startServer();