"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";

import { getStoreCredentials } from "@/lib/services/storeService";
import { createApolloClient } from "@/lib/shopifyServer";
import { getStoreOfSearch, getSearch } from "@/lib/queries";

import Dashboard from "@/components/dashboard";
import Loading from "@/components/loading";

import type Search from "../../../interface/search";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams; // esse ID é o ID da search que vem do URL
  const [apolloClient, setApolloClient] = useState<ReturnType<
    typeof createApolloClient
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeID, setStoreID] = useState<string>(""); // ID da loja que deve ser buscado pelo shopify server
  const [search, setSearch] = useState<Search | null>(null);

  const fetchStoreID = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Auth token not found");
      }
      const storeId = await getStoreOfSearch(id, authToken);
      console.log("Store ID:", storeId.store._id);
      setStoreID(storeId.store._id);
    } catch (err) {
      console.error("Error fetching store ID:", err);
    }
  };

  useEffect(() => {
    const fetchSearchInfo = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("Auth token not found");
        }
        const search = await getSearch(id, authToken);
        setSearch(search);
      } catch (err) {
        console.error("Error fetching store ID:", err);
      }
    };

    fetchSearchInfo();
  }, [id]);

  useEffect(() => {
    const initializeApollo = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");
        await fetchStoreID();
        console.log("Store ID no page.tsx [id]:", storeID);
        const credentials = await getStoreCredentials(storeID, authToken);

        const client = createApolloClient(
          storeID,
          credentials.shopUrl,
          credentials.APIToken,
          authToken
        );

        setApolloClient(client);
        setError(null);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err instanceof Error ? err.message : "Falha ao inicializar");
      } finally {
        setLoading(false);
      }
    };

    initializeApollo();
  }, [storeID]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700">Erro: {error}</div>;
  }

  if (!apolloClient) {
    console.error("Apollo client is not initialized");
    return <p>Something went wrong: the Apollo Client did not initialize</p>;
  }

  return (
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-3">
        <h1 className="worksans text-md grey800">Analytics dashboard</h1>
        <h1 className="worksans text-2xl">Search ID: {id}</h1>
        <h1 className="worksans text-2xl">SearchName: {search?.name}</h1>
      </div>

      <ApolloProvider client={apolloClient}>
        <Dashboard searchId={id} />
      </ApolloProvider>
    </div>
  );
}
