"use client";
import { JSX } from "react";
import { useState, useEffect, Suspense } from "react";
import ForbiddenAccess from "@/components/forbiddenAccess";
import { getUserType } from "@/lib/queries";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import UsersManagement from "@/components/admin/usersManagement";
import StoresManagement from "@/components/admin/storesManagement";
import MetricsManagement from "@/components/admin/metricsManagement";
import MetricsGroupsManagement from "@/components/admin/metricsGroupsManagement";

export default function Page() {
  const [forbidden, setForbidden] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>("users");
  const router = useRouter();

  const selectItem = (item: string) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userID");
    if (userId) setUserId(userId);

    if (!token || !userId) {
      router.push("/auth");
    }
  }, []);

  useEffect(() => {
    const checkUserType = async (userId: string) => {
      try {
        const userType = await getUserType(userId);
        setForbidden(userType !== "admin");
        if (forbidden) setLoading(false);
      } catch (error) {
        console.error("Error checking user type:", error);
      }
    };
    if (userId) checkUserType(userId);
  }, [userId]);

  const iconMap: Record<string, JSX.Element> = {
    user: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#0D0DFC"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
    shop: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#0D0DFC"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    ),
    metric: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#0D0DFC"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
        />
      </svg>
    ),
    metricGroup: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#0D0DFC"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
        />
      </svg>
    ),
  };
  const menuOptions = [
    { id: "users", name: "Users", icon: "user" },
    { id: "stores", name: "Stores", icon: "shop" },
    { id: "metrics", name: "Metrics", icon: "metric" },
    { id: "metricsGroups", name: "Metrics Groups", icon: "metricGroup" },
  ];

  return (
    <Suspense fallback={<Loading />}>
      {loading ? (
        <Loading />
      ) : !forbidden && !loading ? (
        <div className="w-full h-fit flex flex-col gap-8 items-start">
          <div className="flex flex-col gap-3">
            <h1 className="worksans text-2xl">ADMIN PANEL</h1>
            <h1 className="worksans text-md grey800">
              Manage the app with caution! With great power comes great
              responsability!
            </h1>
          </div>
          <div className="flex flex-row gap-15 w-full">
            <div className="flex flex-col gap-2 w-1/5 h-full border-r-1 border-gray-200 ">
              {menuOptions.map((option) => {
                return (
                  <div
                    id={option.id}
                    key={option.id}
                    className={`flex flex-row gap-4 items-center cursor-pointer hover:bg-gray-100 hover:rounded-lg p-4 mr-2 ${
                      selectedItem == option.id
                        ? "main bg-electric50 rounded-lg"
                        : ""
                    }`}
                    onClick={() => {
                      selectItem(option.id);
                    }}
                  >
                    {iconMap[option.icon]}
                    <h1 id={option.id} className="gellix-semibold text-md ">
                      {option.name}
                    </h1>
                  </div>
                );
              })}{" "}
            </div>
            <div className="w-full">
              {selectedItem === "users" && <UsersManagement />}
              {selectedItem === "stores" && <StoresManagement />}
              {selectedItem === "metrics" && <MetricsManagement />}
              {selectedItem === "metricsGroups" && <MetricsGroupsManagement />}
            </div>
          </div>
        </div>
      ) : (
        <ForbiddenAccess />
      )}
    </Suspense>
  );
}
