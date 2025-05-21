"use client";
import React from "react";
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

import { useEffect } from "react";
interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  selected?: string;
}

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

const IconSelector: React.FC<IconSelectorProps> = ({ onSelect, selected }) => {
  const [selectedIcon, setSelectedIcon] = React.useState("");

  const icons = Object.entries(HeroIcons).map(([name, Icon]) => ({
    name,
    Component: Icon,
  }));

  useEffect(() => {
    setSelectedIcon(selected || "");
  }, [selected]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2 h-60 overflow-y-auto items-start">
        {icons.map(({ name, Component }) => (
          <button
            key={name}
            onClick={() => {
              setSelectedIcon(name);
              onSelect(name);
            }}
            className={`p-2 ${
              selectedIcon === name
                ? " bg-blue-100 rounded-full items-center justify-center"
                : ""
            } hover:cursor-pointer hover:bg-gray-100 rounded-full `}
          >
            <Component className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
