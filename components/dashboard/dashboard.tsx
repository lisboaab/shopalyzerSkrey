import React from "react";
import "../../app/globals.css";
import { ShopifyOrdersService } from "../../lib/services/shopifyOrdersService";
import { useEffect, useState } from "react";

import LoadingData from "@/components/loadingData";
import SomethingWentWrong from "@/components/somethingWentWrong";
import Card from "@/components/dashboard/card";
import Donut from "@/components/dashboard/donut";
import Line from "@/components/dashboard/line";
import Bar from "@/components/dashboard/bar";

import type Search from "../../app/interface/search";
import type Metric from "../../app/interface/metric";

interface DashboardData {
  card: Array<{
    metric: Metric;
    value: any;
  }>;
  list: Array<{
    metric: Metric;
    value: {};
  }>;
  donut: any[];
  bar: any[];
  line: any[];
  pie: any[];
}

export default function Dashboard({
  search: initialSearch,
}: {
  search: Search;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    card: [],
    list: [],
    donut: [],
    bar: [],
    line: [],
    pie: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) throw new Error("Auth token not found");

        // Suporte a múltiplas stores
        let storeIds: string[] = [];
        if (Array.isArray(initialSearch.store)) {
          storeIds = initialSearch.store.map((s: any) =>
            typeof s === "object" ? s._id : s
          );
        } else if (
          typeof initialSearch.store === "object" &&
          initialSearch.store !== null
        ) {
          storeIds = [initialSearch.store._id];
        } else if (initialSearch.store) {
          storeIds = [initialSearch.store];
        }

        // Agrupar dados das lojas para cada métrica
        const metricsList = initialSearch?.metrics?.filter(
          (m: Metric) => m.status === "active"
        );
        let data: DashboardData = {
          card: [],
          list: [],
          donut: [],
          bar: [],
          line: [],
          pie: [],
        };
        if (metricsList && storeIds.length > 0) {
          for (const metric of metricsList) {
            let value: any = null;
            switch (metric.name) {
              case "Average order value": 
               
                value =
                  await ShopifyOrdersService.calculateAverageOrderValueGlobal(
                    storeIds,
                    initialSearch.timePeriod,
                    authToken
                  );
                break;
              case "Conversion rate":
                 
                value =
                  await ShopifyOrdersService.calculateGlobalConversionRate(
                    storeIds,
                    initialSearch.timePeriod,
                    authToken
                  );
                break;
              case "Total revenue":
                 
                value = await ShopifyOrdersService.calculateTotalRevenueGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Total discount":
                 
                value = await ShopifyOrdersService.calculateTotalDiscountGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Total tax per region":
                 
                value = await ShopifyOrdersService.calculateTotalTaxGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Top products":
                 
                value = await ShopifyOrdersService.calculateTopProductsGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Top categories":
                   
                value = await ShopifyOrdersService.calculateTopCategoriesGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Total orders":
                 
                value = await ShopifyOrdersService.calculateTotalOrdersGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Orders by location":
                 
                value =
                  await ShopifyOrdersService.calculateOrdersByLocationGlobal(
                    storeIds,
                    initialSearch.timePeriod,
                    authToken
                  );
                break;
              case "Average shipping value":
                 
                value =
                  await ShopifyOrdersService.calculateAverageShippingValueGlobal(
                    storeIds,
                    initialSearch.timePeriod,
                    authToken
                  );
                break;
              case "Average products per order":
                 
                value =
                  await ShopifyOrdersService.calculateAverageOrderQuantityGlobal(
                    storeIds,
                    initialSearch.timePeriod,
                    authToken
                  );
                break;
              case "Total refund":
                 
                value = await ShopifyOrdersService.calculateTotalRefundGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Refund rate":
                 
                value = await ShopifyOrdersService.calculateRefundRateGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Return rate":
                 
                value = await ShopifyOrdersService.calculateReturnRateGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Orders over time":
                 
                value = await ShopifyOrdersService.calculateOrdersOverTimeGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              case "Conversion rate over time":
                 
                value = await ShopifyOrdersService.calculateConversionRateOverTimeGlobal(
                  storeIds,
                  initialSearch.timePeriod,
                  authToken
                );
                break;
              default:
                value = null;
            }
            const item = {
              metric: metric,
              value: value,
            };
            switch (metric.graphType) {
              case "card":
                data.card.push(item);
                break;
              case "list":
                data.list.push(item);
                break;
              case "bar":
                data.bar.push(item);
                break;
              case "line":
                data.line.push(item);
                break;
              case "pie":
                data.pie.push(item);
                break;
              case "donut":
                data.donut.push(item);
                break;
            }
          }
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [initialSearch]);

  if (loading) return <LoadingData />;
  if (error) {
    console.error("Error:", error);
    return (
      <div className="flex flex-row w-full justify-between">
        <SomethingWentWrong />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full justify-between gap-15">
      {" "}
      {/* Card items */}
      <div className="flex flex-row justify-between flex-wrap gap-4">
        {dashboardData.card.length > 0 &&
          [...dashboardData.card]
            .sort((a, b) => a.metric.name.localeCompare(b.metric.name))
            .map((data: any) => {
              return (
                <div
                  key={data.metric.name}
                  className="p-8 rounded-lg flex-1 mx-3"
                  style={{ backgroundColor: "#F6F7F9" }}
                >
                  <Card label={data.metric.name} value={data.value} />
                </div>
              );
            })}
      </div>{" "}
      {/* Donut items */}
      <div className="flex flex-row justify-between flex-wrap gap-16">
        {dashboardData.donut.length > 0 &&
          [...dashboardData.donut]
            .sort((a, b) => a.metric.name.localeCompare(b.metric.name))
            .map((data: any) => {
              return (
                <div
                  key={data.metric.name}
                  className="p-8 rounded-lg flex-1 mx-3  max-w-200 justify-center items-center"
                  style={{ backgroundColor: "#E8F1FF90" }}
                >
                  <Donut label={data.metric.name} value={data.value} />
                </div>
              );
            })}
      </div>{" "}
      {/* Line items */}
      <div className="flex flex-row justify-between flex-wrap gap-16">
        {dashboardData.line.length > 0 &&
          [...dashboardData.line]
            .sort((a, b) => a.metric.name.localeCompare(b.metric.name))
            .map((data: any) => {
              return (
                <div
                  key={data.metric.name}
                  className="p-8 rounded-lg flex-1 mx-3"
                  style={{ backgroundColor: "#E8F1FF90" }}
                >
                  <Line label={data.metric.name} value={data.value} />
                </div>
              );
            })}
      </div>
      {/* Bar items */}
      <div className="flex flex-row justify-between flex-wrap gap-16">
        {dashboardData.bar.length > 0 &&
          [...dashboardData.bar]
            .sort((a, b) => a.metric.name.localeCompare(b.metric.name))
            .map((data: any) => {
              return (
                <div
                  key={data.metric.name}
                  className="p-8 rounded-lg flex-1 mx-3"
                  style={{ backgroundColor: "#E8F1FF90" }}
                >
                  <Bar label={data.metric.name} value={data.value} />
                </div>
              );
            })}
      </div>
    </div>
  );
}
