import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";

export const TopBarDetail = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (pathname === "product/:id"){
    return (<></>)
  }
  if (pathname === "product/:id/3d"){
    return <></>;
  }
  if (pathname === "alarm"){
    return <></>;
  }
  if ((pathname === "mypage/purchases") || (pathname === "mypage/sales") || (pathname === "mypage/favorites")){
    return <></>;
  }
  return (
    <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
      <div
        className="flex w-[36px] h-[36px] justify-start items-center pointer-cursor"
        onClick={() => {
          navigate(-1);
        }}
      >
        <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
      </div>
      <div className="font-semibold pt-1">서브 페이지</div>
      <NavLink
        to="/alarm"
        className="flex w-[36px] h-[36px] justify-end items-center pointer-cursor"
      >
        <Icon name="bell" className="w-6 h-6 stroke-[0.5]" />
      </NavLink>
    </div>
  );
};
