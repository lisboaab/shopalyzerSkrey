"use client";
import "../app/globals.css";
import { useState, useEffect } from "react";
import ArrowUp from "@/components/icons/arrowUp";
import ArrowDown from "@/components/icons/arrowDown";
import { getUsers } from "@/lib/queries";
import Loading from "@/components/loading";
import EmptyState from "@/components/emptyState";
import ButtonAnimation from "@/components/buttonAnimation";
import { removeUser } from "@/lib/queries";
import SnackBar from "./modal/snackBar";
import ModalDeleteSavedSearch from "./modal/modalDeleteSavedSearch";

interface AdminManagementProps {
  menuItem: string;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ menuItem }) => {
  const [loading, setLoading] = useState(true);
  const [selectectMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [data, setData] = useState<any>();
  const [userToBeDeleted, setUserToBeDeleted] = useState("");

  const handleRemoveUser = async (id: string) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (!confirmation) return;

      await removeUser(id);
      setData((prevData: any) =>
        prevData.filter((user: any) => user._id !== id)
      );
      alert("User removed successfully.");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user.");
    }
  };

  const areYouSureDelete = (id: string) => {
    setUserToBeDeleted(id)
    updateModalState("isOpen", true)
  }

  const [tableState, setTableState] = useState({
    ID: true,
    name: false,
    email: false,
    type: false,
    createdAt: false,
    actions: false,
  });

  const updateTableState = (key: string, value: boolean) => {
    setTableState((prev) => ({ ...prev, [key]: value }));
  };

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

  const [modalState, setModalState] = useState({
    isOpen: false,
    onDismiss: "",
    title: "",
  });

  const updateModalState = (key: string, value: any) => {
    setModalState((prev) => ({ ...prev, [key]: value }));
  };

  const tableHeader = {
    users: [
      { item: "ID", sortable: true },
      { item: "Email", sortable: true },
      { item: "Type", sortable: true },
      { item: "Created at", sortable: true },
      { item: "Actions", sortable: false, actions: ["remove", "edit"] },
    ],
    stores: [
      { item: "ID", sortable: true },
      { item: "Name", sortable: true },
      { item: "API Key", sortable: true },
      { item: "API Token", sortable: true },
      { item: "Created at", sortable: true },
      { item: "Actions", sortable: false, actions: ["remove"] },
    ],
    metricsGroups: [
      { item: "Name", sortable: true },
      { item: "Metrics", sortable: true },
      { item: "State", sortable: true },
      { item: "Created at", sortable: true },
      { item: "Actions", sortable: false, actions: ["remove"] },
    ],
  };

  const fetchData = async (data: string) => {
    try {
      switch (data) {
        case "users":
          return await getUsers();
        case "stores":
          return "await getStores()";
        case "metricsGroups":
          return " await getMetricsGroups()";
        case "metrics":
          return " await getMetrics()";
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        let fetchedData;
        if (menuItem === "users") {
          setTitle("Users ");
          fetchedData = await fetchData("users");
        }
        if (menuItem === "stores") {
          setTitle("Stores ");
          fetchedData = await fetchData("stores");
        }
        if (menuItem === "metricsGroups") {
          setTitle("Metrics groups ");
          fetchedData = await fetchData("metricsGroups");
        }

        if (fetchedData) {
          setData(fetchedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDataAsync();
  }, [menuItem]);

  const metricsList = [
    {
      title: "Average order value",
      description: "The average amount spent by a customer per order.",
    },
    {
      title: "Customer acquisition cost rgOIEHJFOwefunedi",
      description: "The cost associated with acquiring a new customer.",
    },
    {
      title: "Customer lifetime value",
      description:
        "The total revenue expected from a customer over their lifetime.",
    },
    {
      title: "Click rate",
      description:
        "The percentage of users who click on a specific link or call-to-action.",
    },
    {
      title: "Chrun rate",
      description:
        "The percentage of customers who stop using a product or service during a given time period.",
    },
    {
      title: "Conversion rate",
      description:
        "The percentage of users who take a desired action, such as making a purchase.",
    },
    {
      title: "Total revenue",
      description: "The total income generated from sales.",
    },
    {
      title: "Average order value",
      description: "The average amount spent by a customer per order.",
    },
    {
      title: "Customer acquisition cost",
      description: "The cost associated with acquiring a new customer.",
    },
    {
      title: "Customer lifetime value",
      description:
        "The total revenue expected from a customer over their lifetime.",
    },
    {
      title: "Click rate",
      description:
        "The percentage of users who click on a specific link or call-to-action.",
    },
    {
      title: "Chrun rate",
      description:
        "The percentage of customers who stop using a product or service during a given time period.",
    },
    {
      title: "Conversion rate",
      description:
        "The percentage of users who take a desired action, such as making a purchase.",
    },
    {
      title: "Total revenue",
      description: "The total income generated from sales.",
    },
  ];

  const handleConsoleClick = () => {
    console.log("clicked");
  };

  const filteredMetrics =
    searchQuery.length < 3
      ? metricsList
      : metricsList.filter((m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return menuItem === "metrics" ? (
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
                  <p className="text-gray-900 gellix text-lg cursor-pointer truncate overflow-hidden text-ellipsis whitespace-nowrap">
                    {metric.title}
                  </p>
                  <p className="grey800 wrap text-sm">{metric.description}</p>
                </div>
                <input
                  type="checkbox"
                  id={`metric-${index}`}
                  className="h-5 w-5 cursor-pointer color-blue-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetrics((prev) => [
                        ...prev,
                        metric.title.toLowerCase().replaceAll(" ", "_"),
                      ]);
                    } else {
                      setSelectedMetrics((prev) =>
                        prev.filter(
                          (item) =>
                            item !==
                            metric.title.toLowerCase().replaceAll(" ", "_")
                        )
                      );
                    }
                  }}
                />
              </div>
            ))}
          {filteredMetrics.length == 0 && <EmptyState />}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <p className="text-lg worksans-semibold pb-5">{title} management</p>
      <table className="w-full table-auto border-spacing-10">
        <thead>
          {Object.keys(tableHeader)
            .filter((tableName) => tableName.toString() === menuItem)
            .map((item, index) => {
              return (
                <tr
                  className="gellix-semibold text-md text-gray-800"
                  key={index}
                >
                  {tableHeader[menuItem as keyof typeof tableHeader]?.map(
                    (header: any, headerIndex: any) => (
                      <th key={headerIndex}>
                        <div className="flex flex-row gap-1">
                          {header.item}
                          {header.sortable && <ArrowUp />}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              );
            })}
        </thead>
        <tbody className="pb-5">
          {menuItem === "users" &&
            !loading &&
            Array.isArray(data) &&
            data.map((user: any, index: number) => (
              <tr key={index} className="w-full gellix pb-2">
                <td className="py-2">{user._id}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{user.userType}</td>
                <td className="py-2">{user.createdAt}</td>
                <td className="flex flex-row  items-center justify-start py-2 gap-2">
                  <ButtonAnimation
                    label="Edit"
                    icon="pencil"
                    style="outline"
                    color="#8B93A5"
                    width="6em"
                    action={handleConsoleClick}
                  ></ButtonAnimation>
                  <ButtonAnimation
                    label="Remove"
                    icon="trashcan"
                    style="outline"
                    color="red"
                    width="8em"
                    action={() => areYouSureDelete(user._id)}
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

      <ModalDeleteSavedSearch
        isOpen={modalState.isOpen}
        onDismiss={() => updateModalState("isOpen", false)}
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
    </div>
  );
};

export default AdminManagement;
