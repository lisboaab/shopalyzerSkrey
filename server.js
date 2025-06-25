import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import bcrypt from "bcryptjs";

import connectDB from "./app/config/db.js";
import dotenv from "dotenv";
import { typeDefs } from "./app/api/graphql/schema.js";
import { resolvers } from "./app/api/graphql/resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import User from "./app/api/models/users.model.js";
import Group from "./app/api/models/group.model.js";
import Metric from "./app/api/models/metric.model.js";
import jwt from "jsonwebtoken";
import dbConfig from "./app/config/db.config.js";

// Shopify API imports
import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/web-api";

// Ngrok imports
import { connect } from "@ngrok/ngrok";

dotenv.config();

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Metrics list supported by the app
const metricsList = [
  {
    name: "Total orders",
    graphType: "card",
    description: "The total number of orders",
    status: "active"
  },
  {
    name: "Total revenue",
    graphType: "card",
    description: "The total revenue generated from all orders",
    status: "active"
  },
  {
    name: "Total discount",
    graphType: "card",
    description: "The total amount of discounts applied to orders",
    status: "active"
  },
  {
    name: "Average order value",
    graphType: "card",
    description: "The average value of purchases per order",
    status: "active"
  },
 {
    name: "Total tax per region",
    graphType: "bar",
    description: "Total tax amount grouped by region or country",
    status: "active"
  },
  {
    name: "Conversion rate",
    graphType: "card",
    description: "The percentage of customers who complete a purchase",
    status: "active"
  },
  {
    name: "Top products",
    graphType: "donut",
    description: "The best-selling products ranked by quantity or revenue",
    status: "active"
  },
 {
    name: "Top categories",
    graphType: "donut",
    description: "The best-performing product categories by sales volume",
    status: "active"
  },
 {
    name: "Conversion rate over time",
    graphType: "line",
    description: "The percentage of customers who complete a purchase over time",
    status: "active"
  },
  {
    name: "Orders by location",
    graphType: "donut",
    description: "Customers per country",
    status: "active"
  },
  {
    name: "Average shipping value",
    graphType: "card",
    description: "Average shipping value",
    status: "active"
  },
  {
    name: "Average order quantity",
    graphType: "card",
    description: "Average items per order",
    status: "active"
  },
  {
    name: "Total refund",
    graphType: "card",
    description: "Total refund value",
    status: "active"
  },
  {
    name: "Refund rate",
    graphType: "card",
    description: "Refund rate",
    status: "active"
  },
  {
    name: "Return rate",
    graphType: "card",
    description: "Percentage of the orders which includes a returned item",
    status: "active"
  },
 {
    name: "Orders over time",
    graphType: "bar",
    description: "Quantity of orders over the given time period",
    status: "active"
  },
]

// Function to create a default admin user
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ userType: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123", 10);

      const admin = new User({
        name: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        userType: "admin",
        notifications: false,
        cloudinaryID: "0",
      });

      await admin.save();
      console.log("________________________");
      console.log("✅ Admin User was created!");
      console.log("Email: admin@email.com");
      console.log("Password: 123");
      console.log("________________________");
    } else {
      console.log("✅ Admin user already exists in the database");
    }
  } catch (error) {
    console.error("❌ Error while creating the admin user:", error);
  }
}

// Function to create a "custom" metric group
async function createCustomMetriGroup() {
  try {
    const groupExists = await Group.findOne({ name: "Custom" });

    if (!groupExists) {
      const adminExists = await User.findOne({ userType: "admin" });

      const customGroup = new Group({
        name: "Custom",
        icon: "pencil",
        metrics: [],
        status: "active",
        createdBy: adminExists._id,
      });

      await customGroup.save();
      console.log("________________________");
      console.log("✅ Custom Group was created!");
      console.log("________________________");
    } else {
      console.log("✅ Custom Group already exists in the database");
    }
  } catch (error) {
    console.error("❌ Error while creating the Custom Group:", error);
  }
}

// Function to add the metrics that the app accepts
async function createMetrics() {
  try {
    metricsList.map(async (metric) => {
      const metricExists = await Metric.findOne({ name: metric.name });
      if (!metricExists) {
        const newMetric = new Metric({
          name: metric.name,
          graphType: metric.graphType,
          description: metric.description,
          status: metric.status,
        });

        await newMetric.save();
      }
    });
    console.log("✅ Metrics added!");
  } catch (error) {
    console.error("❌ Error while creating Metrics:", error);
  }
}

async function startServer() {
  try {
    console.log("Starting server...");
    await connectDB();
    await createDefaultAdmin();
    await createCustomMetriGroup();
    await createMetrics()

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
        const token = req.headers.authorization || "";
        if (!token) return { user: null };

        try {
          const cleanToken = token.replace("Bearer ", "");
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

    // Setup Ngrok tunnel
    const listener = await connect({
      addr: 3000,
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: "rattler-equipped-monthly.ngrok-free.app",
    });
    console.log(`🚧 Ngrok tunnel established at: ${listener.url()}`);

    console.log(`🚀 Apollo Server ready at ${url}graphql`);
    console.log(
      `🚀 Apollo Sandbox is running at https://studio.apollographql.com/sandbox/explorer`
    );
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
}

startServer();