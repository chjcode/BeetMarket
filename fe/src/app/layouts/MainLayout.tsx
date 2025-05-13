import { Outlet, useLocation } from "react-router-dom";
import {TopBar} from "@/widgets/TopBar";
import {BottomNav} from "@/widgets/BottomNav";

const Layout = () => {
  const { pathname } = useLocation();

  const noHeaderRoutes = ["/login", "/signup", "/product"];
  const noBottomNavRoutes = ["/login", "/signup", "/product"];

  const showHeader = !noHeaderRoutes.some(route => pathname.startsWith(route));
  const showBottomNav = !noBottomNavRoutes.some(route => pathname.startsWith(route));

  return (
    <div className="flex justify-center w-screen bg-gray-100 min-h-screen">
      <div
        className="
          w-full 
          min-w-[360px] 
          max-w-[480px] 
          flex flex-col 
          bg-white 
        "
      >
        {showHeader && (
          pathname.startsWith("/product/") ? null : (
            <header className="sticky top-0 bg-white z-10">
              <TopBar />
            </header>
          )
        )}

        <main className="flex-1 overflow-auto p-4 pb-[56px]">
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
