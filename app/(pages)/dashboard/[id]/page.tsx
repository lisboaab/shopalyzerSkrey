"use client";
import React from "react";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";

import { getStoreCredentials } from "@/lib/services/storeService";
import { createApolloClient } from "@/lib/shopifyServer";
import {
  getStoreOfSearch,
  getSearch,
  updateSearch,
  getStoresBasic,
  getActiveGroups,
} from "@/lib/queries";

import Dashboard from "@/components/dashboard/dashboard";
import Loading from "@/components/loading";
import ButtonAnimation from "@/components/buttonAnimation";
import SomethingWentWrong from "@/components/somethingWentWrong";
import SnackBar from "@/components/modal/snackBar";

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
  const [editName, setEditName] = useState(false);
  const [editSearchInfo, setEditSearchInfo] = useState(false);
  const [storesList, setStoresList] = useState<any[]>([]);
  const [metricsGroupList, setMetricsGroupList] = useState<any[]>([]);
  const [snackBarState, setSnackBarState] = useState({
    open: false,
    type: "",
    message: "",
  });

  const updateSnackBarState = (key: string, value: any) => {
    setSnackBarState((prev) => ({ ...prev, [key]: value }));
  };
  const handleSnackBar = (type: string, title: string) => {
    updateSnackBarState(
      "type",
      type === "failurePassword" ? "error" : type === "failure" ? "error" : type
    );
    updateSnackBarState("message", title);
    updateSnackBarState("open", true);
    setTimeout(() => {
      updateSnackBarState("open", false);
    }, 3000);
  };

  const handleSaveAllChanges = async () => {
    if (!searchData) return;

    try {
      const update = await updateSearch(id, {
        ...(tempEditData.store && { store: tempEditData.store }),
        ...(tempEditData.metricsGroup && {
          metricsGroup: tempEditData.metricsGroup,
        }),
        ...(tempEditData.timePeriod && { timePeriod: tempEditData.timePeriod }),
      });

      if (update) {
        if (tempEditData.store) {
          const selectedStore = storesList.find(
            (s) => s._id === tempEditData.store
          );
          searchData.search.store = selectedStore;
        }
        if (tempEditData.metricsGroup) {
          const selectedGroup = metricsGroupList.find(
            (g) => g._id === tempEditData.metricsGroup
          );
          searchData.search.metricsGroup = selectedGroup;
        }
        if (tempEditData.timePeriod) {
          searchData.search.timePeriod = tempEditData.timePeriod;
        }

        setSearchData({ ...searchData });
        setUpdatedAt(update.updatedAt);
        setEditSearchInfo(false);
        setTempEditData({});
        handleSnackBar("success", "Search updated successfully!");
      }
    } catch (error) {
      handleSnackBar("error", "Error updating search");
    }
  };

  const handleCancelAllChanges = () => {
    setEditSearchInfo(false);
    setTempEditData({});
  };

  const dateRangeList = [
    { id: "today", label: "Today", value: "1" },
    { id: "yesterday", label: "Yesterday", value: "2" },
    { id: "last_7_days", label: "Last 7 days", value: "7" },
    { id: "last_30_days", label: "Last 30 days", value: "30" },
    { id: "last_90_days", label: "Last 90 days", value: "90" },
    { id: "last_180_days", label: "Last 180 days", value: "180" },
    { id: "last_365_days", label: "Last 365 days", value: "365" },
  ];
  const [tempEditData, setTempEditData] = useState<{
    store?: string;
    metricsGroup?: string;
    timePeriod?: string;
  }>({});

  const [searchData, setSearchData] = useState<{
    search: Search;
    storeId: string; // Store ID that will be fetched by the Shopify Server
  } | null>(null);

  const handleSaveSearch = async () => {
    const searchSaved = searchData?.search.isSaved;
    const input = {
      isSaved: !searchSaved,
    };
    const update = await updateSearch(id, input);
    if (update) {
      setIsSaved(update.isSaved);
      setUpdatedAt(update.updatedAt);
    }
  };

  const handleEditSearch = async (item: string, input: any) => {
    const update = await updateSearch(id, input);
    if (update) {
      setUpdatedAt(update.updatedAt);
      if (item === "name") {
        setEditName(false);
        handleSnackBar("success", "Search name updated successfully!");
      }
    } else {
      if (item === "name") {
        handleSnackBar("error", "Error updating search name");
      }
    }
  };
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await getStoresBasic();
        if (stores) {
          const storesSorted = [...stores].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setStoresList(storesSorted);
        }
      } catch (error) {
        console.error("Error fetching stores", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const groups = await getActiveGroups();
        if (groups) {
          const groupsSorted = [...groups].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setMetricsGroupList(groupsSorted);
        }
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };

    fetchStores();
    fetchGroups();
  }, []);

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
        const client = createApolloClient(storeIdString, authToken);

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
    return <SomethingWentWrong />;
  }

  return (
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-3">
          <h1 className="worksans text-md grey800">Analytics dashboard</h1>{" "}
          {editName ? (
            <div className="flex flex-row items-center gap-4">
              <p className="gellix">Edit search name: </p>
              <div className="flex flex-row flex-1 gap-2">
                {" "}
                <input
                  id="searchNameInput"
                  type="text"
                  value={searchData?.search.name}
                  maxLength={55}
                  onChange={(e) =>
                    setSearchData(
                      searchData
                        ? {
                            search: {
                              ...searchData.search,
                              name: e.target.value,
                            },
                            storeId: searchData.storeId,
                          }
                        : null
                    )
                  }
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && searchData?.search.name) {
                      const input = {
                        name: searchData.search.name,
                      };
                      await handleEditSearch("name", input);
                    }
                  }}
                  className="border border-gray-300 p-2 rounded-lg gellix bg-transparent outline-none w-100"
                />
                <ButtonAnimation
                  label="Save"
                  color="#0D0DFC"
                  style="outline"
                  action={async () => {
                    if (searchData?.search.name) {
                      const input = {
                        name: searchData.search.name,
                      };
                      await handleEditSearch("name", input);
                    }
                  }}
                  icon="arrow"
                  width="7em"
                />
                <ButtonAnimation
                  label="Cancel"
                  color="gray"
                  style="outline"
                  action={() => {
                    setEditName(false);
                    if (searchData) {
                      const currentSearch = { ...searchData };
                      setSearchData(currentSearch);
                    }
                  }}
                  width="6em"
                />
              </div>
            </div>
          ) : (
            <h1 className="worksans text-2xl flex-1 flex flex-row items-center gap-3">
              {searchData?.search.name}
              <div className="hover:cursor-pointer hover:bg-blue-100 hover:rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="blue"
                  className="size-6"
                  onClick={() => setEditName(true)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
            </h1>
          )}
        </div>
        <div className="flex flex-row gap-5 items-center">
          <h1 className="worksans text-md grey800">
            Search edited in: {new Date(Number(updatedAt)).toLocaleString()}
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
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-8">
            <div className="flex flex-row gap-2 items-center">
              <p className="gellix-semibold hover:cursor-pointer">Store: </p>
              {editSearchInfo ? (
                <div className="flex flex-row gap-2">
                  {" "}
                  <select
                    value={
                      tempEditData.store || (searchData?.search.store as string)
                    }
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg p-2 gellix outline-none"
                    onChange={(e) =>
                      setTempEditData({
                        ...tempEditData,
                        store: e.target.value,
                      })
                    }
                  >
                    {storesList.map((store: any) => (
                      <option key={store._id} value={store._id}>
                        {store.name}
                      </option>
                    ))}{" "}
                  </select>
                </div>
              ) : (
                <p>
                  {typeof searchData?.search.store === "object" &&
                  searchData?.search.store !== null
                    ? (searchData?.search.store as { name?: string }).name
                    : searchData?.search.store}
                </p>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p className="gellix-semibold">Group of Metrics:</p>
              {editSearchInfo ? (
                <div className="flex flex-row gap-2">
                  <select
                    value={
                      tempEditData.metricsGroup ||
                      searchData?.search.metricsGroup?._id
                    }
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg p-2 gellix outline-none"
                    onChange={(e) =>
                      setTempEditData({
                        ...tempEditData,
                        metricsGroup: e.target.value,
                      })
                    }
                  >
                    {metricsGroupList.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}{" "}
                  </select>
                </div>
              ) : (
                <p>{searchData?.search.metricsGroup?.name}</p>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p className="gellix-semibold">Time period:</p>
              {editSearchInfo ? (
                <div className="flex flex-row gap-2">
                  <select
                    value={
                      dateRangeList.find(
                        (d) =>
                          d.value ===
                          (tempEditData.timePeriod ||
                            searchData?.search.timePeriod)
                      )?.id
                    }
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg p-2 gellix outline-none"
                    onChange={(e) => {
                      const selectedPeriod = dateRangeList.find(
                        (d) => d.id === e.target.value
                      )?.value;
                      if (selectedPeriod) {
                        setTempEditData({
                          ...tempEditData,
                          timePeriod: selectedPeriod,
                        });
                      }
                    }}
                  >
                    {dateRangeList.map((dateOption) => (
                      <option key={dateOption.id} value={dateOption.id}>
                        {dateOption.label}
                      </option>
                    ))}{" "}
                  </select>
                </div>
              ) : (
                <p>
                  {searchData?.search.timePeriod != "1" &&
                    searchData?.search.timePeriod != "2" && (
                      <span>Last {searchData?.search.timePeriod} day(s)</span>
                    )}
                  {searchData?.search.timePeriod === "1" && <span>Today</span>}
                  {searchData?.search.timePeriod === "2" && (
                    <span>Yesterday</span>
                  )}
                </p>
              )}
            </div>{" "}
          </div>
          {editSearchInfo && (
            <div className="flex flex-row gap-2 justify-end">
              <ButtonAnimation
                label="Save changes"
                color="#0D0DFC"
                style="outline"
                action={handleSaveAllChanges}
                icon="arrow"
                width="12em"
              />
              <ButtonAnimation
                label="Cancel"
                color="gray"
                style="outline"
                action={handleCancelAllChanges}
                width="6em"
              />
            </div>
          )}
          {!editSearchInfo && (
            <div className="hover:cursor-pointer hover:bg-blue-100 hover:rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="blue"
                className="size-6"
                onClick={() => {
                  setEditSearchInfo(true);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
          )}
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
      </div>{" "}
      <ApolloProvider client={apolloClient}>
        <Dashboard searchId={id} />
      </ApolloProvider>
      {/* Snackbar feedback */}
      <SnackBar
        type={snackBarState.type}
        isOpen={snackBarState.open}
        title={snackBarState.message}
        onDismiss={() => updateSnackBarState("open", false)}
      />
    </div>
  );
}
