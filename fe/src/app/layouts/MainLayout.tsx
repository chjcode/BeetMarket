import { Outlet, useLocation } from "react-router-dom";
import { TopBar } from "@/widgets/TopBar";
import { BottomNav } from "@/widgets/BottomNav";
import { match } from "path-to-regexp";

const Layout = () => {
  const { pathname } = useLocation();

  const noHeaderRoutes = ["/login", "/signup", "/product"];
  const noBottomNavRoutes = ["/login", "/signup", "/product", "/chats/:id"];
  const isMatched = (patterns: string[], path: string) =>
    patterns.some(
      (pattern) =>
        match(pattern, { decode: decodeURIComponent })(path) !== false
    );

  const showHeader = !noHeaderRoutes.some((r) => pathname.startsWith(r));
  const showBottomNav = !isMatched(noBottomNavRoutes, pathname);
  const isChatRoom = isMatched(["/chats/:id"], pathname);

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="relative w-full min-w-[360px] max-w-[480px] bg-white flex flex-col ">
        {showHeader && !pathname.startsWith("/product/") && (
          <div className="fixed top-0 w-full max-w-[480px] z-10 bg-white">
            <TopBar />
          </div>
        )}

        <div
          className={`${
            isChatRoom ? "mt-[54px]" : "my-[54px]"
          } px-4 overflow-auto flex-1 no-scrollbar`}
        >
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
