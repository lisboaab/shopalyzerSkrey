"use client";
import "../../app/globals.css";
import { useState, useEffect, useCallback } from "react";
import Loading from "@/components/loading";
import EmptyState from "@/components/emptyState";
import SnackBar from "../modal/snackBar";

// interface
import Metric from "../../app/interface/metric";

// queries
import { getMetrics, updateMetricStatus } from "@/lib/queries";

const MetricsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any>([]);
  // const [selectectMetrics, setSelectedMetrics] = useState<Metric[]>([]);
  const [metricsList, setMetricsList] = useState<Metric[]>([]);

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

  const handleConsoleClick = () => {
    console.log("clicked");
  };

  const fetchData = async () => {
    try {
      const fetchedData = await getMetrics();
      if (fetchedData) {
        const result = Array.isArray(fetchedData) ? fetchedData : [];
        setMetricsList(result);
      }
    } catch (error) {
      console.log("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [metricsList]);

  const filteredMetrics =
    searchQuery.length < 3
      ? [...metricsList].sort((a, b) => a.name.localeCompare(b.name))
      : [...metricsList].filter((m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name));



  const handleUpdateMetricStatus = async (id: string, status: "active" | "inactive") => {
      try {
        const input = {
          status: status
        }
        await updateMetricStatus(id, input);
        console.log(status)
        handleSnackBar("success", "Metric updated successfully!");
        fetchData();
      } catch (error) {
        console.error(error)
        handleSnackBar("failure", "Something went wrong while updating!");
      }
    };

  return (
    !loading ? (
    <div>
      <div className="flex flex-row items-center justify-between pr-5">
        <p className="text-lg worksans-semibold">Metrics management</p>
        <label className="gap-3 flex flex-row items-center border border-gray-200 text-gray-900 text-sm rounded-lg w-55 p-3 gellix">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="gray"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            minLength={3}
            placeholder="Search metrics..."
            className="bg-transparent outline-none text-gray-900 gellix h-full"
          />
        </label>
      </div>
      {/* metrics fields */}
      <div className="my-4 flex flex-col items-center gap-8 h-full overflow-x-auto w-full">
        <div className="flex flex-row no-wrap gap-x-10 gap-y-3 flex-wrap">
          {filteredMetrics.length != 0 &&
            filteredMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center gap-4 bg-electric50 rounded-md p-4 mb-2 w-80"
              >
                <div className="flex-col w-60">
                  <p className="text-gray-900 gellix text-lg cursor-pointer">
                    {metric.name}
                  </p>
                  <p className="grey800 wrap text-sm">{metric.description}</p>
                </div>
                <input
                  type="checkbox"
                  id={`metric-${index}`}
                  className="h-5 w-5 cursor-pointer color-blue-500"
                  checked={metric.status === 'active'}
                  onChange={(e) => {
                    const newStatus = e.target.checked ? 'active' : 'inactive';
                    if (metric._id) handleUpdateMetricStatus(metric._id, newStatus);
                  }}
                />
              </div>
            ))}
          {filteredMetrics.length == 0 && <EmptyState />}
        </div>
      </div>

      {/* Snackbar para feedback */}
      <SnackBar
        type={snackBarState.type}
        isOpen={snackBarState.open}
        title={snackBarState.message}
        onDismiss={() => updateSnackBarState("open", false)}
      />
    </div>
    ) : (
      <Loading />
    )
  );
};

export default MetricsManagement;
