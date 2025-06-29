"use client";
import { Suspense, useEffect, useState } from "react";

import LoadingData from "@/components/loadingData";
import SavedSearch from "@/components/savedSearch";
import EmptyState from "@/components/emptyState";
import Loading from "@/components/loading";
import SnackBar from "@/components/modal/snackBar";

// Queries
import {
  getUserFavoriteSearches,
  removeSearch,
  updateSearch,
} from "@/lib/queries";

export default function Page() {
  const [loadedItems, setLoadedItems] = useState<any[]>([]);

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

  const handleDeleteSearch = async (id: string) => {
    try {
      const remove = await removeSearch(id);
      if (remove) {
        setLoadedItems((prev) => prev.filter((item) => item._id !== id));
        handleSnackBar("success", "Search deleted successfully!");
      } else {
        handleSnackBar("error", "Error deleting search");
      }
    } catch (error) {
      handleSnackBar("error", "Error deleting search");
    }
  };

  const handleUnsaveSearch = async (id: string) => {
    try {
      const input = {
        isSaved: false,
      };
      const unsave = await updateSearch(id, input);
      if (unsave) {
        setLoadedItems((prev) => prev.filter((item) => item._id !== id));
        handleSnackBar("success", "Search unsaved successfully!");
      } else {
        handleSnackBar("error", "Error unsaving search");
      }
    } catch (error) {
      handleSnackBar("error", "Error unsaving search");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      return;
    }
    const fetchUserFavoriteSearches = async () => {
      const loadedItems = await getUserFavoriteSearches(userId);
      const sortedItems = [...loadedItems].sort(
        (a: any, b: any) => b.updatedAt - a.updatedAt
      );
      setLoadedItems(sortedItems);
    };
    fetchUserFavoriteSearches();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
    <div className="w-full h-fit flex flex-col gap-8 items-start">
      <div className="flex flex-col gap-3">
        <h1 className="worksans text-2xl">Your saved searches</h1>
        <h1 className="worksans text-md grey800">
          Check and analyze again your saved searches! Don’t worry, nothing is
          lost!
        </h1>
      </div>
      <Suspense fallback={<LoadingData />}>
        <div className="flex flex-row flex-wrap items-center w-full gap-16">
          {" "}
          {loadedItems.length !== 0 &&
            loadedItems.map((search, index) => (
              <SavedSearch
                key={search._id || index}
                search={search}
                onDelete={() => handleDeleteSearch(search._id)}
                onUnsave={() => handleUnsaveSearch(search._id)}
              />
            ))}
          {loadedItems.length === 0 && <EmptyState />}
        </div>
      </Suspense>
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
