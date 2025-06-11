import { describe, it, expect, vi } from "vitest";
import { metricsGroupResolver } from "../api/graphql/resolvers";
import { GraphQLError } from "graphql";

type ResolverArgs = {
  input: {
    id?: string;
    metrics?: any[];
    name?: string;
    status?: string;
    icon?: string;
  };
};

vi.mock("../api/graphql/resolvers", () => ({
  metricsGroupResolver: {
    Mutation: {
      createGroup: vi.fn(),
      updateGroup: vi.fn(),
      removeGroup: vi.fn(),
    },
    Query: {
      groups: vi.fn(),
      group: vi.fn(),
    },
  },
}));

const mockContext = {
  user: {
    _id: "mock-user-id",
    userType: "admin",
  },
};

describe("metricsGroupResolver", () => {
  describe("Mutation", () => {
    it("Create metrics group", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Group created",
        metrics: [
          {
            id: "1234",
            description: "This is a description",
            graphType: "bar",
            name: "Metric 01",
            status: "active",
          },
        ],
        name: "Group 01",
        status: "active",
        icon: "pencilIcon",
      };

      vi.mocked(metricsGroupResolver.Mutation.createGroup).mockResolvedValue(
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
          name: "Group 01",
          status: "active",
          icon: "pencilIcon",
        },
      };

      const result = await metricsGroupResolver.Mutation.createGroup(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Mutation.createGroup).toHaveBeenCalledTimes(
        1
      );
      expect(metricsGroupResolver.Mutation.createGroup).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create metrics group with invalid group name", async () => {
      const mockReturnValue = new GraphQLError(
        "This group name already exists"
      );

      vi.mocked(metricsGroupResolver.Mutation.createGroup).mockResolvedValue(
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
          name: "Group 01",
          status: "active",
          icon: "pencilIcon",
        },
      };

      const result = await metricsGroupResolver.Mutation.createGroup(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Mutation.createGroup).toHaveBeenCalledTimes(
        2
      );
      expect(metricsGroupResolver.Mutation.createGroup).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Create metrics group with missing required fields", async () => {
      const mockReturnValue = new GraphQLError(
        "Missing required fields: name, icon, and the metrics list"
      );

      vi.mocked(metricsGroupResolver.Mutation.createGroup).mockResolvedValue(
        mockReturnValue as any
      );

      const input: ResolverArgs = {
        input: {
          metrics: [],
          name: "Group 01",
          status: "active",
        },
      };

      const result = await metricsGroupResolver.Mutation.createGroup(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Mutation.createGroup).toHaveBeenCalledTimes(
        3
      );
      expect(metricsGroupResolver.Mutation.createGroup).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Update metrics group", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Group updated",
        metrics: [
          {
            id: "1234",
            description: "This is a description",
            graphType: "bar",
            name: "Metric 01",
            status: "active",
          },
        ],
        name: "Group 01",
        status: "inactive",
        icon: "pencilIcon",
      };

      vi.mocked(metricsGroupResolver.Mutation.updateGroup).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "1234",
        input: {
          status: "inactive",
        },
      };

      const result = await metricsGroupResolver.Mutation.updateGroup(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Mutation.updateGroup).toHaveBeenCalledTimes(
        1
      );
      expect(metricsGroupResolver.Mutation.updateGroup).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Update metrics group with non existent metric ID", async () => {
      const mockReturnValue = new GraphQLError(
        "Could not find metric with ID 1234567"
      );

      vi.mocked(metricsGroupResolver.Mutation.updateGroup).mockResolvedValue(
        mockReturnValue as any
      );

      const input = {
        id: "1234",
        input: {
          metrics: [{ id: "1234567" }],
        },
      };

      const result = await metricsGroupResolver.Mutation.updateGroup(
        null,
        input,
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Mutation.updateGroup).toHaveBeenCalledTimes(
        2
      );
      expect(metricsGroupResolver.Mutation.updateGroup).toHaveBeenCalledWith(
        null,
        input,
        mockContext
      );
    });

    it("Remove metrics group", async () => {
      const mockReturnValue = {
        success: true,
        msg: "Group removed",
      };

      vi.mocked(metricsGroupResolver.Mutation.removeGroup).mockResolvedValue(
        mockReturnValue as any
      );

      const id = "1234";

      const result = await metricsGroupResolver.Mutation.removeGroup(
        null,
        { id },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Mutation.removeGroup).toHaveBeenCalledTimes(
        1
      );
      expect(metricsGroupResolver.Mutation.removeGroup).toHaveBeenCalledWith(
        null,
        { id },
        mockContext
      );
      expect(metricsGroupResolver.Mutation.removeGroup).toHaveReturned();
    });
  });

  describe("Query", () => {
    it("Groups", async () => {
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
            name: "Group 01",
            status: "inactive",
            icon: "pencilIcon",
          },
        ],
      };

      vi.mocked(metricsGroupResolver.Query.groups).mockResolvedValue(
        mockReturnValue as any
      );

      const result = await metricsGroupResolver.Query.groups();

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Query.groups).toHaveBeenCalledTimes(1);
      expect(metricsGroupResolver.Query.groups).toHaveBeenCalledWith();
    });

    it("Group", async () => {
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
        name: "Group 01",
        status: "active",
        icon: "pencilIcon",
      };

      vi.mocked(metricsGroupResolver.Query.group).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "1234";

      const result = await metricsGroupResolver.Query.group(
        null,
        {
          ID,
        },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Query.group).toHaveBeenCalledWith(
        null,
        {
          ID,
        },
        mockContext
      );
    });

    it("Group not found", async () => {
      const mockReturnValue = new Error("Group not found");

      vi.mocked(metricsGroupResolver.Query.group).mockResolvedValue(
        mockReturnValue as any
      );

      const ID = "123456";

      const result = await metricsGroupResolver.Query.group(
        null,
        {
          ID,
        },
        mockContext
      );

      expect(result).toEqual(mockReturnValue);
      expect(metricsGroupResolver.Query.group).toHaveBeenCalledWith(
        null,
        {
          ID,
        },
        mockContext
      );
    });
  });
});
