import User from "../models/users.model.js";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dbConfig from "../../config/db.config.js";
import express from "express";
import cors from "cors";
import cloudinary from "../../config/cloudinary.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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
    user: async (_, { ID }) => {
      try {
        const user = await User.findById(ID);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async () => await User.find(),
  },
};

export default userResolver;
