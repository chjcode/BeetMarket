import { NavLink } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { useLocation } from "react-router-dom"

export const TopBarMain = () => {
  const { pathname } = useLocation();
  if (pathname === "/chats") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          {/* <img src="/beet.png" className="h-[36px]" />   */}
          <div className="text-2xl font-bold font-moneygraphy pt-1">채팅</div>
        </div>
        {/* <NavLink
          to="/alarm"
          className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
        >
          <Icon name="bell" className="w-6 h-6 stroke-[0.5]" />
        </NavLink> */}
      </div>
    );
  }

  if (pathname === "/mypage") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          {/* <img src="/beet.png" className="h-[36px]" />   */}
          <div className="text-2xl font-bold font-moneygraphy pt-1">
            마이페이지
          </div>
        </div>
        {/* <NavLink
          to="/alarm"
          className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
        >
          <Icon name="bell" className="w-6 h-6 stroke-[0.5]" />
        </NavLink> */}
      </div>
    );
  }
  if (pathname === "/map") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          {/* <img src="/beet.png" className="h-[36px]" />   */}
          <div className="text-2xl font-bold font-moneygraphy pt-1">
            지도
          </div>
        </div>
        {/* <NavLink
          to="/alarm"
          className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
        >
          <Icon name="bell" className="w-6 h-6 stroke-[0.5]" />
        </NavLink> */}
      </div>
    );
  }

  return (
    <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <img src="/beet.png" className="h-[28px]" />  
        <div className="text-2xl font-bold font-moneygraphy pt-1">비트마켓</div>
      </div>
      <div className="flex h-[36px] justify-end items-center gap-1">
        <NavLink
          to="/search"
          className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
        >
          <Icon name="search" className="w-6 h-6 stroke-[0.5]" />
        </NavLink>
        {/* <NavLink
          to="/category"
          className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
        >
          <Icon name="bars" className="w-6 h-6 stroke-[0.5]" />
        </NavLink> */}
        {/* <NavLink
          to="/alarm"
          className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
        >
          <Icon name="bell" className="w-6 h-6 stroke-[0.5]" />
        </NavLink> */}
      </div>
    </div>
  );
};
