"use client";
import ButtonAnimation from "@/components/buttonAnimation";
import { Suspense } from "react";
import Loading from "@/components/loading";
import { useState } from "react";
import ButtonCustomMetricsDialog from "@/components/ButtonCustomMetricsDialog";

export default function Page() {
  const [store, setStore] = useState("");
  const [metricsGroup, setMetricsGroup] = useState("");
  const [date, setDate] = useState("");

  const analyze = () => {
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
    }
  };

  const reset = () => {
    setStore("");
    setMetricsGroup("");
    setDate("");
  }

  const storesList = [
    "Bershka",
    "Pull and Bear",
    "Abercrombie",
    "Stradivarius",
    "Zara",
    "Gato preto",
  ].sort((a, b) => a.localeCompare(b));

  const metricsGroupList = ["Sales", "Marketing", "Engagement"].sort((a, b) =>
    a.localeCompare(b)
  );

  const dateRangeList = [
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Last 180 days",
    "Last 365 days",
  ];
  return (
    <div className=" h-full w-full flex items-center justify-center p-8 flex-col">
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col justify-center items-center  gap-6">
          <div className="flex flex-col justify-center items-center  gap-1">
            <h1 className="text-bold worksans-semibold text-3xl">
              Hello,{" "}
              <span className="main worksans-semibold text-3xl">Hugo</span>
            </h1>
            <h2 className="gellix-semibold text-lg">
              What do you want to search today?
            </h2>
          </div>
          <form
            action={analyze}
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
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix outline-none"
                  onChange={(e) => setStore(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {storesList.map((store) => (
                    <option
                      key={store}
                      value={store.toLowerCase().replaceAll(" ", "_")}
                    >
                      {store}
                    </option>
                  ))}
                </select>
              </div>
              {/*Group of metrics  */}
              <div className="max-w-sm mx-auto">
                <div className="flex flex-row justify-start items-bottom gap-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                    Group of metrics{" "}
                  </label>
                  <ButtonCustomMetricsDialog />
                </div>
                <select
                  className="border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix outline-none"
                  onChange={(e) => setMetricsGroup(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {metricsGroupList.map((metric) => (
                    <option
                      key={metric}
                      value={metric.toLowerCase().replaceAll(" ", "_")}
                    >
                      {metric}
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
                // action={analyze}
                icon="arrow"
                width="18em"
              />
              {/* erro message */}
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
                <p className="gellix text-red-500">All fields are required!</p>
              </div>
            </div>
          </form>
        </div>
        <div>
          Chosen options:
          <ul className="list-disc list-inside">
            <li>Store: {store}</li>
            <li>Group of metrics: {metricsGroup}</li>
            <li>Date range: {date}</li>
          </ul>
        </div>
      </Suspense>
      {metricsGroup === "custom" && (
        <div className="flex flex-col justify-center items-center  gap-1">
          <h1 className="text-bold worksans-semibold text-3xl">
            Custom metrics{" "}
          </h1>
        </div>
      )}
    </div>
  );
}
