import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type Search from "../app/interface/search"

import { getUserSearches, removeSearch } from "@/lib/queries";

import RecentSearch from "./recentSearch";
import ModalDelete from "./modal/modalDelete";
import ButtonAnimation from "./buttonAnimation";
import SnackBar from "./modal/snackBar";

interface NavBarProps {
  buttonFunction: () => void;
}

const NavBarExpanded: React.FC<NavBarProps> = ({ buttonFunction }) => {
  const [showModal, setShowModal] = useState(false);
  const [searches, setSearches] = useState<Search[]>([]);
  const [selectedSearchId, setSelectedSearchId] = useState<string>("");
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

  const router = useRouter();
  const goToNewSearch = () => {
    if (router) {
      router.push("/new");
    }
  };
  const goToSavedSearches = () => {
    if (router) {
      router.push("/saved");
    }
  };
  const goToHome = () => {
    if (router) {
      router.push("/");
    }
  };

   const modalHandler = () => {
    setShowModal((curr) => !curr);
  };

  const handleRemoveSearch = async (
    id: string
  ) => {
      try {
        await removeSearch(id);
        setSearches((prevData: any) =>
          prevData.filter((search: any) => search._id !== id)
        );
        modalHandler();
        handleSnackBar("success", "Search deleted successfully!");
      } catch (error) {
        console.error("Error removing search:", error);
        handleSnackBar("error", "Failed to remove search.");
      }
    };

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }
    const getUserSearchesData = async () => {
      const data = await getUserSearches(userId);
      if(data){
        // console.log("User searches data:", data);
        const sortedData = [...data].sort((a, b) =>
            b.updatedAt.localeCompare(a.updatedAt)
          );
        setSearches(sortedData? sortedData : data);
      }
    }
    getUserSearchesData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-10 justify-between">
      {/* Hamburguer menu icon + logo */}
      <div className="flex flex-row justify-between items-center w-full">
        <Image
          src="/logoWhite2.svg"
          alt="Shopalyzer white logo"
          width={120}
          height={100}
          onClick={goToHome}
          className="cursor-pointer"
        />
        <button onClick={buttonFunction} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-8"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Main buttons */}
      <div className="flex flex-col gap-4 w-full">
        {/* New search button */}
        <ButtonAnimation
          label="New Search"
          color="#0D0DFC"
          backgroundColor="white"
          action={goToNewSearch}
          icon="add"
        />

        {/* Saved searches button */}
        <ButtonAnimation
          label="Saved Searches"
          color="white"
          backgroundColor="#0D0DFC20"
          action={goToSavedSearches}
          icon="bookmark"
          style="outline"
        />
      </div>

      {/* Recent searches */}
      <div className="w-full justify-self-start">
        <h2 className="gellix-semibold pb-4">Recent searches</h2>
        {searches.map((search, index) => (
          <RecentSearch key={index} search={search} deleteFunction={() => {
            setSelectedSearchId(search._id);
            modalHandler()
          }} />
        ))}
        {searches.length === 0 && (
          <p className="gellix pb-4">Nothing here</p>
        )}
      </div>
      <ModalDelete
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
              backgroundColor="#DE1B1B"
              icon="trashcan"
              action={() => {
                if (selectedSearchId) {handleRemoveSearch(selectedSearchId);}
              }}
              width="10em"
            />
          </div>
        </div>
      </ModalDelete>
      <SnackBar
        type={snackBarState.type}
        isOpen={snackBarState.open}
        title={snackBarState.message}
        onDismiss={() => updateSnackBarState("open", false)}
      ></SnackBar>
    </div>
  );
};

export default NavBarExpanded;
