import LoadingData from "../../../components/loadingData";
import { Suspense } from "react";
import SavedSearch from "@/components/savedSearch";
import EmptyState from "@/components/emptyState";

export default async function Page() {
  const savedItems = [
    {
      title: "Search 01",
      lastAcces: "3 days ago",
      createdAt: "03/04/2025",
      metricsGroup: {
        title: "Marketing",
        icon: "pencil",
        metricsList: [
          "Cost per Click",
          "Click rate",
          
        ],
      },
    },
    {
      title: "This is a veery long title that will be cut off",
      lastAcces: "3 days ago",
      createdAt: "03/04/2025",
      metricsGroup: {
        title: "Sales",
        icon: "money",
        metricsList: [
          "Cost per Click",
          "Click rate",
          "Conversion Rate",
          "Impressions",
          "Customer acquisition costs",
        ],
      },
    },
    {
      title: "Search 03",
      lastAcces: "3 days ago",
      createdAt: "03/04/2025",
      metricsGroup: {
        title: "Analytics",
        icon: "analytics",
        metricsList: [
          "Cost per Click",
          "Click rate",
          "Conversion Rate",
          "Impressions",
          "Customer acquisition costs",
        ],
      },
    },
    {
      title: "Search 04",
      lastAcces: "3 days ago",
      createdAt: "03/04/2025",
      metricsGroup: {
        title: "Engagement",
        icon: "group",
        metricsList: [
          "Cost per Click",
          "Click rate",
          "Conversion Rate",
          "Impressions",
          "Customer acquisition costs",
        ],
      },
    },
    {
      title: "Search 05",
      lastAcces: "3 days ago",
      createdAt: "03/04/2025",
      metricsGroup: {
        title: "Marketing",
        icon: "pencil",
        metricsList: [
          "Cost per Click",
          "Click rate",
          "Conversion Rate nfoefnaoejn",
          "Impressions",
          "Customer acquisition costs",
        ],
      },
    },
    {
      title: "Search 06",
      lastAcces: "3 days ago",
      createdAt: "03/04/2025",
      metricsGroup: {
        title: "Marketing",
        icon: "pencil",
        metricsList: [
          "Cost per Click",
          "Customer acquisition costs vda",
          "Click rate",
          "Conversion Rate",
          "Impressions",
          "Customer acquisition costs",
        ],
      },
    },
  ];
  // const savedItems = []
  return (
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-3">
        <h1 className="worksans text-2xl">Your saved searches</h1>
        <h1 className="worksans text-md grey800">
          See and analize again your saved searches! Don’t worry nothing is
          lost!
        </h1>
      </div>
      <Suspense fallback={<LoadingData />}>
        <div className="flex flex-row flex-wrap items-center w-full gap-16">
          {savedItems.length != 0 && savedItems.map((search, index) => (
            <SavedSearch key={index} search={search} />
          ))}
          {savedItems.length == 0 &&  <EmptyState/>}
        </div>
      </Suspense>
    </div>
  );
}
