"use client";

import "../app/globals.css";
import { useRouter } from "next/navigation";
import React, { JSX, useState } from "react";

import ButtonAnimation from "./buttonAnimation";
import ModalDeleteSavedSearch from "./modal/modalDeleteSavedSearch";
import SnackBar from "./modal/snackBar";

import type Search from "@/app/interface/search";
import type Metric from "@/app/interface/metric";

import { removeSearch } from "@/lib/queries";

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

interface SavedSearch {
  search: Search;
  onDelete?: (id: string) => void;
}
const SavedSearch: React.FC<SavedSearch> = ({search, onDelete}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const modalHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal((curr) => !curr);
  };

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      await onDelete(search._id);
      setShowModal(false);
    }
  }

  return (
    <div
      className="p-5 bg-electric50 rounded-xl flex flex-col gap-8 w-80 h-92 cursor-pointer justify-between"
      onClick={() => {
        router.push(`/dashboard/${search._id}`);
      }}
    >
      {/* header */}
      <div className="flex flex-col gap-8 items-start">
        <div className="flex flex-row gap-8 items-center">
          {/* icon */}
          <div className="bg-electric400 flex rounded-full items-center justify-center w-15 h-15">
            {search.metricsGroup?.icon ? (
              React.createElement(
                HeroIcons[
                  search.metricsGroup.icon as keyof typeof HeroIcons
                ],
                {
                  className: "w-7 h-7 text-white",
                }
              )
            ) : (
              <PencilIcon className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <h1 className="gellix-semibold text-lg w-45 truncate">
              {search.name}
            </h1>
            <p className="gellix">
              {new Date(Number(search.updatedAt)).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="gellix-semibold">
            Store:{" "}
            <span className="gellix">
              {" "}
              {search.store &&
                search.store.name}{" "}
            </span>
          </p>
          <p className="gellix-semibold">
            Metrics group:{" "}
            <span className="gellix">
              {" "}
              {search.metricsGroup &&
                search.metricsGroup.name}{" "}
            </span>
          </p>
          <div className="flex flex-row gap-1">
            <p className="gellix-semibold">Metrics list:</p>
            <div className="max-w-48">
              {search.metrics &&
                search.metrics.slice(0, 4).map((metric: Metric) => (
                  <p
                    key={metric._id ?? metric.name}
                    className="truncate gellix"
                  >
                    {metric.name}
                  </p>
                ))}
              {search.metrics && search.metrics.length > 4 ? (
                <p className="text-gray-400 text-sm gellix">More...</p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="place-self-center">
        <ButtonAnimation
          style="outline"
          color="red"
          icon="trashcan"
          label="Delete search"
          action={(e) => modalHandler(e)}
          width="18em"
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
              action={(e) => modalHandler(e)}
              style="outline"
              width="7em"
            />
            <ButtonAnimation
              label="Delete"
              color="white"
              backgroundColor="red"
              icon="trashcan"
              action={handleDelete}
              width="10em"
            />
          </div>
        </div>
      </ModalDeleteSavedSearch>

    </div>
  );
};

export default SavedSearch;
