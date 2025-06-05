import React from "react";
import "../../app/globals.css";
import { ShopifyOrdersService } from "../../lib/services/shopifyOrdersService";
import { useEffect, useState } from "react";

import LoadingData from "@/components/loadingData";
import SomethingWentWrong from "@/components/somethingWentWrong";
import Card from "@/components/dashboard/card";
import Donut from "@/components/dashboard/donut";

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
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");
        if (!authToken) throw new Error("Auth token not found");

        // Initialize orders service
        const ordersService = new ShopifyOrdersService(
          typeof initialSearch.store === "string"
            ? initialSearch.store
            : (initialSearch.store as { _id: string })._id,
          authToken
        );

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
        if (metricsList) {
          const metricsPromises = metricsList.map(async (metric: Metric) => {
            let value: any = null;
            switch (metric.name) {
              case "Average order value":
                value = await ordersService.calculateAverageOrderValue(
                  initialSearch.timePeriod
                );
                break;
              case "Conversion rate":
                value = await ordersService.calculateConversionRate(
                  initialSearch.timePeriod
                );
                break;
              case "Total revenue":
                value = await ordersService.calculateTotalRevenue(
                  initialSearch.timePeriod
                );
                break;
              case "Total discount":
                value = await ordersService.calculateTotalDiscount(
                  initialSearch.timePeriod
                );
                break;
              case "Total tax/region":
                value = await ordersService.calculateTotalTax(
                  initialSearch.timePeriod
                );
                break;
              case "Top products":
                value = await ordersService.calculateTopProducts(
                  initialSearch.timePeriod
                );
                break;
              case "Top categories":
                value = await ordersService.calculateTopCategories(
                  initialSearch.timePeriod
                );
                break;
              case "Total orders":
                value = await ordersService.calculateTotalOrders(
                  initialSearch.timePeriod
                );
                break;
            }
            const item = {
              metric: metric,
              value: value,
            };
            switch (item.metric.graphType) {
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
          });
          await Promise.all(metricsPromises);
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
      <div className="flex flex-row justify-between">
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
      <div className="flex flex-row justify-between">
        {dashboardData.donut.length > 0 &&
          [...dashboardData.donut]
            .sort((a, b) => a.metric.name.localeCompare(b.metric.name))
            .map((data: any) => {
              return (
                <div
                  key={data.metric.name}
                  className="p-8 rounded-lg flex-1 mx-3"
                  style={{ backgroundColor: "#E8F1FF90" }}
                >
                  <Donut label={data.metric.name} value={data.value} />
                </div>
              );
            })}
      </div>{" "}
      <div className="flex flex-row justify-between">
        {dashboardData.donut.length > 0 &&
          [...dashboardData.donut]
            .sort((a, b) => a.metric.name.localeCompare(b.metric.name))
            .map((data: any) => {
              return (
                <div key={data.metric.name}>
                  <p className="gellix text-black">{data.metric.name}</p>
                  {!Array.isArray(data.value) &&
                    typeof data.value === "object" &&
                    Object.entries(data.value).map(
                      ([key, value]: [string, any], index) => (
                        <div key={`${data.metric.name}-${index}`}>
                          {key}: {value}
                        </div>
                      )
                    )}
                </div>
              );
            })}
      </div>
    </div>
  );
}
