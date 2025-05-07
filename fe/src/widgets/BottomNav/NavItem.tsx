import { NavLink } from "react-router-dom";
import type { FC } from "react";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

export const NavItem: FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center text-xs ${
          isActive ? "text-purple-600" : "text-gray-500"
        }`
      }
    >
      <div className="text-xl">{icon}</div>
      <span>{label}</span>
    </NavLink>
  );
};
