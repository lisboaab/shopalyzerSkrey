"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateRangePicker } from "@heroui/date-picker";
import { today } from "@internationalized/date";

// Queries
import {
  getUserName,
  getStoresBasic,
  getActiveGroups,
  createSearch,
} from "@/lib/queries";

// Interface
import type Store from "../../interface/store";
import type Metric from "../../interface/metric";
import type Group from "../../interface/group";

// Components
import ButtonAnimation from "@/components/buttonAnimation";
import Loading from "@/components/loading";
import ButtonCustomMetricsDialog from "@/components/ButtonCustomMetricsDialog";
import MultiSelect from "@/components/multiSelect";
import Select from "@/components/select";

export default function Page() {
  const [store, setStore] = useState<string | string[]>("");
  const [metricsGroup, setMetricsGroup] = useState("");
  const [date, setDate] = useState<null | any>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [customMetrics, setCustomMetrics] = useState<Metric[]>([]);
  const [metricsGroupList, setMetricsGroupList] = useState<any[]>([""]);
  const [pencilButtonActive, setPencilButtonActive] = useState(false);
  const [customGroup, setCustomGroup] = useState<Group>();
  const [selectedStores, setSelectedStores] = useState([]);

  const storeOptions = storesList.map((store) => ({
    value: store._id,
    label: store.name,
  }));

  const metricsGroupsOptions = metricsGroupList.map((group) => ({
    value: group._id,
    label: group.name,
  }));

  useEffect(() => {
    const ID = localStorage.getItem("userID");
    if (!ID) return;
    const fetchUser = async () => {
      try {
        const user = await getUserName(ID);
        if (user) {
          const userName = user.name.split(" ");
          setName(userName[0]);
          setLoading(false);
        }
      } catch (error) {
        router.push("/");
        console.error("Error fetching user name:", error);
      }
    };
    fetchUser();
  }, [name]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const stores = await getStoresBasic();
        if (stores) {
          const storesSorted = [...stores].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setStoresList(storesSorted);
        } else {
          console.error("stores not found");
        }
      } catch (error) {
        console.error("Error fetching stores", error);
      }
    };
    fetchStores();
  }, []);

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
          } else {
            console.error("Custom group not found");
          }
        } else {
          console.error("Groups not found");
        }
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, []);

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

  const handleMetricsGroupChange = (value: string) => {
    setMetricsGroup(value);
    if (value === customGroup?._id) {
      setPencilButtonActive(true);
    } else {
      setPencilButtonActive(false);
      setCustomMetrics([]);
    }
  };

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      selectedStores.length === 0 ||
      metricsGroup === "" ||
      !date ||
      !date.start ||
      !date.end
    ) {
      setLoading(false);
      let message = document.getElementById("errorMessage");
      if (message) {
        message.classList.remove("hidden");
        message.classList.add("flex");
        setTimeout(() => {
          message.classList.remove("flex");
          message.classList.add("hidden");
        }, 5000);
      }
    } else if (
      metricsGroup === customGroup?._id &&
      customMetrics.length === 0
    ) {
      setLoading(false);
      let message = document.getElementById("errorMessageCustomMetrics");
      if (message) {
        message.classList.remove("hidden");
        message.classList.add("flex");
        setTimeout(() => {
          message.classList.remove("flex");
          message.classList.add("hidden");
        }, 5000);
      }
    } else {
      setLoading(false);
      const userID = localStorage.getItem("userID");
      if (!userID) return;
      let metricsList: any[] = [];
      if (metricsGroup === customGroup?._id) {
        if (customMetrics.length > 0) {
          customMetrics.map((m) => {
            metricsList.push(m._id);
          });
        }
      } else {
        const metricsOfGroup = metricsGroupList.find(
          (group) => group._id === metricsGroup
        )?.metrics;
        metricsOfGroup.map((m: any) => {
          metricsList.push(m._id);
        });
      }

      const convertedRange = convertDateRange(date);
      const input = {
        store: selectedStores,
        metricsGroup: metricsGroup,
        timePeriod: convertedRange ?? "",
        metrics: metricsList,
        userID: userID,
      };
      const newSearch = await createSearch(input);
      router.push("/dashboard/" + newSearch.createSearch._id);
    }
  };

  const reset = () => {
    setSelectedStores([]);
    setMetricsGroup("");
    setDate(null);
    setPencilButtonActive(false);
  };

  return loading ? (
    <Loading />
  ) : (
    !loading && (
      <Suspense fallback={<Loading />}>
        <div className="h-160 w-full flex items-center justify-center p-8">
          <div
            id="content"
            className="flex items-center justify-center flex-col gap-6 w-full max-w-4xl"
          >
            <div className="flex flex-col justify-center items-center gap-1">
              <h1 className="text-bold worksans-semibold text-3xl">
                Hello,{" "}
                <span className="main worksans-semibold text-3xl">{name}</span>
              </h1>
              <h2 className="gellix-semibold text-lg">
                What do you want to search today?
              </h2>
            </div>
            <form
              onSubmit={analyze}
              className="flex flex-col justify-center items-center gap-8 w-full"
            >
              {/* Filters */}
              <div className="border border-gray-200 p-8 rounded-xl w-full flex flex-row gap-15">
                {/* Stores */}
                <div className="max-w-sm mx-auto">
                  <label className="block text-sm font-medium text-gray-900 gellix mb-5">
                    Stores
                  </label>
                  <MultiSelect
                    options={storeOptions}
                    value={selectedStores}
                    onChange={setSelectedStores}
                    placeholder="Select stores"
                    className="w-55"
                  />
                </div>
                {/* Group of metrics */}
                <div className="max-w-sm mx-auto">
                  <div className="flex flex-row justify-start items-center gap-2 mb-2">
                    <label className="block mb-3 text-sm font-medium text-gray-900 gellix">
                      Group of metrics{" "}
                    </label>
                    {pencilButtonActive && (
                      <div
                        id="pencilButton"
                        className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        <ButtonCustomMetricsDialog
                          setCustomMetrics={setCustomMetrics}
                        />
                      </div>
                    )}
                  </div>
                  {/* <select
                    value={metricsGroup}
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix outline-none"
                    onChange={(e) => {
                      setMetricsGroup(e.target.value);
                      if (e.target.value === customGroup?._id) {
                        setPencilButtonActive(true);
                      } else {
                        setPencilButtonActive(false);
                      }
                    }}
                  >
                    <option value="" key="default-metrics">
                      Select an option
                    </option>
                    {metricsGroupList.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select> */}
                  <Select
                    options={metricsGroupsOptions}
                    value={metricsGroup}
                    onChange={handleMetricsGroupChange}
                    placeholder="Select group"
                    className="w-55"
                  />
                </div>
                {/* Date range */}
                <div className="max-w-sm mx-auto">
                  <label className="block mb-5 text-sm font-medium text-gray-900 gellix">
                    Duration
                  </label>
                  <div className="border border-gray-200 text-gray-900 rounded-lg w-fit h-11 p-3 outline-none items-center">
                    <DateRangePicker
                      className="max-w-xs gellix w-63"
                      calendarProps={{
                        classNames: {
                          base: "bg-gray-50 gellix rounded-lg shadow-lg",
                          prevButton:
                            "hover:bg-gray-200 gellix items-center justify-center",
                          nextButton:
                            "hover:bg-gray-200 gellix items-center justify-center",
                          gridHeader:
                            "border-b-1 gellix border-gray-300 text-gray-500",
                          cellButton: [
                            // Disable dates
                            "data-[disabled=true]:opacity-40 data-[disabled=true]:line-through data-[disabled=true]:bg-danger-50",
                            // Focused date styling
                            "data-[focused=true]:border-1 data-[focused=true]:border-blue-900",
                            // Range styling - start date
                            "data-[selection-start=true]:bg-blue-600 data-[selection-start=true]:text-white data-[selection-start=true]:rounded-2xl",
                            // Range styling - end date
                            "data-[selection-end=true]:bg-blue-600 data-[selection-end=true]:text-white data-[selection-end=true]:rounded-2xl",
                            // Style for selected dates
                            "data-[selected=true]:bg-blue-100 data-[selected=true]:text-black data-[selected=true]:rounded-none",
                          ],
                        },
                      }}
                      value={date}
                      onChange={(newDate) => {
                        if (newDate) {
                          setDate({
                            start: newDate.start,
                            end: newDate.end,
                          });
                        }
                      }}
                      maxValue={today("UTC")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-4 w-full">
                <div className="flex flex-row justify-center items-center gap-4 w-full">
                  <ButtonAnimation
                    label="Clear"
                    icon="update"
                    style="outline"
                    color="#8B93A5"
                    type="reset"
                    width="9em"
                    action={reset}
                  ></ButtonAnimation>
                  <ButtonAnimation
                    type="submit"
                    label="Start analyzing data"
                    color="white"
                    backgroundColor="#0D0DFC"
                    icon="arrow"
                    width="18em"
                  />
                </div>
                {/* Error message */}
                <div
                  id="errorMessage"
                  className="flex-row justify-center items-center gap-2 mt-4 hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                  <p className="gellix text-red-500">
                    All fields are required!
                  </p>
                </div>
                <div
                  id="errorMessageCustomMetrics"
                  className="flex-row justify-center items-center gap-2 mt-4 hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                  <p className="gellix text-red-500">
                    Select at least one metric.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Suspense>
    )
  );
}
