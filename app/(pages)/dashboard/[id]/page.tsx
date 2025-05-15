"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getStoreCredentials } from "@/lib/services/storeService";
import { createApolloClient } from "@/lib/shopifyServer";
import { ApolloProvider } from '@apollo/client';
import Dashboard from "@/components/dashboard";
import Loading from "@/components/loading";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [apolloClient, setApolloClient] = useState<ReturnType<typeof createApolloClient> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApollo = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem('authToken');
        const credentials = await getStoreCredentials(id, authToken);

        const client = createApolloClient(
          id,
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
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700">
        Erro: {error}
      </div>
    );
  }

  if (!apolloClient) {
    console.error("Apollo client is not initialized");
    return <p>Something went wrong: the Apollo Client did not initialize</p>
  }

  return (
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-3">
        <h1 className="worksans text-md grey800">Analytics dashboard</h1>
        <h1 className="worksans text-2xl">Loja ID: {id}</h1>
      </div>
      
      <ApolloProvider client={apolloClient}>
        <Dashboard shopId={id} />
      </ApolloProvider>
    </div>
  );
}
