import { useLocation } from "react-router-dom";
import { TopBarMain } from "./TopBarMain";
import { TopBarDetail } from "./TopBarDetail";

export const TopBar = () => {
  const { pathname } = useLocation();
  const mainRoutes = ["/", "/chats", "/mypage"];
  const isMainTopBar = mainRoutes.includes(pathname);
  return isMainTopBar ? <TopBarMain /> : <TopBarDetail />;
};
