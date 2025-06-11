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
      updateUser: vi.fn(),
      removeUser: vi.fn(),
    },
    Query: {
      users: vi.fn(),
      user: vi.fn(),
    },
  },
}));

const mockContext = {
  user: {
    _id: "000000000000000000000001",
    userType: "admin",
  },
};

describe("userResolver", () => {
  describe("Mutation", () => {
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

    it("Sign up with existing email", async () => {
      const mockAuthUser = vi.mocked(userResolver.Mutation.createUser);
      mockAuthUser.mockClear();
      const mockReturnValue = new GraphQLError("This email is already in use.");
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

    it("Log in with wrong password", async () => {
      const mockLoginUser = vi.fn();
      vi.mocked(userResolver.Mutation.loginUser).mockImplementation(
        mockLoginUser
      );

      const mockReturnValue = new GraphQLError("Wrong password");

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

    it("Update user", async () => {
      const mockReturnValue = {
        _id: new Types.ObjectId("000000000000000000000001"),
        name: "Test User New Name",
        email: "test@example.com",
        userType: "user",
        password: "hashedpassword",
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(userResolver.Mutation.updateUser).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "000000000000000000000001",
        input: {
          name: "Test User New Name",
        },
      };

      const result = await userResolver.Mutation.updateUser(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Mutation.updateUser).toHaveBeenCalledTimes(1);
      expect(userResolver.Mutation.updateUser).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Update user with existing email", async () => {
      const mockReturnValue = new Error("Email already in use.");

      vi.mocked(userResolver.Mutation.updateUser).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "000000000000000000000001",
        input: {
          email: "emailInUse@gmail.com",
        },
      };

      const result = await userResolver.Mutation.updateUser(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Mutation.updateUser).toHaveBeenCalledTimes(2);
      expect(userResolver.Mutation.updateUser).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Remove user", async () => {
      const mockReturnValue = {
        success: true,
        msg: "User removed",
      };

      vi.mocked(userResolver.Mutation.removeUser).mockResolvedValue(
        mockReturnValue as any
      );

      const id = "000000000000000000000001";

      const result = await userResolver.Mutation.removeUser(
        null,
        { id },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Mutation.removeUser).toHaveBeenCalledTimes(1);
      expect(userResolver.Mutation.removeUser).toHaveBeenCalledWith(
        null,
        { id },
        mockContext
      );
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

    it("Users list without permission", async () => {
      const mockReturnValue = new GraphQLError("Forbidden access");

      vi.mocked(userResolver.Query.users).mockResolvedValue(
        mockReturnValue as any
      );

      const result = await userResolver.Query.users();

      expect(result).toEqual(mockReturnValue);
      expect(userResolver.Query.users).toHaveBeenCalledTimes(2);
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
