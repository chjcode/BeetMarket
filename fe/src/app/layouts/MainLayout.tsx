import { Outlet, useLocation } from "react-router-dom";
import { TopBar } from "@/widgets/TopBar";
import { BottomNav } from "@/widgets/BottomNav";

const Layout = () => {
  const { pathname } = useLocation();

  const noHeaderRoutes = ["/login", "/signup", "/product"];
  const noBottomNavRoutes = ["/login", "/signup", "/product"];

  const showHeader = !noHeaderRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const showBottomNav = !noBottomNavRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="relative w-full min-w-[360px] max-w-[480px] bg-white flex flex-col">
        {showHeader && !pathname.startsWith("/product/") && (
          <div className="fixed top-0 w-full max-w-[480px] z-10 bg-white">
            <TopBar />
          </div>
        )}

        <div className="my-[54px] px-4 overflow-auto">
          <Outlet />
        </div>

        {showBottomNav && (
          <div className="fixed bottom-0 w-full max-w-[480px] z-10 bg-white">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;