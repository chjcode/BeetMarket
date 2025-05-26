import { NavLink } from "react-router-dom";
import type { FC } from "react";
import { Icon } from "@/shared/ui/Icon";
import type { IconName } from "@/shared/ui/Icon/iconMap";

type NavItemProps = {
  to: string;
  icon: IconName;
  label: string;
};

export const NavItem: FC<NavItemProps> = ({ to, icon, label }) => {
  const iconClass =
    icon === "plus" ? "w-8 h-8 stroke-[0.5] overflow-visible mt-2" : "w-6 h-6 mt-2 mb-1";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center w-full h-full text-xs overflow-visible hover:bg-gray-100 rounded-2xl ${
          isActive ? "text-[#A349A4]" : "text-gray-500"
        }`
      }
    >
      <Icon name={icon} className={iconClass} />
      {label && <span>{label}</span>}
    </NavLink>
  );
};