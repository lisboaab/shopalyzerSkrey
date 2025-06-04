import { createApolloClient } from "@/lib/shopifyServer";
import { gql } from "@apollo/client/core";

// import { GET_SHOP_ORDERS_BASIC } from '@/lib/shopifyQueries';

export const GET_SHOP_ORDERS_BASIC = gql`
  query GetFull50Orders {
    orders(first: 50) {
      edges {
        node {
          channelInformation {
            id
            app {
              id
            }
          }
          id
          name
          email
          phone
          createdAt
          updatedAt
          processedAt
          closedAt
          displayFulfillmentStatus
          displayFinancialStatus
          currencyCode
          confirmed
          customerLocale
          test
          note
          statusPageUrl
          subtotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }
          totalShippingPriceSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }
          totalTaxSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }

          lineItems(first: 50) {
            edges {
              node {
                id
                title
                name
                quantity
                currentQuantity
                sku
                variantTitle
                originalTotalSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                originalUnitPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                discountedTotalSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                }
                discountAllocations {
                  allocatedAmountSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  discountApplication {
                    allocationMethod
                    ... on AutomaticDiscountApplication {
                      title
                    }
                    ... on DiscountCodeApplication {
                      code
                    }
                    ... on ManualDiscountApplication {
                      title
                    }
                    ... on ScriptDiscountApplication {
                      title
                    }
                    targetType
                    value {
                      ... on PricingPercentageValue {
                        percentage
                      }
                      ... on MoneyV2 {
                        amount
                      }
                    }
                  }
                }
                variant {
                  id
                  barcode
                  price
                  product {
                    id
                  }
                  title
                  inventoryItem {
                    measurement {
                      weight {
                        unit
                        value
                      }
                    }
                  }
                  product {
                    id
                    title
                    productType
                    tags
                    vendor
                  }
                  taxable
                }
                taxLines {
                  rate
                  priceSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  ratePercentage
                }
              }
            }
          }
          fulfillments {
            id
            status
            createdAt
            updatedAt
            name
            location {
              id
              name
            }
            fulfillmentLineItems(first: 50) {
              edges {
                node {
                  id
                  quantity
                  lineItem {
                    id
                    title
                    name
                    quantity
                    currentQuantity
                    sku
                    variantTitle
                    originalTotalSet {
                      presentmentMoney {
                        amount
                        currencyCode
                      }
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    originalUnitPriceSet {
                      presentmentMoney {
                        amount
                        currencyCode
                      }
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    discountedTotalSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                      presentmentMoney {
                        amount
                        currencyCode
                      }
                    }
                    taxLines {
                      rate
                      priceSet {
                        presentmentMoney {
                          amount
                          currencyCode
                        }
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      ratePercentage
                    }
                    discountAllocations {
                      allocatedAmountSet {
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      discountApplication {
                        allocationMethod
                        ... on AutomaticDiscountApplication {
                          title
                        }
                        ... on DiscountCodeApplication {
                          code
                        }
                        ... on ManualDiscountApplication {
                          title
                        }
                        ... on ScriptDiscountApplication {
                          title
                        }
                        targetType
                        value {
                          ... on PricingPercentageValue {
                            percentage
                          }
                          ... on MoneyV2 {
                            amount
                          }
                        }
                      }
                    }
                    discountedUnitPriceAfterAllDiscountsSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          refunds {
            id
            createdAt
            totalRefundedSet {
              presentmentMoney {
                amount
                currencyCode
              }
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_TOTAL_REVENUE = gql`
  query GetTotalRevenue {
    orders(first: 50) {
      edges {
        node {
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
export const GET_TOTAL_DISCOUNT = gql`
  query GetTotalDiscount {
    orders(first: 50) {
      edges {
        node {
          createdAt
          totalDiscountsSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_TOTAL_TAX_SET = gql`
  query GetTotalTaxSet {
    orders(first: 50) {
      edges {
        node {
          createdAt
          totalTaxSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          shippingAddress {
            province
            country
            countryCodeV2
          }
        }
      }
    }
  }
`;

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

export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts {
    orders(first: 250) {
      edges {
        node {
          createdAt
          lineItems(first: 50) {
            edges {
              node {
                id
                title
                name
                quantity
                currentQuantity
                variantTitle
                variant {
                  id
                  title
                  product {
                    id
                    title
                    productType
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TOP_CATEGORIES = gql`
  query GetTopProducts {
    orders(first: 50) {
      edges {
        node {
          createdAt
          lineItems(first: 50) {
            edges {
              node {
                name
                quantity
                variant {
                  product {
                    productType
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TOTAL_ORDERS = gql`
  query GetTotalOrders {
    orders(first: 50) {
      edges {
        node {
          createdAt
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

  async getBasicOrders() {
    try {
      const response = await this.client.query({
        query: GET_SHOP_ORDERS_BASIC,
      });

      if (
        !response.data ||
        !response.data.orders ||
        !response.data.orders.edges
      ) {
        throw new Error("Invalid response format from Shopify");
      }

      return response.data.orders.edges;
    } catch (error) {
      console.error("Error fetching basic orders:", error);
      throw error;
    }
  }

  async getFilteredOrders(timePeriod: string) {
    try {
      const orders = await this.getBasicOrders();
      if (!orders) return [];

      const filtered = orders.filter((order: any) => {
        const createdAt = new Date(order.node.createdAt);
        const today = new Date();
        let cutoffDate;

        switch (timePeriod) {
          case "1":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 1);
            break;
          case "2":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 2);
            break;
          case "7":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 7);
            break;
          case "30":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 30);
            break;
          case "90":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 30);
            break;
          case "180":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 30);
            break;
          case "365":
            cutoffDate = new Date(today);
            cutoffDate.setDate(today.getDate() - 30);
            break;
          default:
            return true;
        }
        return createdAt >= cutoffDate;
      });
      return filtered;
    } catch (error) {
      console.error("Error filtering orders:", error);
      throw error;
    }
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

  async calculateTotalRevenue(timePeriod: string) {
    try {
      const orders = await this.client.query({
        query: GET_TOTAL_REVENUE,
      });

      if (!orders.data || !orders.data.orders || !orders.data.orders.edges) {
        throw new Error("Invalid response format from Shopify");
      }

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );
      let currency;
      const data = filteredOrders.reduce((total: number, edge: any) => {
        const amount = edge.node?.totalPriceSet?.shopMoney?.amount;
        currency = edge.node?.totalPriceSet?.shopMoney?.currencyCode;
        return total + (parseFloat(amount) || 0);
      }, 0);
      const newCurrency = currency != undefined ? currency : "$";
      return data.toFixed(2) + " " + newCurrency;
    } catch (error) {
      console.error("Error fetching total revenue of orders:", error);
      throw error;
    }
  }

  async calculateAverageOrderValue(timePeriod: string ) {
    try {
      const orders = await this.client.query({
        query: GET_TOTAL_REVENUE,
      });

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      if (!orders.data || !orders.data.orders || !orders.data.orders.edges) {
        throw new Error("Invalid response format from Shopify");
      }

      let average;
      if (filteredOrders.length === 0) {
        average = "0.00 $";
      } else {
        const totalRevenue = await this.calculateTotalRevenue(timePeriod);
        const totalRevenueNumber = totalRevenue.split(" ");
        const result = parseInt(totalRevenueNumber[0]) / filteredOrders.length;
        average = result.toFixed(2) + " " + totalRevenueNumber[1];
      }
      return average;
    } catch (error) {
      console.error("Error fetching average value of orders:", error);
      throw error;
    }
  }

  async calculateTotalDiscount(timePeriod: string ) {
    try {
      const actualTotalRevenue = await this.calculateTotalRevenue(timePeriod);

      const orders = await this.client.query({
        query: GET_TOTAL_DISCOUNT,
      });

      if (!orders.data || !orders.data.orders || !orders.data.orders.edges) {
        throw new Error("Invalid response format from Shopify");
      }

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      let currency;
      const discount = filteredOrders.reduce((total: number, edge: any) => {
        const amount = edge.node?.totalDiscountsSet?.shopMoney?.amount;
        currency = edge.node?.totalDiscountsSet?.shopMoney?.currencyCode;
        return total + (parseFloat(amount) || 0);
      }, 0);

      const totalRevenueWithDiscounts = actualTotalRevenue + discount;

      // Percentage
      // return ((discount / totalRevenueWithDiscounts) * 100).toFixed(2);

      const newCurrency = currency != undefined ? currency : "$";
      // Full price discounted
      return discount.toFixed(2) + " " + newCurrency;
    } catch (error) {
      console.error("Error fetching total discount of orders:", error);
      throw error;
    }
  }

  async calculateTotalTax(timePeriod: string ) {
    try {
      const orders = await this.client.query({
        query: GET_TOTAL_TAX_SET,
      });

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      const taxByRegion = filteredOrders.reduce((regions: any, edge: any) => {
        const region = edge.node.shippingAddress?.country || "Unknown";
        const tax = parseFloat(edge.node.totalTaxSet.shopMoney.amount);
        if (!regions[region]) {
          regions[region] = 0;
        }
        regions[region] += tax;
        return regions;
      }, {});
      return taxByRegion;
    } catch (error) {
      console.error("Error fetching total taxes per region:", error);
      throw error;
    }
  }

  async calculateConversionRate(timePeriod: string ) {
    try {
      const orders = await this.client.query({
        query: GET_CONVERSION_RATE,
      });

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      const totalOrders = filteredOrders.length;

      const fulfilledOrders = filteredOrders.filter(
        (order: any) =>
          order.node.displayFinancialStatus === "PAID" &&
          order.node.displayFulfillmentStatus === "FULFILLED"
      ).length;

      const conversionRate =
        totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;

      return Math.round(conversionRate) + "%";
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      throw error;
    }
  }

  async calculateTopProducts(timePeriod: string ) {
    try {
      const orders = await this.client.query({
        query: GET_TOP_PRODUCTS,
      });

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      const products: any[] = [];

      filteredOrders.forEach((order: any) => {
        order.node.lineItems.edges.forEach((lineItem: any) => {
          const item = {
            item: lineItem.node.name,
            quantity: lineItem.node.quantity,
          };
          products.push(item);
        });
      });
      const groupedProducts = products.reduce((acc: any, curr) => {
        const key = curr.item;
        if (!acc[key]) {
          acc[key] = {
            ...curr,
            totalQuantity: 0,
          };
        }
        acc[key].totalQuantity += curr.quantity;
        return acc;
      }, {});
      const topProducts = Object.values(groupedProducts).sort(
        (a: any, b: any) => b.totalQuantity - a.totalQuantity
      );

      return topProducts.slice(0, 5);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      throw error;
    }
  }

  async calculateTopCategories(timePeriod: string) {
    try {
      const orders = await this.client.query({
        query: GET_TOP_CATEGORIES,
      });

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );

      const categories: any[] = [];

      filteredOrders.forEach((order: any) => {
        order.node.lineItems.edges.forEach((lineItem: any) => {
          const item =
            lineItem.node.variant?.product?.productType || "Uncategorized";
          const quantity = parseInt(lineItem.node.quantity) || 0;

          if (item) {
            categories.push({
              item,
              quantity,
            });
          }
        });
      });

      const groupedCategories = categories.reduce((acc: any, curr) => {
        const key = curr.item;

        if (!acc[key]) {
          acc[key] = {
            item: key,
            totalQuantity: 0,
          };
        }

        acc[key].totalQuantity += curr.quantity;

        return acc;
      }, {});

      const topCategories = Object.values(groupedCategories)
        .filter((category: any) => category.item && category.totalQuantity > 0)
        .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);

      return topCategories;
    } catch (error) {
      console.error("Error fetching top categories:", error);
      throw error;
    }
  }
  async calculateTotalOrders(timePeriod: string ) {
    try {
      const orders = await this.client.query({
        query: GET_TOTAL_ORDERS,
      });

      if (!orders.data || !orders.data.orders || !orders.data.orders.edges) {
        throw new Error("Invalid response format from Shopify");
      }

      const filteredOrders = await this.filterOrders(
        timePeriod,
        orders.data.orders.edges
      );
      let answer;
      if (filteredOrders.length === 50) answer = `+${filteredOrders.length}`;
      else answer = filteredOrders.length;

      return answer;
    } catch (error) {
      console.error("Error fetching total revenue of orders:", error);
      throw error;
    }
  }
}
