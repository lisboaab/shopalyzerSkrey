import { describe, it, expect, vi } from "vitest";
import { metricResolver } from "../api/graphql/resolvers";
import { GraphQLError } from "graphql";

type ResolverArgs = {
  input: {
    id?: string;
    description?: string;
    graphType?: string;
    name?: string;
    status?: string;
  };
};

vi.mock("../api/graphql/resolvers", () => ({
  metricResolver: {
    Mutation: {
      createMetric: vi.fn(),
      updateMetric: vi.fn(),
      removeMetric: vi.fn(),
    },
    Query: {
      metrics: vi.fn(),
      metric: vi.fn(),
    },
  },
}));

const mockContext = {
  user: {
    _id: "mock-user-id",
    userType: "admin",
  },
};

describe("metricResolver", () => {
  describe("Mutation", () => {
    it("Create metric", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Metric created",
        description: "This is a description",
        graphType: "bar",
        name: "Metric 01",
        status: "active",
      };

      vi.mocked(metricResolver.Mutation.createMetric).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          description: "This is a description",
          graphType: "bar",
          name: "Metric 01",
          status: "active",
        },
      };

      const result = await metricResolver.Mutation.createMetric(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Mutation.createMetric).toHaveBeenCalledTimes(1);
      expect(metricResolver.Mutation.createMetric).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create metric with invalid graph type", async () => {
      const mockReturnValue = new GraphQLError(
        'Invalid graph type. Try one of these: "bar", "line", "pie", "donut", "card", "list"'
      );

      vi.mocked(metricResolver.Mutation.createMetric).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          description: "This is a description",
          graphType: "barGraph",
          name: "Metric 01",
          status: "active",
        },
      };

      const result = await metricResolver.Mutation.createMetric(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Mutation.createMetric).toHaveBeenCalledTimes(2);
      expect(metricResolver.Mutation.createMetric).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create metric with missing required fields", async () => {
      const mockReturnValue = new GraphQLError(
        "Missing required fields: name, description, graphType"
      );

      vi.mocked(metricResolver.Mutation.createMetric).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          graphType: "bar",
          name: "Metric 01",
        },
      };

      const result = await metricResolver.Mutation.createMetric(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Mutation.createMetric).toHaveBeenCalledTimes(3);
      expect(metricResolver.Mutation.createMetric).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Update metric", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Metric updated",
        description: "This is a new description",
        graphType: "bar",
        name: "Metric 01",
        status: "active",
      };

      vi.mocked(metricResolver.Mutation.updateMetric).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "1234",
        input: {
          description: "This is a new description",
        },
      };

      const result = await metricResolver.Mutation.updateMetric(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Mutation.updateMetric).toHaveBeenCalledTimes(1);
      expect(metricResolver.Mutation.updateMetric).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Remove metric", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Metric removed",
      };

      vi.mocked(metricResolver.Mutation.removeMetric).mockResolvedValue(
        mockReturnValue as any
      );

      const id = "1234";

      const result = await metricResolver.Mutation.removeMetric(
        null,
        { id },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Mutation.removeMetric).toHaveBeenCalledTimes(1);
      expect(metricResolver.Mutation.removeMetric).toHaveBeenCalledWith(
        null,
        { id },
        mockContext
      );
    });
  });

  describe("Query", () => {
    it("Metrics", async () => {
      const mockReturnValue = {
        success: true,
        data: [
          {
            id: "1234",
            description: "This is a new description",
            graphType: "bar",
            name: "Metric 01",
            status: "active",
          },
        ],
      };

      vi.mocked(metricResolver.Query.metrics).mockResolvedValue(
        mockReturnValue as any
      );

      const result = await metricResolver.Query.metrics(mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Query.metrics).toHaveBeenCalledTimes(1);
      expect(metricResolver.Query.metrics).toHaveBeenCalledWith(mockContext);
    });

    it("Metric", async () => {
      const mockReturnValue = {
        success: true,
        id: "1234",
        description: "This is a new description",
        graphType: "bar",
        name: "Metric 01",
        status: "active",
      };

      vi.mocked(metricResolver.Query.metric).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "1234";

      const result = await metricResolver.Query.metric(null, { ID }, mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Query.metric).toHaveBeenCalledWith(null, { ID }, mockContext);
    });

    it("Metric not found", async () => {
      const mockReturnValue = new Error("Metric not found");

      vi.mocked(metricResolver.Query.metric).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "123456";

      const result = await metricResolver.Query.metric(null, { ID }, mockContext);

      expect(result).toEqual(mockReturnValue);
      expect(metricResolver.Query.metric).toHaveBeenCalledWith(null, { ID }, mockContext);
    });
  });
});
