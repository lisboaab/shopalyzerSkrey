"use client";
import React from "react";
import { useEffect, useState, Suspense } from "react";
import { ApolloProvider } from "@apollo/client";
import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";

import { getApolloClient } from "@/lib/shopifyServer";
import {
  getStoreOfSearch,
  getSearch,
  updateSearch,
  getActiveGroups,
} from "@/lib/queries";

import { DateRangePicker } from "@heroui/date-picker";
import Dashboard from "@/components/dashboard/dashboard";
import Loading from "@/components/loading";
import ButtonAnimation from "@/components/buttonAnimation";
import SomethingWentWrong from "@/components/somethingWentWrong";
import SnackBar from "@/components/modal/snackBar";
import ButtonCustomMetricsDialog from "@/components/ButtonCustomMetricsDialog";

import type Search from "../../../interface/search";
import type Metric from "../../../interface/metric";
import type Group from "../../../interface/group";

function heroUIDateToTimestamp(heroUIDate: any, isEndDate: boolean = false) {
  if (!heroUIDate) return null;

  const { year, month, day } = heroUIDate;
  const date = new Date(year, month - 1, day);

  if (isEndDate) {
    date.setHours(23, 59, 59, 999);
  }

  return date.getTime();
}

function convertDateRange(dateRange: any) {
  if (!dateRange) return null;
  const range = `${heroUIDateToTimestamp(
    dateRange.start
  )}-${heroUIDateToTimestamp(dateRange.end, true)}`;
  return range;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams; // Search ID from the URL

  const [apolloClient, setApolloClient] = useState<ReturnType<
    typeof getApolloClient
  > | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState<boolean | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [date, setDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editName, setEditName] = useState(false);
  const [editSearchInfo, setEditSearchInfo] = useState(false);
  const [metricsGroupList, setMetricsGroupList] = useState<any[]>([]);
  const [pencilButtonActive, setPencilButtonActive] = useState(false);
  const [customMetrics, setCustomMetrics] = useState<any[]>([]);
  const [customGroup, setCustomGroup] = useState<Group>();

  const [snackBarState, setSnackBarState] = useState({
    open: false,
    type: "",
    message: "",
  });
  const [tempEditData, setTempEditData] = useState<{
    metricsGroup?: string;
    timePeriod?: string;
  }>({});
  const [searchData, setSearchData] = useState<{
    search: Search;
    storeId: string; // Store ID that will be fetched by the Shopify Server
  } | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState(
    getInitialDateRange(searchData?.search.timePeriod)
  );

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

      // Apollo client
      const client = getApolloClient(storeIdString, authToken);

      setApolloClient(client);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Somthing went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllChanges = async () => {
    if (!searchData) return;
    try {
      let metricsList: any[] = [];

      if (customMetrics.length > 0) {
        customMetrics.map((m) => {
          metricsList.push(m._id);
        });
      }
      const updateData = {
        ...(tempEditData.metricsGroup && {
          metricsGroup: tempEditData.metricsGroup,
        }),
        ...(tempEditData.timePeriod && { timePeriod: tempEditData.timePeriod }),
        ...(tempEditData.metricsGroup === customGroup?._id &&
          metricsList.length > 0 && { metrics: metricsList }),
      };

      if (
        tempEditData.metricsGroup === customGroup?._id &&
        metricsList.length === 0
      ) {
        handleSnackBar("failure", "Please select at least one metric");
        return;
      }

      const update = await updateSearch(id, updateData);
      if (update) {
        if (tempEditData.metricsGroup) {
          const selectedGroup = metricsGroupList.find(
            (g) => g._id === tempEditData.metricsGroup
          );
          setSearchData({
            ...searchData,
            search: {
              ...searchData.search,
              metricsGroup: selectedGroup,
            },
          });
        }
        if (tempEditData.timePeriod) {
          setSearchData({
            ...searchData,
            search: {
              ...searchData.search,
              timePeriod: tempEditData.timePeriod,
            },
          });
        }

        setUpdatedAt(update.updatedAt);
        setEditSearchInfo(false);
        setTempEditData({});
        handleSnackBar("success", "Search updated successfully!");
      }
      initialize();
    } catch (error) {
      console.error(error);
      handleSnackBar("error", "Error updating search");
    }
  };

  const handleCancelAllChanges = () => {
    setEditSearchInfo(false);
    setTempEditData({});
    setSelectedDateRange(getInitialDateRange(searchData?.search.timePeriod));
  };

  const handleSaveSearch = async () => {
    try {
      const searchSaved = searchData?.search.isSaved;
      const input = {
        isSaved: !searchSaved,
      };
      const update = await updateSearch(id, input);
      if (update) {
        setIsSaved(!searchSaved);
        setUpdatedAt(update.updatedAt);
        
        if (searchData) {
          setSearchData({
            ...searchData,
            search: {
              ...searchData.search,
              isSaved: !searchSaved,
              updatedAt: update.updatedAt
            }
          });
        }
        
        handleSnackBar("success", searchSaved ? "Search removed from saved" : "Search saved successfully!");
      }
    } catch (error) {
      console.error("Error saving search:", error);
      handleSnackBar("error", "Error saving search");
    }
  };

  const handleEditSearchName = async (item: string, input: any) => {
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

  function timestampToCalendarDate(timestamp: string) {
    const date = new Date(Number(timestamp));
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }

  function getInitialDateRange(timePeriod: string | undefined) {
    if (!timePeriod) return undefined;

    const [startTimestamp, endTimestamp] = timePeriod.split("-");
    return {
      start: timestampToCalendarDate(startTimestamp),
      end: timestampToCalendarDate(endTimestamp),
    };
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await getActiveGroups();
        if (groups) {
          const groupsSorted = [...groups].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setMetricsGroupList(groupsSorted);

          const cGroup = groupsSorted.find((g) => g.name === "Custom");
          if (cGroup) {
            setCustomGroup(cGroup);
          }
        }
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    initialize();
  }, [id]);

  useEffect(() => {
    const d = searchData?.search.timePeriod;
    const sep = d?.split("-");
    if (sep) {
      const start =
        typeof sep[0] === "string"
          ? new Date(Number(sep[0]))
          : new Date(sep[0]);
      const end =
        typeof sep[1] === "string"
          ? new Date(Number(sep[1]))
          : new Date(sep[1]);

      const fullTimePeriod = `${start.toLocaleDateString(
        "pt-BR"
      )} - ${end.toLocaleDateString("pt-BR")}`;
      setDate(fullTimePeriod);
    }
  }, [searchData]);

  useEffect(() => {
    setSelectedDateRange(getInitialDateRange(searchData?.search.timePeriod));
    if (searchData?.search.metricsGroup?._id === customGroup?._id) {
      setPencilButtonActive(true);
      if (searchData?.search.metrics && searchData.search.metrics.length > 0) {
        setCustomMetrics(searchData.search.metrics);
      }
    } else {
      setPencilButtonActive(false);
      setCustomMetrics([]);
    }
  }, [searchData, customGroup]);

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
    <Suspense fallback={<Loading />}>
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
                        await handleEditSearchName("name", input);
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
                        await handleEditSearchName("name", input);
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
                <p>
                  {typeof searchData?.search.store === "object" &&
                  searchData?.search.store !== null
                    ? (searchData?.search.store as { name?: string }).name
                    : searchData?.search.store}
                </p>
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
                      className="border border-gray-200 text-gray-900 text-sm rounded-lg p-2 gellix outline-none w-35"
                      onChange={(e) => {
                        setTempEditData({
                          ...tempEditData,
                          metricsGroup: e.target.value,
                        });
                        if (e.target.value === customGroup?._id) {
                          setPencilButtonActive(true);
                        } else {
                          setPencilButtonActive(false);
                        }
                      }}
                    >
                      {metricsGroupList.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.name}
                        </option>
                      ))}{" "}
                    </select>
                    {pencilButtonActive && (
                      <div
                        id="pencilButton"
                        className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        <ButtonCustomMetricsDialog
                          setCustomMetrics={setCustomMetrics}
                          initialMetrics={searchData?.search.metrics ?? []}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{searchData?.search.metricsGroup?.name}</p>
                )}
              </div>{" "}
              <div className="flex flex-row gap-2 items-center">
                <p className="gellix-semibold">Time period:</p>
                {editSearchInfo ? (
                  <div className="flex flex-row gap-2">
                    <div className="border border-gray-200 text-gray-900 rounded-lg w-fit h-11 p-3 outline-none items-center ">
                      <DateRangePicker
                        className="max-w-xs gellix w-65 gap-5"
                        selectorButtonPlacement="end"
                        calendarProps={{
                          classNames: {
                            base: "bg-gray-50 rounded-lg shadow-lg",
                            prevButton:
                              "hover:bg-gray-200 items-center justify-center",
                            nextButton:
                              "hover:bg-gray-200 items-center justify-center",
                            gridHeader:
                              "border-b-1 border-gray-300 text-gray-500",
                            cellButton: [
                              "data-[disabled=true]:opacity-40",
                              "data-[available=true]:cursor-pointer",
                              "data-[focused=true]:border-1 data-[focused=true]:border-blue-900 data-[focused=true]:cursor-pointer",
                              "data-[selection-start=true]:bg-blue-600 data-[selection-start=true]:cursor-pointer data-[selection-start=true]:text-white data-[selection-start=true]:rounded-2xl",
                              "data-[selection-end=true]:bg-blue-600 data-[selection-end=true]:cursor-pointer data-[selection-end=true]:text-white data-[selection-end=true]:rounded-2xl",
                              "data-[selected=true]:bg-blue-100 data-[selected=true]:text-black data-[selected=true]:rounded-none",
                            ],
                          },
                        }}
                        onChange={(newDate) => {
                          if (newDate) {
                            const dateRange = convertDateRange(newDate);
                            if (dateRange !== null) {
                              setSelectedDateRange(newDate);
                              setTempEditData({
                                ...tempEditData,
                                timePeriod: dateRange,
                              });
                            }
                          }
                        }}
                        maxValue={today(getLocalTimeZone())}
                        value={selectedDateRange}
                      />
                    </div>
                  </div>
                ) : (
                  <p>{date}</p>
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
                  // disabled={!tempEditData.metricsGroup && !tempEditData.timePeriod}
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
                    setTempEditData({
                      ...tempEditData,
                      metricsGroup: searchData?.search.metricsGroup?._id,
                      // timePeriod:
                    });
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
          </div>{" "}
        </div>{" "}
        <ApolloProvider client={apolloClient}>
          {searchData && <Dashboard search={searchData.search} />}
        </ApolloProvider>
        {/* Snackbar feedback */}
        <SnackBar
          type={snackBarState.type}
          isOpen={snackBarState.open}
          title={snackBarState.message}
          onDismiss={() => updateSnackBarState("open", false)}
        />
      </div>
    </Suspense>
  );
}
