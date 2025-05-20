import React from "react";
import "../app/globals.css";
import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

import LoadingData from "@/components/loadingData";
import EmptyState from "@/components/emptyState";

import { GET_SHOP_ORDERS } from "@/lib/shopifyQueries";
import { getSearch } from "@/lib/queries";


import type Search from "../app/interface/search";
export default function Dashboard({ searchId }: { searchId: string }) {
  const [search, setSearch] = useState<Search | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  const { loading, error, data } = useQuery(GET_SHOP_ORDERS, {
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

  useEffect(() => {
    if (data?.orders && search?.timePeriod) {
      // 1. Verifica se é array antes do spread
      const ordersArray = Array.isArray(data.orders) 
        ? [...data.orders] 
        : [];

      // 2. Filtra corretamente
      const filtered = ordersArray.filter((order: any) => {
        const createdAt = new Date(order.createdAt);
        const today = new Date();
        
        // 3. Lógica de comparação de datas
        switch(search.timePeriod) {
          case '90':
            return createdAt >= new Date(today.setDate(today.getDate() - 90));
          case '7':
            return createdAt >= new Date(today.setDate(today.getDate() - 7));
          case '30':
            return createdAt >= new Date(today.setDate(today.getDate() - 30));
          case '180':
            return createdAt >= new Date(today.setDate(today.getDate() - 180));
          case '360':
            return createdAt >= new Date(today.setDate(today.getDate() - 360));
          default:
            return true;
        }
      });

      setFilteredOrders(filtered);
    }
  }, [data, search?.timePeriod]);

  if (loading) return <LoadingData />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="dashboard">
      {filteredOrders.length === 0 && <EmptyState />}
      {filteredOrders.map((order: any) => (
        <div key={order.id}>
          <h2>Pedido ID: {order.id}</h2>
          <h2>Name: {order.name}</h2>
          <p>Criado em: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
