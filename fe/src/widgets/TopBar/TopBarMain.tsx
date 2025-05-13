import { NavLink } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";

export const TopBarMain = () => {
  return (
    <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <img src="/beet.png" className="h-[36px]" />
        <div className="text-2xl font-bold font-moneygraphy pt-1">비트마켓</div>
      </div>
      <NavLink
        to="/alarm"
        className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
      >
        <Icon name="bell" className="w-6 h-6 stroke-[0.5]" />
      </NavLink>
    </div>
  );
};
