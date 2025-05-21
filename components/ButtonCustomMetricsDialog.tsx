"use client";
import React from "react";
import "../app/globals.css";
import { useState, useEffect } from "react";

// Interface
import Metric from "../app/interface/metric";

// Components
import ModalMetrics from "./modal/modalMetrics";
import ButtonAnimation from "./buttonAnimation";
import EmptyState from "./emptyState";

// queries
import { getActiveMetrics } from "@/lib/queries";

interface Props {
  setMetricsGroup: (value: string) => void;
  setCustomMetrics: (value: Metric[]) => void;
}

const ButtonCustomMetricsDialog: React.FC<Props> = ({
  setMetricsGroup,
  setCustomMetrics,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [metricsList, setMetricsList] = useState<Metric[]>([]);

  const modalHandler = () => {
    setShowModal((curr) => !curr);
    setSearchQuery("");
    setMetricsGroup("681b9229fb80a7c0ec3990a3");
  };

  const saveMetrics = () => {
    const selected = metricsList.filter((m) =>
      selectedMetrics.includes(m._id ?? "")
    );
    setCustomMetrics(selected);
    setShowModal(false);
  };

  const fetchData = async () => {
    try {
      const fetchedData = await getActiveMetrics();
      if (fetchedData) {
        const result = Array.isArray(fetchedData) ? fetchedData : [];
        setMetricsList(result);
      }
    } catch (error) {
      console.log("Error fetching metrics:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredMetrics =
    searchQuery.length < 3
      ? [...metricsList].sort((a, b) => a.name.localeCompare(b.name))
      : [...metricsList]
          .filter((m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      {/* pencil SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="blue"
        className="size-5 cursor-pointer z-200"
        onClick={(e) => {
          e.stopPropagation();
          modalHandler();
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
        />
      </svg>

      <ModalMetrics
        isOpen={showModal}
        onDismiss={() => {
          setShowModal(false);
          setSearchQuery("");
        }}
        title="Select your own metrics"
      >
        {/* header */}
        <div className="flex flex-row items-baseline justify-between gap-4 w-full pb-3">
          {/* subtitle */}
          <h1 className="text-black pb-5">
            Select the metrics you want to base your search on and save it!
          </h1>
          {/* search input */}
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
        <div className="my-4 flex flex-col gap-8 h-120 overflow-x-auto w-full">
          <div className={`flex flex-row flex-wrap gap-x-10 gap-y-3`}>
            {filteredMetrics.length != 0 &&
              filteredMetrics.map((metric, index) => (
                <div
                  key={metric._id}
                  className="flex flex-row justify-between gap-4 bg-electric50 rounded-md p-4 mb-2 w-80"
                >
                  <label className="flex flex-row items-center justify-between w-full">
                    <div className="flex-col w-60">
                      <p className="text-gray-900 gellix text-lg cursor-pointer truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        {metric.name}
                      </p>
                      <p className="grey800 wrap text-sm">
                        {metric.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      id={`metric-${index}`}
                      className="h-5 w-5 cursor-pointer color-blue-500"
                      checked={selectedMetrics.includes(metric._id ?? "")}
                      onChange={(e) => {
                        if (metric._id) {
                          if (e.target.checked) {
                            setSelectedMetrics((prev) => [
                              ...prev,
                              metric._id!,
                            ]);
                          } else {
                            setSelectedMetrics((prev) =>
                              prev.filter((item) => item !== metric._id)
                            );
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              ))}
            {filteredMetrics.length == 0 && <EmptyState />}
          </div>
        </div>
        {/* "footer" */}
        <div className="flex flex-col justify-center items-end gap-4 border-t border-gray-200 pt-5">
          <div className="flex flex-row gap-4 items-baseline">
            {/* main buttons */}
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={modalHandler}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Save"
              color="white"
              backgroundColor="blue"
              icon="arrow"
              action={saveMetrics}
              width="10em"
              disabled={selectedMetrics.length === 0}
            />
          </div>
        </div>
      </ModalMetrics>
    </div>
  );
};

export default ButtonCustomMetricsDialog;
