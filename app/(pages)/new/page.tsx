"use client";
import { Suspense, useEffect, useState, useContext, createContext } from "react";
import { useRouter } from "next/navigation";

// Queries
import { getUserName, getStoresBasic, getActiveGroups } from "@/lib/queries"

// Interface
import type Store from "../../interface/store"
import type Metric from "../../interface/metric"

// Components
import ButtonAnimation from "@/components/buttonAnimation";
import Loading from "@/components/loading";
import ButtonCustomMetricsDialog from "@/components/ButtonCustomMetricsDialog";

export default function Page() {
  const [store, setStore] = useState("");
  const [metricsGroup, setMetricsGroup] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [customMetrics, setCustomMetrics] = useState<Metric[]>([])
  const [metricsGroupList, setMetricsGroupList] = useState<any[]>([""])
  
  useEffect(() => {
    const ID = localStorage.getItem("userID");
    if (!ID) return;

    const fetchUser = async () => {
      try {
        const user = await getUserName(ID);
        if (user) {
          const userName = user.name.split(" ")
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
          const storesSorted = [...stores].sort((a, b) => a.name.localeCompare(b.name))
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
          const groupsSorted = [...groups].sort((a, b) => a.name.localeCompare(b.name))
          setMetricsGroupList(groupsSorted);
        } else {
          console.error("groups not found");
        }
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };

    fetchGroups();

  }, []);

  useEffect(() => {
    if (metricsGroup === "Custom"){

    }
  }, []);

  const analyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (store === "" || metricsGroup === "" || date === "") {
      let message = document.getElementById("errorMessage");
      if (message) {
        message.classList.remove("hidden");
        message.classList.add("flex");
        setTimeout(() => {
          message.classList.remove("flex");
          message.classList.add("hidden");
        }, 5000);
      }
    } else {
      console.log("Analyzing data...");
      // Add your analysis logic here
    }
  };

  const reset = () => {
    setStore("");
    setMetricsGroup("");
    setDate("");
  };

  const dateRangeList = [
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Last 180 days",
    "Last 365 days",
  ];

  return loading ? (
    <Loading />
  ) : (
    !loading && (
      <div className=" h-full w-full flex items-center justify-center p-8 flex-col">
          <div className="flex flex-col justify-center items-center gap-6">
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                    Stores
                  </label>
                  <select
                    value={store}
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix outline-none"
                    onChange={(e) => setStore(e.target.value)}
                    required
                  >
                    <option value="">Select an option</option>
                    {storesList.map((store: Store) => (
                      <option
                        key={store._id}
                        value={store._id}
                      >
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Group of metrics */}
                <div className="max-w-sm mx-auto">
                  <div className="flex flex-row justify-start items-bottom gap-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                      Group of metrics{" "}
                    </label>
                    <ButtonCustomMetricsDialog setMetricsGroup={setMetricsGroup} setCustomMetrics={setCustomMetrics}/>
                  </div>
                  <select
                    value={metricsGroup}
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix outline-none"
                    onChange={(e) => setMetricsGroup(e.target.value)}
                    required
                  >
                    <option value="">Select an option</option>
                    {metricsGroupList.map((group) => (
                      <option
                        key={group._id}
                        value={group._id}
                      >
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Date range */}
                <div className="max-w-sm mx-auto">
                  <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                    Duration
                  </label>
                  <select
                    value={date}
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix outline-none"
                    onChange={(e) => setDate(e.target.value)}
                    required
                  >
                    <option value="">Select an option</option>
                    {dateRangeList.map((date) => (
                      <option
                        key={date}
                        value={date.toLowerCase().replaceAll(" ", "_")}
                      >
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
              </div>
            </form>
          </div>
          <div>
            Chosen options:
            <ul className="list-disc list-inside">
              <li>Store: {store}</li>
              <li>Group of metrics: {metricsGroup}</li>
              {metricsGroup === "custom" ? (customMetrics.map((m) => {
                return <p>{m.name}</p>
              })): ("")}
              <li>Date range: {date}</li>
            </ul>
          </div>
      </div>
    )
  );
}
