import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import connectDB from "./app/config/db.js";
import dotenv from "dotenv";
import typeDefs from "./app/api/graphql/schema.js";
import resolvers from "./app/api/graphql/resolvers.js";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

dotenv.config();

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch {
    return null;
  }
};

async function startServer() {
  try {
    console.log("Starting server...");
    await connectDB();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 3001 },
    });

    console.log(`🚀 Server ready at ${url}api/graphql`);
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
}

startServer();