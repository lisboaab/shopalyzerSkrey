import { createApolloClient } from "@/lib/shopifyServer";
import { gql } from "@apollo/client/core";

export const GET_CONVERSION_RATE = gql`
  query GetConversionRate {
    orders(first: 50) {
      edges {
        node {
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
        }
      }
    }
  }
`;

export class ShopifyOrdersService {
  private client;

  constructor(shopId: string, authToken: string) {
    this.client = createApolloClient(shopId, authToken);
  }

  async filterOrders(timePeriod: string, orders: any) {
    if (!orders) return [];
    try {
      const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);

      const filtered = orders.filter((order: any) => {
        const orderDate = new Date(order.node.createdAt).getTime();
        return orderDate >= startTimestamp && orderDate <= endTimestamp;
      });

      return filtered;
    } catch (error) {
      console.error("Error filtering orders:", error);
      throw error;
    }
  }

  async countDays(timePeriod: string) {
    try {
      const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);

      let millisecondsDiff = endTimestamp - startTimestamp;
      let aDayInMilliseconds = 24 * 60 * 60 * 1000;
      let daysDiff = millisecondsDiff / aDayInMilliseconds;
      return Math.round(daysDiff);
    } catch (error) {
      console.error("Error filtering orders:", error);
      throw error;
    }
  }

  // Função para agrupar pedidos por dia
  private groupOrdersByDay(orders: any[]): Map<string, any[]> {
    const ordersByDay = new Map<string, any[]>();

    orders.forEach((order) => {
      const orderDate = new Date(order.node.createdAt);
      const dayKey = orderDate.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!ordersByDay.has(dayKey)) {
        ordersByDay.set(dayKey, []);
      }
      ordersByDay.get(dayKey)!.push(order);
    });

    return ordersByDay;
  }

  async calculateConversionRateOverTime(timePeriod: string) {
    try {
      const orders = await this.client.query({
        query: GET_CONVERSION_RATE,
      });

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      let ordersbyDay = this.groupOrdersByDay(filteredOrders);
      // console.log(ordersbyDay);

      // days inside the time period give
      const days = await this.countDays(timePeriod);

      let data: any[] = [];
      ordersbyDay.forEach((day) => {
        const totalOrders = day.length;
        // console.log(totalOrders)
        // console.log(day)
        const fulfilledOrders = day.filter(
          (order: any) =>
            order.node.displayFinancialStatus === "PAID" &&
            order.node.displayFulfillmentStatus === "FULFILLED"
        ).length;
        const conversion = (fulfilledOrders / totalOrders) * 100;
        const rate = conversion;
        data.push({ x: day, y: rate });
      });

      console.log(data);

      return 0;
      // return info should be {[{x: day, y: conversion rate of the day}]}
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      throw error;
    }
  }
}
