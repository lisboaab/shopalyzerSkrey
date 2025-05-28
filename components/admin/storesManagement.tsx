"use client";
import "../../app/globals.css";
import { useState, useEffect, useCallback } from "react";

import {
  getStores,
  removeStore,
  updateStore,
  createStore,
} from "@/lib/queries";

import Store from "../../app/interface/store";

import ArrowUp from "@/components/icons/arrowUp";
import ArrowDown from "@/components/icons/arrowDown";
import Loading from "@/components/loading";
import EmptyState from "@/components/emptyState";
import ButtonAnimation from "@/components/buttonAnimation";

import SnackBar from "../modal/snackBar";
import ModalDeleteSavedSearch from "../modal/modalDeleteSavedSearch";

const StoresManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [storeToBeDeleted, setStoreToBeDeleted] = useState("");
  const [storeToBeEdited, setStoreToBeEdited] = useState<Store | null>(null);
  const [newStore, setNewStore] = useState<any>({
    shopUrl: "",
    APIKey: "",
    APIToken: "",
    APISecretKey: "",
  });

  const [snackBarState, setSnackBarState] = useState({
    open: false,
    type: "",
    message: "",
  });

  const areYouSureDelete = (id: string) => {
    setStoreToBeDeleted(id);
    updateModalState("remove", true);
  };

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

  const [modalState, setModalState] = useState({
    remove: {
      isOpen: false,
    },
    edit: {
      isOpen: false,
    },
    create: {
      isOpen: false,
    },
  });

  const updateModalState = (key: string, value: any) => {
    setModalState((prev) => ({ ...prev, [key]: { isOpen: value } }));
  };

  const tableHeader = [
    { item: "ID", sortable: true },
    { item: "Name", sortable: true },
    { item: "Store Shopify URL", sortable: true },
    { item: "Updated at", sortable: true },
    { item: "Last modified by", sortable: true },
    {
      item: "Actions",
      sortable: false,
      actions: [
        // "edit",
        "remove",
      ],
    },
  ];

  const fetchData = async () => {
    try {
      const fetchedData = await getStores();
      if (fetchedData) {
        const result = Array.isArray(fetchedData) ? fetchedData : [];
        setData(result);
      }
    } catch (error) {
      console.log("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveStore = async (id: string) => {
    try {
      await removeStore(id);
      setData((prevData: any) =>
        prevData.filter((user: any) => user._id !== id)
      );
      setModalState((prev) => ({
        ...prev,
        remove: {
          ...prev.remove,
          isOpen: false,
        },
      }));
      handleSnackBar("success", "Store deleted successfully!");
    } catch (error) {
      console.error("Error removing store:", error);
      handleSnackBar("error", "Failed to remove store.");
    }
  };

  const handleEditStore = (store: Store) => {
    setStoreToBeEdited(store);
    updateModalState("edit", true);
  };

  const handleSaveStoreEdit = async (id: string, storeToBeEdited: Store) => {
    try {
      const store = {
        shopUrl: storeToBeEdited.shopUrl,
      };
      await updateStore(id, store);
      updateModalState("edit", false);
      handleSnackBar("success", "Store updated successfully!");

      fetchData();
    } catch (error) {
      if (error === "Email already in use.") {
        handleSnackBar("failure", "Email already in use");
      } else handleSnackBar("failure", "Something went wrong while updating!");
    }
  };

  const createNewStore = async () => {
    try {
      if (
        !newStore.shopUrl ||
        !newStore.APIKey ||
        !newStore.APIToken ||
        !newStore.APISecretKey
      ) {
        handleSnackBar("failure", "Please, fill up all the fields");
        return;
      } 
      else if (!newStore.shopUrl.endsWith(".myshopify.com")) {
        handleSnackBar("failure", "Please, enter a valid store Url");
        return;
      }
      else {
        await createStore(newStore);
        handleSnackBar("success", "Store created successfully!");
        updateModalState("create", false);

        fetchData();
        setNewStore({
          shopUrl: "",
          APIKey: "",
          APIToken: "",
          APISecretKey: "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        if (error.message === "This shopUrl is already in use.") {
          handleSnackBar("failure", "This store shopUrl is already in use");
        } else if (error.message === "This API Key is already in use.") {
          handleSnackBar("failure", "This store API Key is already in use");
        }
        if (error.message === "This API Token is already in use.")
          handleSnackBar("failure", "This store API Token is already in use");
        else if (
          error.message ===
          "Missing required fields: shopUrl, APIKey, APIToken, APISecretKey"
        ) {
          handleSnackBar("failure", "Please, fill up all the fields");
        } else {
          handleSnackBar("failure", "Something went wrong. Try again!");
        }
      } else {
        console.error("An unknown error occurred:", error);
        handleSnackBar("failure", "Something went wrong. Try again!");
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-row justify-between">
        <p className="text-lg worksans-semibold pb-5">Stores management</p>
        <ButtonAnimation
          label="New store"
          icon="add"
          color="white"
          backgroundColor="blue"
          width="12em"
          action={() => updateModalState("create", true)}
        ></ButtonAnimation>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="gellix-semibold text-md text-gray-800">
            {tableHeader.map((item, index) => (
              <th key={index} className="py-2 text-left">
                <div className="flex flex-row gap-1 items-center">
                  {item.item}
                  {item.sortable && <ArrowUp />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>          {!loading ? (
            data && data.length > 0 ? (
              data.map((store: any, index: number) => (
                <tr key={index} className="w-full gellix pb-2">
                  <td className="py-2">{store._id}</td>
                  <td className="py-2">{store.name}</td>
                  <td className="py-2">{store.shopUrl}</td>
                  <td className="py-2">
                    {new Date(Number(store.updatedAt)).toLocaleString()}
                  </td>
                  <td className="py-2">{store.lastModifiedBy?.name}</td>
                  <td className="flex flex-row  items-center justify-start py-2 gap-2">
                    {/* edit button */}
                    {/* <ButtonAnimation
                      label="Edit"
                      icon="pencil"
                      style="outline"
                      color="#4b5563"
                      width="6em"
                      action={() => handleEditStore(store)}
                    ></ButtonAnimation> */}
                    <ButtonAnimation
                      label="Remove"
                      icon="trashcan"
                      style="outline"
                      color="red"
                      width="8em"
                      action={() => areYouSureDelete(store._id)}
                    ></ButtonAnimation>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                  />
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                <Loading />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <SnackBar
        type={snackBarState.type}
        isOpen={snackBarState.open}
        title={snackBarState.message}
        onDismiss={() => updateSnackBarState("open", false)}
      ></SnackBar>

      {/* modal delete store */}
      <ModalDeleteSavedSearch
        isOpen={modalState.remove.isOpen}
        onDismiss={() => updateModalState("remove", false)}
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
              action={() => updateModalState("remove", false)}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Delete"
              color="white"
              backgroundColor="red"
              icon="trashcan"
              width="10em"
              action={() => handleRemoveStore(storeToBeDeleted)}
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>

      {/* Modal edit store */}
      <ModalDeleteSavedSearch
        isOpen={modalState.edit.isOpen}
        onDismiss={() => updateModalState("edit", false)}
        title="Edit store"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          {storeToBeEdited && (
            <div className="space-y-4">
              {/* store url */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Shop Url</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                  value={storeToBeEdited.shopUrl}
                  onChange={(e) =>
                    setStoreToBeEdited({
                      ...storeToBeEdited,
                      shopUrl: e.target.value,
                    })
                  }
                />
              </div>
              {/* store name */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                  value={storeToBeEdited.name}
                  onChange={(e) =>
                    setStoreToBeEdited({
                      ...storeToBeEdited,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-5">
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={() => updateModalState("edit", false)}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Save changes"
              color="blue"
              icon="arrow"
              action={() => {
                if (storeToBeEdited && storeToBeEdited._id) {
                  handleSaveStoreEdit(storeToBeEdited._id, storeToBeEdited);
                }
              }}
              width="12em"
              style="outline"
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>

      {/* Modal create store */}
      <ModalDeleteSavedSearch
        isOpen={modalState.create.isOpen}
        onDismiss={() => updateModalState("create", false)}
        title="Create store"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          <div className="space-y-4">
            {/* store name */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                value={newStore.name}
                onChange={(e) =>
                  setNewStore({
                    ...newStore,
                    name: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createNewStore();
                  }
                }}
              />
            </div>
            {/* store url */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Store Url</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                placeholder="Ex.: my-store.myshopify.com"
                value={newStore.shopUrl}
                onChange={(e) =>
                  setNewStore({
                    ...newStore,
                    shopUrl: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createNewStore();
                  }
                }}
              />
            </div>
            {/* store APIKey */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">API Key</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                value={newStore.APIKey}
                onChange={(e) =>
                  setNewStore({
                    ...newStore,
                    APIKey: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createNewStore();
                  }
                }}
              />
            </div>
            {/* store APIToken */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                API Access Token
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                value={newStore.APIToken}
                onChange={(e) =>
                  setNewStore({
                    ...newStore,
                    APIToken: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createNewStore();
                  }
                }}
              />
            </div>
            {/* store API secret key */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                API Secret Key
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                value={newStore.APISecretKey}
                onChange={(e) =>
                  setNewStore({
                    ...newStore,
                    APISecretKey: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createNewStore();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-5">
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={() => updateModalState("create", false)}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Create store"
              color="blue"
              icon="arrow"
              action={() => {
                createNewStore();
              }}
              width="12em"
              style="outline"
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>
    </div>
  );
};

export default StoresManagement;
