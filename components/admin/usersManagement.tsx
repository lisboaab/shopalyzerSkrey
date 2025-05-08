"use client";
import "../../app/globals.css";
import { useState, useEffect, useCallback } from "react";

// interface
import User from "../../app/interface/user";

// queries
import { getUsers, userTypesList, removeUser, updateUser } from "@/lib/queries";

// modals
import SnackBar from "../modal/snackBar";
import ModalDeleteSavedSearch from "../modal/modalDeleteSavedSearch";

// components
import Loading from "@/components/loading";
import EmptyState from "@/components/emptyState";
import ButtonAnimation from "@/components/buttonAnimation";
import ArrowUp from "@/components/icons/arrowUp";
import ArrowDown from "@/components/icons/arrowDown";

const UsersManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState("");
  const [data, setData] = useState<any>();
  const [userToBeDeleted, setUserToBeDeleted] = useState("");
  const [userToBeEdited, setUserToBeEdited] = useState<User | null>(null);
  const [userTypesListNames, setUserTypesListNames] = useState([]);

  // Modals state management
  const [modalState, setModalState] = useState({
    isOpen: false,
    edit: {
      isOpen: false,
    },
  });

  // Snackbar state management
  const [snackBarState, setSnackBarState] = useState({
    open: false,
    type: "",
    message: "",
  });

  const handleRemoveUser = async (id: string) => {
    try {
      await removeUser(id);
      setData((prevData: any) =>
        prevData.filter((user: any) => user._id !== id)
      );
      updateModalState("isOpen", false);
      handleSnackBar("success", "User deleted successfully!");
    } catch (error) {
      console.error("Error removing user:", error);
      handleSnackBar("error", "Failed to remove user.");
    }
  };

  const handleEditUser = (user: any) => {
    setUserToBeEdited(user);
    setModalState((prev) => ({
      ...prev,
      edit: {
        ...prev.edit,
        isOpen: true,
      },
    }));
  };

  const handleSaveUserEdit = async (id: string, userToBeEdited: User) => {
    try {
      const user = {
        name: userToBeEdited.name,
        email: userToBeEdited.email,
        userType: userToBeEdited.userType,
      };
      await updateUser(id, user);
      setModalState((prev) => ({
        ...prev,
        edit: {
          ...prev.edit,
          isOpen: false,
        },
      }));
      handleSnackBar("success", "User updated successfully!");

      fetchData();
    } catch (error) {
      if (error === "Email already in use.") {
        handleSnackBar("failure", "Email already in use");
      } else handleSnackBar("failure", "Something went wrong while updating!");
    }
  };

  const areYouSureDelete = (id: string) => {
    setUserToBeDeleted(id);
    updateModalState("isOpen", true);
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

  const updateModalState = (key: string, value: any) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  const closeEditModal = () => {
    setModalState((prev) => ({
      ...prev,
      edit: {
        ...prev.edit,
        isOpen: false,
      },
    }));
  };

  const tableHeader = [
    { item: "ID" },
    { item: "Email", sortable: true },
    { item: "Type", sortable: true },
    { item: "Created at", sortable: true },
    { item: "Actions", sortable: false, actions: ["remove", "edit"] },
  ];

  const fetchData = async () => {
    const types = await userTypesList();
    if (types) {
      setUserTypesListNames(types.userTypesList);
    }

    try {
      const fetchedData = await getUsers();
      if (fetchedData) {
        setData(Array.isArray(fetchedData) ? fetchedData : []);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("userID");
    if (id) setLoggedUserId(id);
    fetchData();
  }, []);

  useEffect(() => {
  }, [userTypesListNames]);

  return (
    <div className="w-full h-full">
      <p className="text-lg worksans-semibold pb-5">Users management</p>
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
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <Loading />
              </td>
            </tr>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((user: any, index: number) => (
              <tr key={index} className="w-full gellix pb-2">
                <td className="py-2">{user._id}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{user.userType}</td>
                <td className="py-2">
                  {new Date(Number(user.createdAt)).toLocaleString()}
                </td>
                <td className="flex flex-row items-center justify-start py-2 gap-2">
                  <ButtonAnimation
                    label="Edit"
                    icon="pencil"
                    style="outline"
                    color="#4b5563"
                    width="6em"
                    action={() => handleEditUser(user)}
                  />
                  <ButtonAnimation
                    label="Remove"
                    icon="trashcan"
                    style="outline"
                    color="red"
                    width="8em"
                    disabled={user._id === loggedUserId}
                    action={() => areYouSureDelete(user._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <EmptyState />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Snackbar para feedback */}
      <SnackBar
        type={snackBarState.type}
        isOpen={snackBarState.open}
        title={snackBarState.message}
        onDismiss={() => updateSnackBarState("open", false)}
      />

      {/* Modal delete user */}
      <ModalDeleteSavedSearch
        isOpen={modalState.isOpen}
        onDismiss={() => updateModalState("isOpen", false)}
        title="Are you sure you want to delete this user?"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          <h1 className="text-black">
            This action cannot be undone and you will lose this information
            forever!
          </h1>

          <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-5">
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={() => updateModalState("isOpen", false)}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Delete"
              color="white"
              backgroundColor="red"
              icon="trashcan"
              action={() => handleRemoveUser(userToBeDeleted)}
              width="10em"
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>

      {/* Modal edit user */}
      <ModalDeleteSavedSearch
        isOpen={modalState.edit.isOpen}
        onDismiss={closeEditModal}
        title="Edit user"
      >
        <div className="my-4 flex flex-col justify-start gap-8">
          {userToBeEdited && (
            <div className="space-y-4">
              {/* user name */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                  value={userToBeEdited.name}
                  onChange={(e) =>
                    setUserToBeEdited({
                      ...userToBeEdited,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* user email */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="border border-gray-300 rounded-md p-2 bg-transparent outline-none"
                  value={userToBeEdited.email}
                  onChange={(e) =>
                    setUserToBeEdited({
                      ...userToBeEdited,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* user type */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">User Type</label>
                <select
                  className="border border-gray-300 rounded-md p-2 bg-transparent outline-none disabled:cursor-not-allowed"
                  value={userToBeEdited.userType}
                  onChange={(e) =>
                    setUserToBeEdited({
                      ...userToBeEdited,
                      userType: e.target.value,
                    })
                  }
                  disabled={userToBeEdited._id === loggedUserId}
                >
                  {userTypesListNames.map((option, index) => {
                    return (
                      <option value={option} key={index}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end items-center gap-4 border-t border-gray-200 pt-5">
            <ButtonAnimation
              label="Cancel"
              color="gray"
              action={closeEditModal}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Save changes"
              color="blue"
              icon="arrow"
              action={() => {
                if (userToBeEdited && userToBeEdited._id) {
                  handleSaveUserEdit(userToBeEdited._id, userToBeEdited);
                }
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

export default UsersManagement;
