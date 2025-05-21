import { HiHome } from "react-icons/hi";
import { MdThumbUp  } from "react-icons/md";
import { FaUserLarge, FaBars } from "react-icons/fa6";
import { IoChatbubbleEllipses, IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import { VscBell, VscBellDot } from "react-icons/vsc";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiOutlineTrash } from "react-icons/hi";
import { LuMap } from "react-icons/lu";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { FaRegCalendarPlus } from "react-icons/fa";

export const iconMap = {
  home: HiHome,
  pick: MdThumbUp,
  user: FaUserLarge,
  chat: IoChatbubbleEllipses,
  back: IoIosArrowBack,
  bars: FaBars,
  plus: BsPlusCircle,
  search: IoSearch,
  bell: VscBell,
  bellDot: VscBellDot,
  heartfill: GoHeartFill,
  heart: GoHeart,
  trash: HiOutlineTrash,
  map: LuMap,
  dots: IoEllipsisVerticalSharp,
  send: IoSend,
  calendar: FaRegCalendarPlus,
};

export type IconName = keyof typeof iconMap;

// https://react-icons.github.io/react-icons/