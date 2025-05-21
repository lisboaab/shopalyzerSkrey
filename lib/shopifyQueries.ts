import { concat, gql } from "@apollo/client/core";
import apolloClient from "./apolloClient";
import { useQuery } from "@apollo/client";


import Metric from "../app/interface/metric";
import Group from "../app/interface/group";

// Complete Query of Shopify's Orders data
export const GET_SHOP_ORDERS = gql`
  query GetFull50Orders {
    orders(first: 2) {
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
          cancelReason
          closedAt
          displayFulfillmentStatus
          displayFinancialStatus
          currencyCode
          confirmed
          customerLocale
          test
          tags
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
          taxExempt
          totalDiscountsSet {
            shopMoney {
              amount
              currencyCode
            }
            presentmentMoney {
              amount
              currencyCode
            }
          }
          shippingAddress {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
            phone
            name
            countryCodeV2
          }
          customer {
            id
            firstName
            lastName
            email
            phone
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
            }
            tags
            taxExemptions
            defaultAddress {
              firstName
              lastName
              company
              address1
              address2
              city
              province
              provinceCode
              zip
              phone
              name
              country
              countryCodeV2
            }
            displayName
            metafields(first: 100) {
              edges {
                node {
                  id
                  key
                  value
                }
              }
            }
          }
          currentTaxLines {
            priceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            rate
            ratePercentage
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
                discountedUnitPriceAfterAllDiscountsSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                variant {
                  id
                  barcode
                  price
                  product {
                    id
                  }
                  sku
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
          discountApplications(first: 10) {
            edges {
              node {
                targetType
                allocationMethod
                targetSelection
                value {
                  ... on MoneyV2 {
                    amount
                    currencyCode
                  }
                  ... on PricingPercentageValue {
                    percentage
                  }
                }
                ... on DiscountCodeApplication {
                  code
                }
                ... on ManualDiscountApplication {
                  title
                  description
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
                    variant {
                      id
                      barcode
                      price
                      product {
                        id
                      }
                      sku
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
          transactions {
            id
            paymentDetails {
              ... on CardPaymentDetails {
                name
                number
                paymentMethodName
                company
                bin
                cvvResultCode
                expirationMonth
                expirationYear
                wallet
                avsResultCode
              }
              ... on LocalPaymentMethodsPaymentDetails {
                paymentMethodName
              }
              ... on ShopPayInstallmentsPaymentDetails {
                paymentMethodName
              }
              ... on BasePaymentDetails {
                paymentMethodName
              }
            }
            amountSet {
              presentmentMoney {
                amount
                currencyCode
              }
              shopMoney {
                amount
                currencyCode
              }
            }
            kind
            status
            manuallyCapturable
            gateway
            authorizationCode
            createdAt
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
            refundLineItems(first: 10) {
              edges {
                node {
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
                    variant {
                      id
                      barcode
                      price
                      product {
                        id
                      }
                      sku
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
                  quantity
                  subtotalSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
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
                }
              }
            }
          }
          returns(first: 100) {
            edges {
              node {
                returnLineItems(first: 100) {
                  edges {
                    node {
                      ... on ReturnLineItem {
                        fulfillmentLineItem {
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
                            variant {
                              id
                              barcode
                              price
                              product {
                                id
                              }
                              sku
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
                }
              }
            }
          }
          shippingLines(first: 50) {
            edges {
              node {
                code
                carrierIdentifier
                id
                title
                deliveryCategory
                discountedPriceSet {
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
                }
              }
            }
          }

          metafields(first: 100) {
            edges {
              node {
                id
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

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

export const getShopOrdersBasic = async () => {
  try {
    const { data } = useQuery(GET_SHOP_ORDERS_BASIC, {
        context: {
          clientName: "shopify",
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    return data;
  } catch (error) {
    throw error;
  }
};