import { useLocation } from "react-router-dom";
import { TopBarMain } from "./TopBarMain";
import { TopBarDetail } from "./TopBarDetail";
import { TopBarSearch } from "./TopBarSearch";

export const TopBar = () => {
  const { pathname } = useLocation();

  const mainRoutes = ["/", "/chats", "/mypage", "/map"];
  const searchRoutes = ["/search", "/search/result"]

  if (searchRoutes.includes(pathname)) {
    return <TopBarSearch />;
  }

  if (mainRoutes.includes(pathname)) {
    return <TopBarMain />;
  }

  return <TopBarDetail />;
};
