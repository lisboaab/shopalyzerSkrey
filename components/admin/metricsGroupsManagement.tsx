"use client";
import "../../app/globals.css";
import { useState, useEffect, useCallback } from "react";

import {
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BellAlertIcon,
  BeakerIcon,
  BookmarkIcon,
  ChartBarIcon,
  ChartPieIcon,
  CalendarIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  ClockIcon,
  Cog6ToothIcon,
  CloudIcon,
  CubeIcon,
  CurrencyDollarIcon,
  DivideIcon,
  DocumentPlusIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  GiftIcon,
  GlobeAltIcon,
  HeartIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MegaphoneIcon,
  PencilIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ServerStackIcon,
  ShareIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import {
  getGroups,
  removeGroup,
  updateGroup,
  createGroup,
  getActiveMetrics,
} from "@/lib/queries";

import Group from "../../app/interface/group";
import Metric from "../../app/interface/metric";

import ArrowUp from "@/components/icons/arrowUp";
import ArrowDown from "@/components/icons/arrowDown";
import ButtonAnimation from "@/components/buttonAnimation";
import IconSelector from "@/components/iconSelector";
import IconDisplay from "@/components/iconDisplay";

import SnackBar from "../modal/snackBar";
import ModalDeleteSavedSearch from "../modal/modalDeleteSavedSearch";

const HeroIcons = {
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BellAlertIcon,
  BeakerIcon,
  BookmarkIcon,
  ChartBarIcon,
  ChartPieIcon,
  CalendarIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  ClockIcon,
  Cog6ToothIcon,
  CloudIcon,
  CubeIcon,
  CurrencyDollarIcon,
  DivideIcon,
  DocumentPlusIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  GiftIcon,
  GlobeAltIcon,
  HeartIcon,
  HashtagIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MegaphoneIcon,
  PencilIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ServerStackIcon,
  ShareIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  UserCircleIcon,
  UsersIcon,
};

const MetricsGroupsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // Array of all groups
  const [data, setData] = useState<any>([]);
  // ID of the group to be deleted
  const [groupToBeDeleted, setGroupToBeDeleted] = useState("");
  // Object of the group that is being edited
  const [groupToBeEdited, setGroupToBeEdited] = useState<any | null>(null);
  // Object of the new group
  const [newGroup, setNewGroup] = useState<any>({
    name: "",
    status: "inactive",
    metrics: [],
    icon: "",
  });
  // metrics list
  const [metricsList, setMetricsList] = useState<Metric[] | null>(null);

  const [snackBarState, setSnackBarState] = useState({
    open: false,
    type: "",
    message: "",
  });

  const areYouSureDelete = (id: string) => {
    setGroupToBeDeleted(id);
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
    { item: "Icon" },
    { item: "Name", sortable: true },
    { item: "State", sortable: true },
    { item: "Metrics", sortable: true },
    { item: "Actions", sortable: false, actions: ["remove"] },
  ];

  const fetchData = async () => {
    try {
      const fetchedData = await getGroups();
      if (fetchedData) {
        const result = Array.isArray(fetchedData) ? fetchedData : [];
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchMetricsList = async () => {
    try {
      const fetchedData = await getActiveMetrics();
      if (fetchedData) {
        const result = Array.isArray(fetchedData) ? fetchedData : [];
        setMetricsList(result);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };
  useEffect(() => {
    fetchMetricsList();
  }, []);

  const handleRemoveGroup = async (id: string) => {
    try {
      await removeGroup(id);
      setData((prevData: any) =>
        prevData.filter((user: any) => user._id !== id)
      );
      setModalState((prev) => ({
        ...prev,
        remove: {
          isOpen: false,
        },
      }));
      handleSnackBar("success", "Group deleted successfully!");
    } catch (error) {
      console.error("Error removing group:", error);
      handleSnackBar("error", "Failed to remove group.");
    }
  };

  const handleEditGroup = (group: Group) => {
    setGroupToBeEdited(group);
    updateModalState("edit", true);
  };

  const handleSaveGroupEdit = async (id: string, groupToBeEdited: Group) => {
    try {
      const input = {
        name: groupToBeEdited.name,
        status: groupToBeEdited.status,
        metrics: groupToBeEdited.metrics
          ?.map((metric) => metric._id)
          .filter((id): id is string => !!id),
        icon: groupToBeEdited.icon,
      };
      if (input.name === "" || !input.name) {
        handleSnackBar("failure", "A name is required!");
      } else if (
        (input.metrics && input.metrics.length === 0) ||
        !input.metrics
      ) {
        handleSnackBar(
          "failure",
          "Please select at least one metric for this group"
        );
      } else {
        await updateGroup(id, input);
        updateModalState("edit", false);
        handleSnackBar("success", "Group updated successfully!");
        fetchData();
      }
    } catch (error) {
      if (error === "Group name already in use.") {
        handleSnackBar("failure", "Group name already in use");
      } else handleSnackBar("failure", "Something went wrong while updating!");
    }
  };

  const createNewGroup = async () => {
    try {
      if (!newGroup.metrics || newGroup.metrics.length === 0) {
        handleSnackBar("failure", "Please, fill up all the fields");
      } else if (!newGroup.icon || newGroup.icon === "") {
        handleSnackBar("failure", "Please, select an icon to continue");
      } else {
        await createGroup(newGroup);
        handleSnackBar("success", "Group created successfully!");
        updateModalState("create", false);

        fetchData();
        setNewGroup({ name: "", status: "inactive", metrics: [] });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        if (error.message === "This group name already exists") {
          handleSnackBar("failure", "This group name is already in use");
        } else if (
          error.message ===
          "Missing required fields: name, icon, and the metrics list"
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
        <p className="text-lg worksans-semibold pb-5">
          Metrics groups management
        </p>
        <ButtonAnimation
          label="New group"
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
        <tbody>
          {!loading &&
            data &&
            data.map((group: any, index: number) => (
              <tr key={index} className="w-full gellix pb-2">
                <td className="py-2">{group._id}</td>
                <td className="py-2">
                  <IconDisplay iconName={group.icon} />
                </td>
                <td className="py-2">{group.name}</td>
                <td className="py-2">
                  {group.status === "active" && (
                    <p className="text-green-500 bg-green-100 w-fit py-2 px-5 rounded-full">
                      Active
                    </p>
                  )}
                  {group.status === "inactive" && (
                    <p className="text-red-500 bg-red-100 w-fit py-2 px-5 rounded-full">
                      {" "}
                      Inactive
                    </p>
                  )}
                </td>
                <td className="py-2 wrap w-100">
                  <p>
                    {group.metrics &&
                      [...group.metrics]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((m: Metric) => m.name)
                        .join(", ")}
                  </p>
                </td>

                <td className="flex flex-row  items-center justify-start py-2 gap-2">
                  <ButtonAnimation
                    label="Edit"
                    icon="pencil"
                    style="outline"
                    color="#4b5563"
                    width="6em"
                    disabled={group._id === "681b9229fb80a7c0ec3990a3"} //disabled if the group is the "Custom" option
                    action={() => handleEditGroup(group)}
                  ></ButtonAnimation>
                  <ButtonAnimation
                    label="Remove"
                    icon="trashcan"
                    style="outline"
                    color="red"
                    width="8em"
                    disabled={group._id === "681b9229fb80a7c0ec3990a3"} //disabled if the group is the "Custom" option
                    action={() => areYouSureDelete(group._id)}
                  ></ButtonAnimation>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <SnackBar
        type={snackBarState.type}
        isOpen={snackBarState.open}
        title={snackBarState.message}
        onDismiss={() => updateSnackBarState("open", false)}
      ></SnackBar>

      {/* modal delete group */}
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
              action={() => handleRemoveGroup(groupToBeDeleted)}
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>

      {/* Modal edit group */}
      <ModalDeleteSavedSearch
        isOpen={modalState.edit.isOpen}
        onDismiss={() => updateModalState("edit", false)}
        title="Edit group"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          {groupToBeEdited && (
            <div className="space-y-4">
              {/* group name */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                  value={groupToBeEdited.name}
                  onChange={(e) =>
                    setGroupToBeEdited({
                      ...groupToBeEdited,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              {/* group status */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 flex gap-7">
                  Active
                  <input
                    type="checkbox"
                    className="border border-gray-300 rounded-md p-3 bg-transparent outline-none w-5"
                    checked={groupToBeEdited.status === "active"}
                    onChange={(e) => {
                      const newStatus = e.target.checked
                        ? "active"
                        : "inactive";
                      setGroupToBeEdited({
                        ...groupToBeEdited,
                        status: newStatus,
                      });
                    }}
                  />
                </label>
              </div>

              <div className="flex flex-row gap-3">
                {/* group metrics */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 flex gap-5">
                    Metrics{" "}
                  </label>
                  {metricsList &&
                    [...metricsList]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((m) => (
                        <label
                          key={m._id}
                          className="flex w-full gap-3 hover:cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              !!groupToBeEdited.metrics?.find(
                                (metric: { _id: string | undefined }) =>
                                  metric._id === m._id
                              )
                            }
                            className="w-5 p-5 hover:cursor-pointer"
                            onChange={(e) => {
                              let updatedMetrics;
                              if (e.target.checked) {
                                updatedMetrics = [
                                  ...(groupToBeEdited.metrics || []),
                                  m,
                                ];
                              } else {
                                updatedMetrics = (
                                  groupToBeEdited.metrics || []
                                ).filter(
                                  (metric: { _id: string | undefined }) =>
                                    metric._id !== m._id
                                );
                              }
                              setGroupToBeEdited({
                                ...groupToBeEdited,
                                metrics: updatedMetrics,
                              });
                            }}
                          />
                          {m.name}
                        </label>
                      ))}
                </div>
                {/* group icon */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1 flex gap-7">
                    Icon
                  </label>
                  <IconSelector
                    selected={groupToBeEdited.icon}
                    onSelect={(iconName) => {
                      setGroupToBeEdited((prev: any) => ({
                        ...prev,
                        icon: iconName,
                      }));
                    }}
                  />
                </div>
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
                if (groupToBeEdited && groupToBeEdited._id) {
                  handleSaveGroupEdit(groupToBeEdited._id, groupToBeEdited);
                }
              }}
              width="12em"
              style="outline"
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>

      {/* Modal create group */}
      <ModalDeleteSavedSearch
        isOpen={modalState.create.isOpen}
        onDismiss={() => {
          setNewGroup({
            name: "",
            status: "inactive",
            metrics: [],
            icon: "",
          });
          updateModalState("create", false);
        }}
        title="Create group"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          <div className="space-y-4">
            {/* group name */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({
                    ...newGroup,
                    name: e.target.value,
                  })
                }
              />
            </div>
            {/* group status */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 flex gap-7">
                Active
                <input
                  type="checkbox"
                  className="border border-gray-300 rounded-md p-3 bg-transparent outline-none w-5"
                  checked={newGroup.status === "active"}
                  onChange={(e) => {
                    const newStatus = e.target.checked ? "active" : "inactive";
                    setNewGroup({
                      ...newGroup,
                      status: newStatus,
                    });
                  }}
                />
              </label>
            </div>

            <div className="flex flex-row gap-5">
              {/* group metrics */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 flex gap-5 pb-1">
                  Metrics{" "}
                </label>
                {metricsList &&
                  [...metricsList]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((m) => (
                      <label key={m._id} className="flex w-full gap-3 mb-2">
                        <input
                          type="checkbox"
                          className="w-5 p-5"
                          onChange={(e) => {
                            let updatedMetrics;
                            if (e.target.checked) {
                              updatedMetrics = [
                                ...(newGroup.metrics || []),
                                m._id,
                              ];
                            } else {
                              updatedMetrics = (newGroup.metrics || []).filter(
                                (metricId: string | undefined) =>
                                  metricId !== m._id
                              );
                            }
                            setNewGroup({
                              ...newGroup,
                              metrics: updatedMetrics,
                            });
                          }}
                        />
                        {m.name}
                      </label>
                    ))}
                {/* {groupToBeEdited && groupToBeEdited.metrics.map((m: Metric) =><div>{m.name}</div>)} */}
              </div>

              {/* group icon */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1 flex gap-7">
                  Icon
                </label>
                <IconSelector
                  onSelect={(iconName) => {
                    setNewGroup((prev: any) => ({
                      ...prev,
                      icon: iconName,
                    }));
                  }}
                />
              </div>
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
              label="Create group"
              color="blue"
              icon="arrow"
              action={() => {
                createNewGroup();
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

export default MetricsGroupsManagement;
