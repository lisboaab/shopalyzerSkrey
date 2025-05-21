"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";

import { getStoreCredentials } from "@/lib/services/storeService";
import { createApolloClient } from "@/lib/shopifyServer";
import { getStoreOfSearch, getSearch, updateSearch } from "@/lib/queries";

import Dashboard from "@/components/dashboard";
import Loading from "@/components/loading";
import ButtonAnimation from "@/components/buttonAnimation";
import SomethingWentWrong from "@/components/somethingWentWrong";

import type Search from "../../../interface/search";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams; // Search ID from the URL

  const [apolloClient, setApolloClient] = useState<ReturnType<
    typeof createApolloClient
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [searchData, setSearchData] = useState<{
    search: Search;
    storeId: string; // Store ID that will be fetched by the Shopify Server
  } | null>(null);

  const handleSaveSearch = async () => {
    const searchSaved = searchData?.search.isSaved;
    const input = {
      isSaved: !searchSaved,
    }
    const update = await updateSearch(id, input);
    if (update) { 
      setIsSaved(update.isSaved)
      setUpdatedAt(update.updatedAt);    } 
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          throw new Error("Auth token not found");
        }

        const search = await getSearch(id, authToken);
        const storeId = await getStoreOfSearch(id, authToken);
        if (!storeId) {
          throw new Error("Store not found");
        }

        const storeIdString = storeId.store._id;
        setSearchData({ search, storeId: storeIdString });
        setIsSaved(search.isSaved);
        setUpdatedAt(search.updatedAt);

        const credentials = await getStoreCredentials(storeIdString, authToken);

        if (!credentials?.APIToken) {
          throw new Error("Invalid credentials for store");
        }

        // Apollo client
        const client = createApolloClient(
          storeIdString,
          authToken
        );

        setApolloClient(client);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Somthing went wrong");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.error("Error:", error);
    return <SomethingWentWrong />;
}

  if (!apolloClient) {
    console.error("Apollo client is not initialized");
    return <p>Something went wrong: the Apollo Client did not initialize</p>;
  }

  return (
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-3">
          <h1 className="worksans text-md grey800">Analytics dashboard</h1>
          <h1 className="worksans text-2xl">{searchData?.search.name}</h1>
        </div>
        <div className="flex flex-row gap-5 items-center">
          <h1 className="worksans text-md grey800">
            Search edited in:{" "}
            {new Date(Number(updatedAt)).toLocaleString()}
          </h1>
          <ButtonAnimation
            label="Update data"
            color="#0D0DFC"
            style="outline"
            action={() => window.location.reload()}
            icon="update"
            width="12em"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        {/* Search Information */}
        <div className="flex flex-row gap-8">
          <div className="flex flex-row gap-2">
            {" "}
            <p className="gellix-semibold">Store: </p>{" "}
            {typeof searchData?.search.store === "object" &&
            searchData?.search.store !== null
              ? (searchData?.search.store as { name?: string }).name
              : searchData?.search.store}
          </div>
          <div className="flex flex-row gap-2">
            {" "}
            <p className="gellix-semibold">Group of Metrics: </p>{" "}
            {searchData?.search.metricsGroup?.name}
          </div>
          <div className="flex flex-row gap-2">
            {" "}
            <p className="gellix-semibold">Time period: </p> 
           { searchData?.search.timePeriod != '1' && searchData?.search.timePeriod != '2' && <p>Last{" "} {searchData?.search.timePeriod} day(s)</p>}
           { searchData?.search.timePeriod === '1' && <p> Today</p>}
           { searchData?.search.timePeriod === '2' && <p> Yesterday</p>}
          </div>
        </div>
        <div className="border border-gray-200 rounded-full p-2 flex items-center justify-center cursor-pointer mr-2">
          {/* Save Search */}
          {isSaved ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#0D0DFC"
              className="size-6"
              onClick={handleSaveSearch}
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              onClick={handleSaveSearch}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          )}
        </div>
      </div>

      <ApolloProvider client={apolloClient}>
        <Dashboard searchId={id} />
      </ApolloProvider>
    </div>
  );
}
