import { HiHome } from "react-icons/hi";
import { MdRecommend } from "react-icons/md";
import { FaUserLarge, BsPlusCircle, FaBars } from "react-icons/fa6";
import { IoChatbubbleEllipses, IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import { VscBell, VscBellDot } from "react-icons/vsc";

export const iconMap = {
  home: HiHome,
  pick: MdRecommend,
  user: FaUserLarge,
  chat: IoChatbubbleEllipses,
  back: IoIosArrowBack,
  bars: FaBars,
  plus: BsPlusCircle,
  search: IoSearch,
  bell: VscBell,
  bellDot: VscBellDot,
};

export type IconName = keyof typeof iconMap;

// https://react-icons.github.io/react-icons/