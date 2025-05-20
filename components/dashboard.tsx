import React from "react";
import "../app/globals.css";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

import LoadingData from "@/components/loadingData";
import EmptyState from "@/components/emptyState";
import NotFound from "@/components/notFound";

import { GET_SHOP_ORDERS, GET_SHOP_ORDERS_BASIC } from "@/lib/shopifyQueries";
import { getSearch } from "@/lib/queries";

import type Search from "../app/interface/search";

export default function Dashboard({ searchId }: { searchId: string }) {
  const [search, setSearch] = useState<Search | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const { loading, error, data } = useQuery(GET_SHOP_ORDERS_BASIC, {
    context: {
      clientName: "shopify",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  useEffect(() => {
    const fetchSearchInfo = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) throw new Error("Auth token not found");

        const searchData = await getSearch(searchId, authToken);
        setSearch(searchData);
      } catch (err) {
        console.error("Error fetching search:", err);
      }
    };
    fetchSearchInfo();
  }, [searchId]);

  const ordersList = data?.orders.edges;
  // console.log("Orders:", ordersList);

  useEffect(() => {
    if (data?.orders.edges && search?.timePeriod) {
      const ordersArray = Array.isArray(data.orders.edges)
        ? [...data.orders.edges]
        : [];

      const filtered = ordersArray.filter((order: any) => {
        const createdAt = new Date(order.node.createdAt);
        const today = new Date();

        switch (search.timePeriod) {
          case "1":
            return createdAt >= new Date(today.setDate(today.getDate() - 0));
          case "2":
            return createdAt >= new Date(today.setDate(today.getDate() - 1));
          case "7":
            return createdAt >= new Date(today.setDate(today.getDate() - 7));
          case "90":
            return createdAt >= new Date(today.setDate(today.getDate() - 90));

          case "30":
            return createdAt >= new Date(today.setDate(today.getDate() - 30));
          case "180":
            return createdAt >= new Date(today.setDate(today.getDate() - 180));
          case "365":
            return createdAt >= new Date(today.setDate(today.getDate() - 365));
          default:
            return true;
        }
      });

      setOrders(filtered);
    }
  }, [data, search?.timePeriod]);

  if (loading) return <LoadingData />;
  if (error) {
    console.error("Error:", error);
    return <NotFound />;
  };
  return (
    <div className="dashboard">
      {orders.length === 0 && <EmptyState />}
      {orders.map(
        ({
          node: order,
        }: {
          node: { id: string; name: string; createdAt: string };
        }) => (
          <div key={order.id}>
            <h2>Pedido ID: {order.id}</h2>
            <h2>Name: {order.name}</h2>
            <p>Criado em: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        )
      )}
      {/* Renderizar métricas e gráficos */}
    </div>
  );
}
