import { describe, it, expect, vi } from "vitest";
import { storeResolver } from "../api/graphql/resolvers";
import { GraphQLError } from 'graphql';

type ResolverArgs = {
  input: {
    id?: string;
    shopUrl?: string;
    APIKey?: string;
    name?: string;
    APIToken?: string;
    APISecretKey?: string;
  };
};

vi.mock("../api/graphql/resolvers", () => ({
  storeResolver: {
    Mutation: {
      createStore: vi.fn(),
      updateStore: vi.fn(),
      removeStore: vi.fn(),
    },
    Query: {
      stores: vi.fn(),
      store: vi.fn(),
    },
  },
}));

const mockContext = {
  user: {
    _id: "mock-user-id",
    userType: "admin",
  },
};

describe("storeResolver", () => {
  describe("Mutation", () => {
    it("Create store", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Store created",
        shopUrl: "myStore.mystore.shopify",
        APIKey: "123456789",
        APIToken: "123456789",
        APISecretKey: "123456789",
        name: "My store",
      };

      vi.mocked(storeResolver.Mutation.createStore).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          shopUrl: "myStore.mystore.shopify",
          APIKey: "123456789",
          APIToken: "123456789",
          APISecretKey: "123456789",
          name: "My store",
        },
      };

      const result = await storeResolver.Mutation.createStore(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Mutation.createStore).toHaveBeenCalledTimes(1);
      expect(storeResolver.Mutation.createStore).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create store with API Key in use", async () => {
      const mockReturnValue = new GraphQLError('This API Key is already in use.');

      vi.mocked(storeResolver.Mutation.createStore).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          shopUrl: "myStore.mystore.shopify",
          APIKey: "123456789",
          APIToken: "123456789",
          APISecretKey: "123456789",
          name: "My store",
        },
      };

      const result = await storeResolver.Mutation.createStore(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Mutation.createStore).toHaveBeenCalledTimes(2);
      expect(storeResolver.Mutation.createStore).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create store with missing required fields", async () => {
      const mockReturnValue = new GraphQLError('Missing required fields: shopUrl, name, APIKey, APIToken, APISecretKey');

      vi.mocked(storeResolver.Mutation.createStore).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          shopUrl: "myStore.mystore.shopify",
          name: "My store",
        },
      };

      const result = await storeResolver.Mutation.createStore(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Mutation.createStore).toHaveBeenCalledTimes(3);
      expect(storeResolver.Mutation.createStore).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Update store", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Store updated",
        id: "1234",
        shopUrl: "myStore123.mystore.shopify",
        APIKey: "123456789",
        APIToken: "123456789",
        APISecretKey: "123456789",
        name: "My store 123",
      };

      vi.mocked(storeResolver.Mutation.updateStore).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "1234",
        input: {
          shopUrl: "myStore123.mystore.shopify",
          APIKey: "123456789",
          APIToken: "123456789",
          APISecretKey: "123456789",
          name: "My store 123",
        },
      };

      const result = await storeResolver.Mutation.updateStore(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Mutation.updateStore).toHaveBeenCalledTimes(1);
      expect(storeResolver.Mutation.updateStore).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Remove store", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Store removed",
      };

      vi.mocked(storeResolver.Mutation.removeStore).mockResolvedValue(
        mockReturnValue as any
      );

      const id = "1234";

      const result = await storeResolver.Mutation.removeStore(
        null,
        { id },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Mutation.removeStore).toHaveBeenCalledTimes(1);
      expect(storeResolver.Mutation.removeStore).toHaveBeenCalledWith(
        null,
        { id },
        mockContext
      );
    });
  });

  describe("Query", () => {
    it("Stores", async () => {
      const mockReturnValue = {
        success: true,
        data: [
          {
            id: "1234",
            shopUrl: "myStore.mystore.shopify",
            APIKey: "123456789",
            APIToken: "123456789",
            APISecretKey: "123456789",
            name: "My store",
          },
        ],
      };

      vi.mocked(storeResolver.Query.stores).mockResolvedValue(
        mockReturnValue as any
      );

      const result = await storeResolver.Query.stores(mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Query.stores).toHaveBeenCalledTimes(1);
      expect(storeResolver.Query.stores).toHaveBeenCalledWith(mockContext);
    });

    it("Store", async () => {
      const mockReturnValue = {
        success: true,
        id: "1234",
        shopUrl: "myStore123.mystore.shopify",
        APIKey: "123456789",
        APIToken: "123456789",
        APISecretKey: "123456789",
        name: "My store 123",
      };

      vi.mocked(storeResolver.Query.store).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "1234";

      const result = await storeResolver.Query.store(null, { ID }, mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Query.store).toHaveBeenCalledWith(null, { ID }, mockContext);
    });

    it("Store not found", async () => {
      const mockReturnValue = new Error('Store not found');

      vi.mocked(storeResolver.Query.store).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "123456";

      const result = await storeResolver.Query.store(null, { ID }, mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(storeResolver.Query.store).toHaveBeenCalledWith(null, { ID }, mockContext);
    });
  });
});
