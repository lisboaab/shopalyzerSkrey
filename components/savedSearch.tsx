"use client";

import "../app/globals.css";
import React, { JSX } from "react";
import ButtonAnimation from "./buttonAnimation";
import { useState } from "react";
import ModalDeleteSavedSearch from "./modal/modalDeleteSavedSearch";

interface Search {
  title: string;
  lastAcces: string;
  createdAt: string;
  metricsGroup: any;
}

interface SavedSearch {
  search: Search;
}
const SavedSearch: React.FC<SavedSearch> = (search) => {
  const [showModal, setShowModal] = useState(false);

  const modalHandler = () => {
    setShowModal((curr) => !curr);
  };

  const iconMap: Record<string, JSX.Element> = {
    pencil: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
        />
      </svg>
    ),
    money: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    analytics: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
        />
      </svg>
    ),
    group: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="size-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  };

  return (
    <div className="p-5 bg-electric50 rounded-xl flex flex-col gap-8 w-80 h-92 cursor-pointer">
      {/* header */}
      <div className="flex flex-row gap-8 items-center">
        {/* icon */}
        <div className="bg-electric400 flex rounded-full items-center justify-center w-15 h-15">
          {iconMap[search.search.metricsGroup.icon] || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          )}
        </div>

        <div>
          <h1 className="gellix-semibold text-lg w-45 truncate">{search.search.title}</h1>
          <p className="gellix">{search.search.lastAcces}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="gellix-semibold">
          Metrics group:{" "}
          <span className="gellix"> {search.search.metricsGroup.title} </span>
        </p>
        <div className="flex flex-row gap-1">
          <p className="gellix-semibold">Metrics list:</p>
          <div className="max-w-48">
            {search.search.metricsGroup.metricsList
              .slice(0, 4)
              .map((index: string) => (
                <p key={index} className="truncate gellix">
                  {index}
                </p>
              ))}
            {search.search.metricsGroup.metricsList.length > 4 ? (
              <p className="text-gray-400 text-sm gellix">More...</p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="place-self-end">
        <ButtonAnimation
          style="outline"
          color="red"
          icon="trashcan"
          label="Delete search"
          action={modalHandler}
          width="12em"
        />
      </div>
      <ModalDeleteSavedSearch
        isOpen={showModal}
        onDismiss={modalHandler}
        title="Are you sure you want to delete this?"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          <h1 className="text-black">
            This action can not be undone and you will loose this information
            forever!
          </h1>

          <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-5">
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={modalHandler}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Delete"
              color="white"
              backgroundColor="red"
              icon="trashcan"
              action={modalHandler}
              width="10em"
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>
    </div>
  );
};

export default SavedSearch;
