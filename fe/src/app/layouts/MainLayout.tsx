import { Outlet, useLocation } from "react-router-dom";
import {TopBar} from "@/widgets/TopBar";
import {BottomNav} from "@/widgets/BottomNav";

const Layout = () => {
  const { pathname } = useLocation();

  const noHeaderRoutes = ["/login"];
  const noBottomNavRoutes = ["/login"];

  const showHeader = !noHeaderRoutes.includes(pathname);
  const showBottomNav = !noBottomNavRoutes.includes(pathname);

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div
        className="
          w-full 
          min-w-[360px] 
          max-w-[480px] 
          flex flex-col 
          bg-white 
          shadow-md 
        "
      >
        {showHeader && (
          <header className="sticky top-0 bg-white z-10">
            <TopBar />
          </header>
        )}

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>

        {showBottomNav && (
          <footer className="sticky bottom-0 bg-white z-10">
            <BottomNav />
          </footer>
        )}
      </div>
    </div>
  );
};

export default Layout;
