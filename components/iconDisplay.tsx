import {AdjustmentsHorizontalIcon, ArrowTrendingUpIcon, ArrowsRightLeftIcon, BanknotesIcon, BellAlertIcon, BeakerIcon, 
    BookmarkIcon, ChartBarIcon, ChartPieIcon, CalendarIcon, CheckBadgeIcon, CircleStackIcon, ClockIcon, Cog6ToothIcon, 
    CloudIcon, CubeIcon, CurrencyDollarIcon, DivideIcon, DocumentPlusIcon, EnvelopeIcon, 
    ExclamationTriangleIcon, FunnelIcon, GiftIcon, GlobeAltIcon, HeartIcon, HashtagIcon, MagnifyingGlassIcon, MapPinIcon, 
    MegaphoneIcon, PencilIcon, PuzzlePieceIcon, RocketLaunchIcon, ServerStackIcon, ShareIcon, SparklesIcon, TrophyIcon, UserGroupIcon, 
    UserCircleIcon, UsersIcon} from '@heroicons/react/24/outline';

interface IconDisplayProps {
    iconName: string;
  }

const IconDisplay: React.FC<IconDisplayProps> = ({ iconName }) => {
  const IconComponent = {
    AdjustmentsHorizontalIcon, ArrowTrendingUpIcon, ArrowsRightLeftIcon, BanknotesIcon, BellAlertIcon, BeakerIcon, 
    BookmarkIcon, ChartBarIcon, ChartPieIcon, CalendarIcon, CheckBadgeIcon, CircleStackIcon, ClockIcon, Cog6ToothIcon, 
    CloudIcon, CubeIcon, CurrencyDollarIcon, DivideIcon, DocumentPlusIcon, EnvelopeIcon, 
    ExclamationTriangleIcon, FunnelIcon, GiftIcon, GlobeAltIcon, HeartIcon, HashtagIcon, MagnifyingGlassIcon, MapPinIcon, 
    MegaphoneIcon, PencilIcon, PuzzlePieceIcon, RocketLaunchIcon, ServerStackIcon, ShareIcon, SparklesIcon, TrophyIcon, UserGroupIcon, 
    UserCircleIcon, UsersIcon
  }[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found. Rendering default icon.`);
    return <ExclamationTriangleIcon className="w-6 h-6 text-gray-500" />;
  }
  return <IconComponent className="w-6 h-6 text-blue-500" />;
};

export default IconDisplay;
