import User from "../models/users.model.js";
import Store from "../models/stores.model.js";
import Metric from "../models/metric.model.js";
import Group from "../models/group.model.js";

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import dbConfig from "../../config/db.config.js";
import cloudinary from "../../config/cloudinary.js";

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    dbConfig.secret,
    { expiresIn: "48hr" }
  );
};

const userResolver = {
  Mutation: {
    createUser: async (_, { input }) => {
      if (Object.values(input).length == 0) {
        throw new GraphQLError(
          "You need to provide the body with the request.",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      if (!input.name || !input.email || !input.password) {
        throw new GraphQLError(
          "Missing required fields: name, email, password",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }
      const userFound = await User.findOne({ email: input.email });
      if (userFound) {
        throw new GraphQLError("This email is already in use.", {
          extensions: {
            code: "EMAIL_IN_USE",
          },
        });
      }

      const user = new User({
        name: input.name,
        email: input.email,
        password: bcrypt.hashSync(input.password, 10),
        cloudinaryID: 0,
        userType: "default",
        notifications: false,
      });

      const newUser = await user.save();

      return newUser;
    },
    loginUser: async (_, { input }) => {
      if (Object.values(input).length == 0) {
        throw new GraphQLError(
          "You need to provide the body with the request.",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      if (!input.email || !input.password) {
        throw new GraphQLError("Fields missing", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      const user = await User.findOne({ email: input.email });
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      }

      const check = bcrypt.compareSync(input.password, user.password);
      if (!check) {
        throw new GraphQLError("Wrong password", {
          extensions: {
            code: "WRONG_PASSWORD",
          },
        });
      }

      let token = generateToken(user);
      return {
        success: true,
        msg: "User logged in successfully.",
        accessToken: token,
        userID: user._id,
      };
    },
    updateUser: async (_, { id, input }) => {
      if (!id) {
        throw new GraphQLError("Missing user ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      const user = await User.findById(id);
      if (!user) throw new Error("User not found.");

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      const userEmail = await User.findOne({ email: input.email });
      if (userEmail && userEmail.id != id)
        throw new Error("Email already in use.");

      // handle profile picture upload to Cloudinary
      let user_image, profilePicture, cloudinaryID;
      if (input.profilePicture) {
        try {
          if (user.cloudinaryID && user.cloudinaryID !== "0") {
            await cloudinary.uploader.destroy(user.cloudinaryID);
          }
          let dataURI = input.profilePicture;
          if (!dataURI.startsWith("data:")) {
            dataURI = `data:image/jpeg;base64,${dataURI}`;
          }

          // Upload para o Cloudinary
          let result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
          });
          user_image = result;

          profilePicture = user_image.secure_url;
          cloudinaryID = user_image.public_id;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          throw new Error("Failed to upload photo to Cloudinary.");
        }
      }
      await User.findByIdAndUpdate(id, {
        name: input.name != null ? input.name : user.name,
        email: input.email != null ? input.email : user.email,
        notifications:
          input.notifications != null
            ? input.notifications
            : user.notifications,
        password:
          input.password != null
            ? bcrypt.hashSync(input.password, 10)
            : user.password,
        profilePicture:
          input.profilePicture != null ? profilePicture : user.profilePicture,
        cloudinaryID:
          input.profilePicture != null ? cloudinaryID : user.cloudinaryID,
        userType: input.userType != null ? input.userType : user.userType,
      });

      const updatedUser = await User.findById(id);

      return updatedUser;
    },
    removeUser: async (_, { id }) => {
      if (!id) {
        throw new GraphQLError("Missing user ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      const user = await User.findByIdAndDelete(id);
      if (!user) throw new Error("User not found.");

      return "User deleted successfully.";
    },
  },
  Query: {
    user: async (_, { ID }, context) => {
      try {
        if (!context.user) {
          throw new GraphQLError("Not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          });
        }
        // console.log('ID received in resolver:: ', ID)
        // const user = await User.findById(ID);
        // if (!user) {
        //   throw new Error("User not found");
        // }

        let user;

        try {
          user = await User.findById(ID);
        } catch (idError) {
          console.error("Error with findById:", idError);
          user = await User.findOne({ _id: ID });
        }

        if (!user) {
          console.error("User not found with ID:", ID);
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async (_, __, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      return await User.find();
    },
    userTypesList: () => {
      return ["admin", "default"];
    },
  },
};

const storeResolver = {
  Mutation: {
    createStore: async (_, { input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      if (Object.values(input).length == 0) {
        throw new GraphQLError(
          "You need to provide the body with the request.",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      if (!input.name || !input.APIKey || !input.APIToken) {
        throw new GraphQLError(
          "Missing required fields: name, APIKey, APIToken",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }
      const storeNameFound = await Store.findOne({ name: input.name });
      if (storeNameFound) {
        throw new GraphQLError("This name is already in use.", {
          extensions: {
            code: "NAME_IN_USE",
          },
        });
      }

      const storeAPIKeyFound = await Store.findOne({ APIKey: input.APIKey });
      if (storeAPIKeyFound) {
        throw new GraphQLError("This API Key is already in use.", {
          extensions: {
            code: "APIKEY_IN_USE",
          },
        });
      }

      const storeAPITokenFound = await Store.findOne({
        APIToken: input.APIToken,
      });
      if (storeAPITokenFound) {
        throw new GraphQLError("This API Token is already in use.", {
          extensions: {
            code: "APITOKEN_IN_USE",
          },
        });
      }

      if (input.createdBy) {
        const userFound = await User.findOne({ _id: input.createdBy });
        if (!userFound) {
          throw new GraphQLError("Created by - User not found", {
            extensions: {
              code: "USER_NOT_FOUND",
            },
          });
        }
      }

      const store = new Store({
        name: input.name,
        APIKey: input.APIKey,
        APIToken: input.APIToken,
        createdBy: input.createdBy ? input.createdBy : context.user._id,
        lastModifiedBy: input.createdBy ? input.createdBy : context.user._id,
      });

      const newStore = await store.save();

      return newStore;
    },
    updateStore: async (_, { id, input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      if (!id) {
        throw new GraphQLError("Missing store ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      const store = await Store.findById(id);
      if (!store) throw new Error("Store not found.");

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      const userFound = await User.findById(context.user._id);
      if (!userFound) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      }

      const storeName = await Store.findOne({ name: input.name });
      if (storeName && storeName.id != id)
        throw new Error("Store name already in use.");

      const storeAPIKey = await Store.findOne({ APIKey: input.APIKey });
      if (storeAPIKey && storeAPIKey.id != id)
        throw new Error("Store APIKey already in use.");

      const storeAPIToken = await Store.findOne({ APIToken: input.APIToken });
      if (storeAPIToken && storeAPIToken.id != id)
        throw new Error("Store APIToken already in use.");

      await Store.findByIdAndUpdate(id, {
        name: input.name != null ? input.name : store.name,
        APIKey: input.APIKey != null ? input.APIKey : store.APIKey,
        APIToken: input.APIToken != null ? input.APIToken : store.APIToken,
        lastModifiedBy: context.user,
      });

      const updatedStore = await Store.findById(id);

      return updatedStore;
    },
    removeStore: async (_, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      if (!id) {
        throw new GraphQLError("Missing store ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      const store = await Store.findByIdAndDelete(id);
      if (!store) throw new Error("Store not found.");

      return "Store deleted successfully.";
    },
  },
  Query: {
    store: async (_, { ID }) => {
      try {
        const store = await Store.findById(ID)
          .populate("createdBy")
          .populate("lastModifiedBy");
        if (!store) {
          throw new Error("Store not found");
        }
        return store;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch store");
      }
    },
    stores: async () =>
      await Store.find().populate("createdBy").populate("lastModifiedBy"),
  },
};
const VALID_GRAPH_TYPES = ["bar", "line", "pie", "donut", "card"];
const metricResolver = {
  Mutation: {
    createMetric: async (_, { input }) => {
      if (Object.values(input).length == 0) {
        throw new GraphQLError(
          "You need to provide the body with the request.",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      if (!input.name || !input.description || !input.graphType) {
        throw new GraphQLError(
          "Missing required fields: name, description, graphType",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      const metricName = await Metric.findOne({ name: input.name });
      if (metricName) {
        throw new GraphQLError("This metric already exists", {
          extensions: {
            code: "METRIC_ALREADY_EXISTS",
          },
        });
      }

      if (!VALID_GRAPH_TYPES.includes(input.graphType)) {
        throw new GraphQLError(
          `Invalid graph type: ${input.graphType}. Try one of these: ${VALID_GRAPH_TYPES}`,
          {
            extensions: {
              code: "INVALID_GRAPH_TYPE",
              validTypes: VALID_GRAPH_TYPES,
            },
          }
        );
      }

      let status 
      if(input.status){
        status = input.status
      } else {
        status = "active"
      }

      const metric = new Metric({
        name: input.name,
        description: input.description,
        graphType: input.graphType,
        status: status,
      });

      const newMetric = await metric.save();

      return newMetric;
    },
    removeMetric: async (_, { id }) => {
      if (!id) {
        throw new GraphQLError("Missing metric ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      const metric = await Metric.findByIdAndDelete(id);
      if (!metric) throw new Error("Metric not found.");

      return "Metric deleted successfully.";
    },
    updateMetric: async (_, { id, input }) => {
      if (!id) {
        throw new GraphQLError("Missing metric ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }
      const metric = await Metric.findById(id);
      if (!metric) throw new Error("Metric not found.");

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      if (input.name) {
        const metricName = await Metric.findOne({ name: input.name });
        if (metricName && metricName.id != id)
          throw new Error("Metric name already in use.");
      }

      if (input.graphType && !VALID_GRAPH_TYPES.includes(input.graphType)) {
        throw new GraphQLError(
          `Invalid graph type: ${input.graphType}. Try one of these: ${VALID_GRAPH_TYPES}`,
          {
            extensions: {
              code: "INVALID_GRAPH_TYPE",
              validTypes: VALID_GRAPH_TYPES,
            },
          }
        );
      }

      if (
        input.status &&
        input.status !== "active" &&
        input.status !== "inactive"
      ) {
        throw new Error("Status can only be active or inactive");
      }

      await Metric.findByIdAndUpdate(id, {
        name: input.name != null ? input.name : metric.name,
        description:
          input.description != null ? input.description : metric.description,
        grapthType:
          input.grapthType != null ? input.grapthType : metric.grapthType,
        status: input.status != null ? input.status : metric.status,
      });

      const updatedMetric = await Metric.findById(id);

      return updatedMetric;
    },
  },
  Query: {
    metrics: async () => await Metric.find(),
    metric: async (_, { ID }) => {
      try {
        const metric = await Metric.findById(ID);
        if (!metric) {
          throw new Error("Metric not found");
        }
        return metric;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch metric");
      }
    },
  },
};

const metricsGroupResolver = {
  Mutation: {
    createGroup: async (_, { input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      if (Object.values(input).length == 0) {
        throw new GraphQLError(
          "You need to provide the body with the request.",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      if (!input.name || !input.metrics || input.name === "" || input.metrics.lenght === 0 || input.name === " " ) {
        throw new GraphQLError(
          "Missing required fields: name, icon, and the metrics list",
          {
            extensions: {
              code: "FIELDS_MISSING",
            },
          }
        );
      }

      const groupName = await Group.findOne({ name: input.name });
      if (groupName) {
        throw new GraphQLError("This group name already exists", {
          extensions: {
            code: "GROUP_ALREADY_EXISTS",
          },
        });
      }

      input.metrics.forEach((m) => {
        const found = Metric.findById(m);
        if (!found) {
          throw new GraphQLError(`Could not find metric with ID ${m}`, {
            extensions: {
              code: "METRIC_NOT_FOUND",
            },
          });
        }
      });

      if(input.createdBy) {
        const found = User.findById(input.createdBy)
        if(!found){
          throw new GraphQLError("User not found", {
            extensions: {
              code: "USER_NOT_FOUND",
            },
          });
        }
      }

      let icon
      if(input.icon){
        icon = input.icon
      } else {
        icon = ""
      }

      let status 
      if(input.status){
        status = input.status
      } else {
        status = "active"
      }

      const group = new Group({
        name: input.name,
        status: status,
        createdBy: input.createdBy ? input.createdBy : context.user._id,
        icon: icon,
        metrics: input.metrics,
      });

      const newGroup = await group.save();

      return newGroup.populate("metrics"); 
    },
    removeGroup: async (_, { id }) => {
      if (!id) {
        throw new GraphQLError("Missing group ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      const group = await Group.findByIdAndDelete(id);
      if (!group) throw new Error("Group not found.");

      return "Group deleted successfully.";
    },
    updateGroup: async (_, { id, input }) => {
      if (!id) {
        throw new GraphQLError("Missing group ID", {
          extensions: {
            code: "FIELDS_MISSING",
          },
        });
      }
      const group = await Group.findById(id);
      if (!group) throw new Error("Group not found.");

      if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID.");

      if (input.name) {
        const groupName = await Group.findOne({ name: input.name });
        if (groupName && groupName.id != id)
          throw new Error("Group name already in use.");
      }

      if(input.metrics){
        input.metrics.forEach((m) => {
          const found = Metric.findById(m);
          if (!found) {
            throw new GraphQLError(`Could not find metric with ID ${m}`, {
              extensions: {
                code: "METRIC_NOT_FOUND",
              },
            });
          }
        });
      }

      if (
        input.status &&
        input.status !== "active" &&
        input.status !== "inactive"
      ) {
        throw new Error("Status can only be active or inactive");
      }

      await Group.findByIdAndUpdate(id, {
        name: input.name != null ? input.name : group.name,
        icon:
          input.icon != null ? input.icon : group.icon,
        metrics:
          input.metrics != null ? input.metrics : group.metrics,
        status: input.status != null ? input.status : group.status,
        icon: input.icon != null ? input.icon : group.icon,
      });

      const updatedGroup = await Group.findById(id).populate("createdBy");

      return updatedGroup;
    },
  },
  Query: {
    groups: async () => await Group.find().populate("createdBy").populate("metrics"),
    group: async (_, { ID }) => {
      try {
        const group = await Group.findById(ID).populate("createdBy").populate("metrics");
        if (!group) {
          throw new Error("Group not found");
        }
        return group;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch group");
      }
    },
  },
};

import { mergeResolvers } from "@graphql-tools/merge";
export const resolvers = mergeResolvers([
  userResolver,
  storeResolver,
  metricResolver,
  metricsGroupResolver,
]);
