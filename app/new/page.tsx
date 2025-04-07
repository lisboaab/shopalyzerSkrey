"use client";
import ButtonAnimation from "@/components/buttonAnimation";
import { Suspense } from "react";
import Loading from "@/components/loading";

export default async function Page() {
  const log = () => {
    console.log("Started analyzing");
  };
  return (
    <div className=" h-full w-full flex items-center justify-center h-full p-8">
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
          {/* Filters */}
          <div className="border border-gray-200 p-8 rounded-xl w-full flex flex-row gap-15">
            {/* Stores */}
            <div className="max-w-sm mx-auto">
              <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                Stores
              </label>
              <select
                id="countries"
                className="border border-gray-200 text-gray-900 text-sm rounded-lg w-full p-3 gellix"
                aria-placeholder="hello"
              >
                <option selected>Select what you want</option>
                <option value="US">Bershka</option>
                <option value="CA">Pull and Bear</option>
                <option value="FR">Stradivarius</option>
                <option value="DE">Zara</option>
              </select>
            </div>
            {/*Group of metrics  */}
            <div className="max-w-sm mx-auto">
              <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                Group of metrics
              </label>
              <select
                id="countries"
                className="border border-gray-200 text-gray-900 text-sm rounded-lg w-full p-3 gellix"
                aria-placeholder="hello"
              >
                <option selected>Select an option</option>
                <option value="US">Bershka</option>
                <option value="CA">Pull and Bear</option>
                <option value="FR">Stradivarius</option>
                <option value="DE">Zara</option>
              </select>
            </div>
            {/* Date range */}
            <div className="max-w-sm mx-auto">
              <label className="block mb-2 text-sm font-medium text-gray-900 gellix">
                Date range
              </label>
              <select
                id="countries"
                className="border border-gray-200 text-gray-900 text-sm rounded-lg w-full p-3 gellix"
                aria-placeholder="hello"
              >
                <option selected>Select an option</option>
                <option value="US">Bershka</option>
                <option value="CA">Pull and Bear</option>
                <option value="FR">Stradivarius</option>
                <option value="DE">Zara</option>
              </select>
            </div>
          </div>
          <ButtonAnimation
            label="Start analyzing data"
            color="#0D0DFC"
            style="outline"
            action={log}
            icon="arrow"
            width="18em"
          />
        </div>
      </Suspense>
    </div>
  );
}
