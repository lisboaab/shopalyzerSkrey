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
  query GetTotalRevenue($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
export const GET_TOTAL_DISCOUNT = gql`
  query GetTotalDiscount($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TOTAL_TAX_SET = gql`
  query GetTotalTaxSet($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CONVERSION_RATE = gql`
  query GetConversionRate($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          lineItems(first: 250) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TOP_CATEGORIES = gql`
  query GetTopProducts($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          lineItems(first: 250) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TOTAL_ORDERS = gql`
  query GetTotalOrders($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CUSTOMER_LOCATION = gql`
  query GetTotalOrders($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          shippingAddress {
            country
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TOTAL_SHIPPING = gql`
  query GetTotalRevenue($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          totalShippingPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_ORDER_ITEMS = gql`
  query GetTotalOrders($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          lineItems(first: 250) {
            edges {
              node {
                quantity
                currentQuantity
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TOTAL_REFUND = gql`
  query GetTotalRefund($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          createdAt
          refunds {
            totalRefundedSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Ver a paginacao daqui
export const GET_TOTAL_RETURN = gql`
  query GetTotalReturn($cursor: String, $query: String) {
    orders(first: 250, after: $cursor, query: $query) {
      edges {
        node {
          id
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          returns(first: 100) {
            edges {
              node {
                status
                totalQuantity
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
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

  static groupOrdersByDay(orders: any[]): Map<string, any[]> {
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

  static async calculateTotalRefundGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let total = 0;
    let currency = "$";

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_REFUND,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((order: any) => {
        order.node.refunds.forEach((refund: any) => {
          const value =
            parseFloat(refund.totalRefundedSet.shopMoney.amount) || 0;
          total += value;
          currency = refund.totalRefundedSet.shopMoney.currencyCode || currency;
        });
      });
    }
    const newCurrency = currency != undefined ? currency : "$";
    return total.toFixed(2) + " " + newCurrency;
  }

  static async calculateRefundRateGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let totalOrders = 0;
    let ordersWithRefund = 0;

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_REFUND,
          variables: { cursor, query: queryString },
        });
        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
        totalOrders += orders.edges.length;
      }
      const refundedOrders = allOrders.filter(
        (order: any) => order.node.refunds && order.node.refunds.length > 0
      );
      ordersWithRefund += refundedOrders.length;
    }
    const refundRate =
      totalOrders > 0 ? (ordersWithRefund / totalOrders) * 100 : 0;
    return Math.round(refundRate) + "%";
  }

  static async calculateReturnRateGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let ordersWithReturn = 0;
    let totalOrders = 0;
        const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_RETURN,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }
      allOrders.forEach((order: any) => {
        const returnEdges = order.node?.returns?.edges;
        if (Array.isArray(returnEdges)) {
          returnEdges.forEach((ret: any) => {
            ordersWithReturn += 1;
          });
        }
        totalOrders += 1;
      });
    }
    const returnRate =
      ordersWithReturn > 0 ? (ordersWithReturn / totalOrders) * 100 : 0;
    return Math.round(returnRate) + "%";
  }

  static async calculateGlobalConversionRate(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let totalOrders = 0;
    let fulfilledOrders = 0;

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_CONVERSION_RATE,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
        totalOrders += orders.edges.length;
      }
      fulfilledOrders += allOrders.filter(
        (order: any) =>
          order.node.displayFinancialStatus === "PAID" &&
          order.node.displayFulfillmentStatus === "FULFILLED"
      ).length;
    }
    const conversionRate =
      totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
    return Math.round(conversionRate) + "%";
  }

  static async calculateAverageShippingValueGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let totalShipping = 0;
    let totalOrders = 0;
    let currency = "$";

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_SHIPPING,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }
      allOrders.forEach((edge: any) => {
        const amount = edge.node?.totalShippingPriceSet?.shopMoney?.amount;
        if (edge.node?.totalShippingPriceSet?.shopMoney?.currencyCode) {
          currency = edge.node.totalShippingPriceSet.shopMoney.currencyCode;
        }
        totalShipping += parseFloat(amount) || 0;
      });
      totalOrders += allOrders.length;
    }
    if (totalOrders === 0) return "0.00 " + currency;
    return (totalShipping / totalOrders).toFixed(2) + " " + currency;
  }

  static async calculateAverageOrderQuantityGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let total = 0;
    let totalOrders = 0;
    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_ORDER_ITEMS,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((order: any) => {
        order.node.lineItems.edges.forEach((lineItem: any) => {
          const quantity = parseInt(lineItem.node.quantity) || 0;
          total += quantity;
        });
      });
      totalOrders += allOrders.length;
    }
    if (totalOrders === 0) return "0.00";
    return (total / totalOrders).toFixed(2);
  }

  static async calculateTotalOrdersGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let answer = 0;
    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_ORDERS,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
        answer += allOrders.length;
      }
    }
    return answer;
  }

  static async calculateTotalRevenueGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let total = 0;
    let currency = "$";

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_REVENUE,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((edge: any) => {
        const amount = edge.node?.totalPriceSet?.shopMoney?.amount;
        if (edge.node?.totalPriceSet?.shopMoney?.currencyCode) {
          currency = edge.node.totalPriceSet.shopMoney.currencyCode;
        }
        total += parseFloat(amount) || 0;
      });
    }
    return total.toFixed(2) + " " + currency;
  }

  static async calculateAverageOrderValueGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let totalRevenue = 0;
    let totalOrders = 0;
    let currency = "$";

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_REVENUE,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((edge: any) => {
        const amount = edge.node?.totalPriceSet?.shopMoney?.amount;
        if (edge.node?.totalPriceSet?.shopMoney?.currencyCode) {
          currency = edge.node.totalPriceSet.shopMoney.currencyCode;
        }
        totalRevenue += parseFloat(amount) || 0;
      });
      totalOrders += allOrders.length;
    }
    if (totalOrders === 0) return "0.00 " + currency;
    return (totalRevenue / totalOrders).toFixed(2) + " " + currency;
  }

  static async calculateTotalDiscountGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    let totalDiscount = 0;
    let currency = "$";

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_DISCOUNT,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((edge: any) => {
        const amount = edge.node?.totalDiscountsSet?.shopMoney?.amount;
        if (edge.node?.totalDiscountsSet?.shopMoney?.currencyCode) {
          currency = edge.node.totalDiscountsSet.shopMoney.currencyCode;
        }
        totalDiscount += parseFloat(amount) || 0;
      });
    }
    return totalDiscount.toFixed(2) + " " + currency;
  }

  static async calculateTotalTaxGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    const taxByRegion: Record<string, number> = {};

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_TAX_SET,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((edge: any) => {
        const region = edge.node.shippingAddress?.country || "Unknown";
        const tax = parseFloat(edge.node.totalTaxSet.shopMoney.amount);
        if (!taxByRegion[region]) taxByRegion[region] = 0;
        taxByRegion[region] += tax;
      });
    }
    return Object.entries(taxByRegion).map(([country, taxValue]) => ({
      x: country,
      y: taxValue,
    }));
  }

  static async calculateTopProductsGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    const products: any[] = [];

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOP_PRODUCTS,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((order: any) => {
        order.node.lineItems.edges.forEach((lineItem: any) => {
          const item = {
            item: lineItem.node.name,
            quantity: lineItem.node.quantity,
          };
          products.push(item);
        });
      });
    }
    const groupedProducts = products.reduce((acc: any, curr) => {
      const key = curr.item;
      if (!acc[key]) {
        acc[key] = { ...curr, totalQuantity: 0 };
      }
      acc[key].totalQuantity += curr.quantity;
      return acc;
    }, {});
    const topProducts = Object.values(groupedProducts).sort(
      (a: any, b: any) => b.totalQuantity - a.totalQuantity
    );
    return topProducts.slice(0, 5);
  }

  static async calculateTopCategoriesGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    const categories: any[] = [];

    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOP_CATEGORIES,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }

      allOrders.forEach((order: any) => {
        order.node.lineItems.edges.forEach((lineItem: any) => {
          const item =
            lineItem.node.variant?.product?.productType || "Uncategorized";
          const quantity = parseInt(lineItem.node.quantity) || 0;
          if (item) {
            categories.push({ item, quantity });
          }
        });
      });
    }
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
  }

  static async calculateOrdersByLocationGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
    const countries: any[] = [];
    const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    for (const storeId of storeIds) {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_CUSTOMER_LOCATION,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }
      allOrders.forEach((order: any) => {
        const shippingAddress = order.node.shippingAddress;
        const country =
          shippingAddress && shippingAddress.country
            ? shippingAddress.country
            : "Unknown";

        const item = {
          item: country,
          quantity: 1,
        };
        countries.push(item);
      });
    }
    const groupedCountries = countries.reduce((acc: any, curr) => {
      const key = curr.item;
      if (!acc[key]) {
        acc[key] = { ...curr, totalQuantity: 0 };
      }
      acc[key].totalQuantity += curr.quantity;
      return acc;
    }, {});
    const topProducts = Object.values(groupedCountries).sort(
      (a: any, b: any) => b.totalQuantity - a.totalQuantity
    );
    return topProducts.slice(0, 5);
  }

  static async calculateOrdersOverTimeGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
     const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    const allOrdersPromises = storeIds.map(async (storeId) => {
      const service = new ShopifyOrdersService(storeId, authToken);
       let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_TOTAL_ORDERS,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }
      return allOrders;
    });

    const allOrdersArrays = await Promise.all(allOrdersPromises);

    const allOrders = allOrdersArrays.flat();

    const ordersbyDay = this.groupOrdersByDay(allOrders);

    const data = Array.from(ordersbyDay.entries())
      .map(([dateKey, dayOrders]) => ({ x: dateKey, y: dayOrders.length }))
      .sort((a, b) => a.x.localeCompare(b.x));

    return data;
  }

  static async calculateConversionRateOverTimeGlobal(
    storeIds: string[],
    timePeriod: string,
    authToken: string
  ) {
        const [startTimestamp, endTimestamp] = timePeriod.split("-").map(Number);
    const startDate = new Date(startTimestamp).toISOString();
    const endDate = new Date(endTimestamp).toISOString();
    const queryString = `created_at:>='${startDate}' AND created_at:<='${endDate}'`;

    const allOrdersPromises = storeIds.map(async (storeId) => {
      const service = new ShopifyOrdersService(storeId, authToken);
      let hasNextPage = true;
      let cursor: string | null = null;
      let allOrders: any[] = [];

      while (hasNextPage) {
        const result: any = await service.client.query({
          query: GET_CONVERSION_RATE,
          variables: { cursor, query: queryString },
        });

        const orders = result.data.orders;
        allOrders = allOrders.concat(orders.edges);
        hasNextPage = orders.pageInfo.hasNextPage;
        cursor = orders.pageInfo.endCursor;
      }
      return allOrders;
    });

    const allOrdersArrays = await Promise.all(allOrdersPromises);
    const allOrders2 = allOrdersArrays.flat();
    const ordersbyDay = this.groupOrdersByDay(allOrders2);

    const data = Array.from(ordersbyDay.entries())
      .map(([dateKey, dayOrders]) => {
        const totalOrders = dayOrders.length;
        const fulfilledOrders = dayOrders.filter(
          (order: any) =>
            order.node.displayFinancialStatus === "PAID" &&
            order.node.displayFulfillmentStatus === "FULFILLED"
        ).length;

        const conversion =
          totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;

        const rate = parseFloat(conversion.toFixed(2));

        return {
          x: dateKey,
          y: rate,
        };
      })
      .sort((a, b) => a.x.localeCompare(b.x));

    return data;
  }
}
