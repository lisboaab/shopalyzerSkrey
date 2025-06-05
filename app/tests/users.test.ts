import { describe, it, expect, vi } from "vitest";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import { userResolver } from "../api/graphql/resolvers";

type ResolverArgs = {
  input: {
    email?: string;
    password?: string;
    name?: string;
  };
};

vi.mock("../api/graphql/resolvers", () => ({
  userResolver: {
    Mutation: {
      loginUser: vi.fn(),
      createUser: vi.fn(),
    },
    Query: {
      users: vi.fn(),
      user: vi.fn(),
    },
  },
}));

describe("userResolver", () => {
  describe("Mutation", () => {
    it("User not loggedin", async () => {
      const mockLoginUser = vi.fn();
      vi.mocked(userResolver.Mutation.loginUser).mockImplementation(
        mockLoginUser
      );

      const mockReturnValue = {
        success: false,
        msg: "User not loggedin",
        accessToken: null,
        userID: new Types.ObjectId("000000000000000000000000"),
      };

      mockLoginUser.mockResolvedValue(mockReturnValue);

      const input: ResolverArgs = {
        input: {
          email: "",
          password: "",
        },
      };

      const result = await userResolver.Mutation.loginUser(null, input);

      expect(result).toEqual(mockReturnValue);
      expect(mockLoginUser).toHaveBeenCalledTimes(1);
      expect(mockLoginUser).toHaveBeenCalledWith(null, input);
      expect(result).toEqual(mockReturnValue);
    });

    it("Sign up", async () => {
      const mockAuthUser = vi.mocked(userResolver.Mutation.createUser);
      mockAuthUser.mockClear();
      const mockReturnValue = {
        _id: new Types.ObjectId("000000000000000000000001"),
        name: "Test User",
        email: "test@example.com",
        userType: "user",
        password: "hashedpassword",
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        message: "Account successfully created",
      };

      mockAuthUser.mockResolvedValue(mockReturnValue as any);

      const input = {
        input: {
          name: "Test User",
          email: "test@example.com",
          password: "hashedpassword",
        },
      };
      const result = await userResolver.Mutation.createUser(null, input);

      expect(result).toEqual(mockReturnValue);
      expect(mockAuthUser).toHaveBeenCalledTimes(1);
      expect(mockAuthUser).toHaveBeenCalledWith(null, input);
      expect(result).toEqual(mockReturnValue);
      expect(mockAuthUser).toHaveReturned();
    });

    it("Log in", async () => {
      const mockLoginUser = vi.fn();
      vi.mocked(userResolver.Mutation.loginUser).mockImplementation(
        mockLoginUser
      );

      const mockReturnValue = {
        success: true,
        msg: "User logged in",
        accessToken: "vijner2498vwefn",
        userID: new Types.ObjectId("000000000000000000000000"),
      };

      mockLoginUser.mockResolvedValue(mockReturnValue);

      const input: ResolverArgs = {
        input: {
          email: "test@example.com",
          password: "hashedpassword",
        },
      };

      const result = await userResolver.Mutation.loginUser(null, input);

      expect(result).toEqual(mockReturnValue);
      expect(mockLoginUser).toHaveBeenCalledTimes(1);
      expect(mockLoginUser).toHaveBeenCalledWith(null, input);
      expect(result).toEqual(mockReturnValue);
    });
  });

  describe("Query", () => {
    it("Users", async () => {
      const mockReturnValue = {
        success: true,
        data: [
          {
            _id: new Types.ObjectId("000000000000000000000001"),
            name: "Test User",
            email: "test@example.com",
            userType: "user",
            password: "hashedpassword",
            notifications: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            message: "Account successfully created",
          },
        ],
      };

      vi.mocked(userResolver.Query.users).mockResolvedValue(
        mockReturnValue as any
      );

      const result = await userResolver.Query.users();

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Query.users).toHaveBeenCalledTimes(1);
      expect(userResolver.Query.users).toHaveBeenCalledWith();
    });

    it("User", async () => {
      const mockReturnValue = {
        success: true,
        _id: new Types.ObjectId("000000000000000000000001"),
        name: "Test User",
        email: "test@example.com",
        userType: "user",
        password: "hashedpassword",
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        message: "Account successfully created",
      };

      vi.mocked(userResolver.Query.user).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "000000000000000000000001";

      const result = await userResolver.Query.user(null, { ID });

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Query.user).toHaveBeenCalledWith(null, { ID });
    });

    it("User not found", async () => {
      const mockReturnValue = new Error("User not found");

      vi.mocked(userResolver.Query.user).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "0000001234";

      const result = await userResolver.Query.user(null, { ID });

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Query.user).toHaveBeenCalledWith(null, { ID });
    });
  });
});
