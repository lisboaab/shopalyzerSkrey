import { describe, it, expect, vi } from "vitest";
import { searchResolver } from "../api/graphql/resolvers";
import { GraphQLError } from "graphql";

type ResolverArgs = {
  input: {
    id?: string;
    metrics?: any[];
    name?: string;
    store?: string;
    timePeriod?: string;
    userID?: string;
    isSaved: boolean;
    metricsGroup?: string;
  };
};

vi.mock("../api/graphql/resolvers", () => ({
  searchResolver: {
    Mutation: {
      createSearch: vi.fn(),
      updateSearch: vi.fn(),
      removeSearch: vi.fn(),
    },
    Query: {
      searches: vi.fn(),
      search: vi.fn(),
    },
  },
}));

const mockContext = {
  user: {
    _id: "mock-user-id",
    userType: "admin",
  },
};

describe("searchResolver", () => {
  describe("Mutation", () => {
    it("Create search", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Search created",
        id: "1234",
        metrics: [
          {
            id: "1234",
            description: "This is a description",
            graphType: "bar",
            name: "Metric 01",
            status: "active",
          },
        ],
        name: "Search 01",
        isSaved: false,
        timePeriod: "25062025-27062025",
        userID: "00000012345",
        metricsGroup: "idOfTheMetricsGroup",
        store: "idOfTheStore",
      };

      vi.mocked(searchResolver.Mutation.createSearch).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          metrics: [
            {
              id: "1234",
              description: "This is a description",
              graphType: "bar",
              name: "Metric 01",
              status: "active",
            },
          ],
          name: "Search 01",
          isSaved: false,
          timePeriod: "25062025-27062025",
          userID: "00000012345",
          metricsGroup: "idOfTheMetricsGroup",
          store: "idOfTheStore",
        },
      };

      const result = await searchResolver.Mutation.createSearch(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Mutation.createSearch).toHaveBeenCalledTimes(1);
      expect(searchResolver.Mutation.createSearch).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create search with missing required fields", async () => {
      const mockReturnValue = new GraphQLError(
        "Missing required fields: store (the ID), metrics list or group, timePeriod and userID"
      );

      vi.mocked(searchResolver.Mutation.createSearch).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          metrics: [],
          name: "Search 01",
          isSaved: false,
        },
      };

      const result = await searchResolver.Mutation.createSearch(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Mutation.createSearch).toHaveBeenCalledTimes(2);
      expect(searchResolver.Mutation.createSearch).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create search with non existent store", async () => {
      const mockReturnValue = new GraphQLError(
        "Store not found"
      );

      vi.mocked(searchResolver.Mutation.createSearch).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          metrics: [
            {
              id: "1234",
              description: "This is a description",
              graphType: "bar",
              name: "Metric 01",
              status: "active",
            },
          ],
          name: "Search 01",
          isSaved: false,
          timePeriod: "25062025-27062025",
          userID: "00000012345",
          metricsGroup: "idOfTheMetricsGroup",
          store: "idOfNonExistentStore",
        },
      };

      const result = await searchResolver.Mutation.createSearch(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Mutation.createSearch).toHaveBeenCalledTimes(3);
      expect(searchResolver.Mutation.createSearch).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Update search", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Search updated",
        id: "1234",
        metrics: [
          {
            id: "1234",
            description: "This is a description",
            graphType: "bar",
            name: "Metric 01",
            status: "active",
          },
        ],
        name: "New search name",
        isSaved: true,
        timePeriod: "25062025-27062025",
        userID: "00000012345",
        metricsGroup: "idOfTheMetricsGroup",
        store: "idOfTheStore",
      };

      vi.mocked(searchResolver.Mutation.updateSearch).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "1234",
        input: {
          isSaved: true,
        },
      };

      const result = await searchResolver.Mutation.updateSearch(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Mutation.updateSearch).toHaveBeenCalledTimes(1);
      expect(searchResolver.Mutation.updateSearch).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Remove search", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Search removed",
      };

      vi.mocked(searchResolver.Mutation.removeSearch).mockResolvedValue(
        mockReturnValue as any
      );

      const id = "1234";

      const result = await searchResolver.Mutation.removeSearch(
        null,
        { id },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Mutation.removeSearch).toHaveBeenCalledTimes(1);
      expect(searchResolver.Mutation.removeSearch).toHaveBeenCalledWith(
        null,
        { id },
        mockContext
      );
      expect(searchResolver.Mutation.removeSearch).toHaveReturned();
    });
  });

  describe("Query", () => {
    it("Searches", async () => {
      const mockReturnValue = {
        success: true,
        data: [
          {
            id: "1234",
            metrics: [
              {
                id: "1234",
                description: "This is a description",
                graphType: "bar",
                name: "Metric 01",
                status: "active",
              },
            ],
            name: "Search 01",
            isSaved: false,
            timePeriod: "25062025-27062025",
            userID: "00000012345",
            metricsGroup: "idOfTheMetricsGroup",
            store: "idOfTheStore",
          },
        ],
      };

      vi.mocked(searchResolver.Query.searches).mockResolvedValue(
        mockReturnValue as any
      );

      const result = await searchResolver.Query.searches(mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Query.searches).toHaveBeenCalledTimes(1);
      expect(searchResolver.Query.searches).toHaveBeenCalledWith(mockContext);
    });

    it("Search", async () => {
      const mockReturnValue = {
        success: true,
        id: "1234",
        metrics: [
          {
            id: "1234",
            description: "This is a description",
            graphType: "bar",
            name: "Metric 01",
            status: "active",
          },
        ],
        name: "Search 01",
        isSaved: false,
        timePeriod: "25062025-27062025",
        userID: "00000012345",
        metricsGroup: "idOfTheMetricsGroup",
        store: "idOfTheStore",
      };

      vi.mocked(searchResolver.Query.search).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "1234";

      const result = await searchResolver.Query.search(
        null,
        {
          ID,
        },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Query.search).toHaveBeenCalledWith(
        null,
        {
          ID,
        },
        mockContext
      );
    });

    it("User searches", async () => {
      const mockReturnValue = {
        success: true,
        userID: "12345678",
        data: [
          {
            id: "1234",
            metrics: [
              {
                id: "1234",
                description: "This is a description",
                graphType: "bar",
                name: "Metric 01",
                status: "active",
              },
            ],
            name: "Search 01",
            isSaved: false,
            timePeriod: "25062025-27062025",
            userID: "00000012345",
            metricsGroup: "idOfTheMetricsGroup",
            store: "idOfTheStore",
          },
        ],
      };

      vi.mocked(searchResolver.Query.search).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "12345678";

      const result = await searchResolver.Query.search(
        null,
        {
          ID,
        },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Query.search).toHaveBeenCalledWith(
        null,
        {
          ID,
        },
        mockContext
      );
    });

    it("Search not found", async () => {
      const mockReturnValue = new Error("Search not found");

      vi.mocked(searchResolver.Query.search).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "123456";

      const result = await searchResolver.Query.search(
        null,
        {
          ID,
        },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(searchResolver.Query.search).toHaveBeenCalledWith(
        null,
        {
          ID,
        },
        mockContext
      );
    });
  });
});
