import { Outlet, useLocation } from "react-router-dom";
import { TopBar } from "@/widgets/TopBar";
import { BottomNav } from "@/widgets/BottomNav";
import { match } from "path-to-regexp";

const Layout = () => {
  const { pathname } = useLocation();

  // 헤더와 바텀 네비가 숨겨져야 할 경로 정의 (동적 라우트 포함)
  const noHeaderRoutes = [
    "/login",
    "/signup",
    "/product",
    "/product/:id",
    "/product/:id/3d",
    "/chats/:id",
  ];
  const noBottomNavRoutes = [
    "/login",
    "/signup",
    "/product",
    "/product/:id",
    "/product/:id/3d",
    "/chats/:id",
    "/category",
    "/mypage/purchases",
    "/mypage/sales",
    "/mypage/favorites",
    "/mypage/schedule",
    "/add",
    "/alarm",
  ];

  // 현재 경로가 배열 내 패턴 중 하나와 매칭되는지 확인
  const isMatched = (patterns: string[], path: string) =>
    patterns.some(
      (pattern) =>
        match(pattern, { decode: decodeURIComponent })(path) !== false
    );

  const showHeader = !isMatched(noHeaderRoutes, pathname);
  const showBottomNav = !isMatched(noBottomNavRoutes, pathname);

  // 헤더/바텀 존재 여부에 따라 마진 클래스 동적으로 설정
  const contentMarginClass = (() => {
    if (showHeader && showBottomNav) return "my-[54px]";
    if (showHeader) return "mt-[54px]";
    if (showBottomNav) return "mb-[54px]";
    return "my-0";
  })();

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-50">
      <div className="relative w-full min-w-[360px] max-w-[480px] bg-white flex flex-col">
        {showHeader && (
          <div className="fixed top-0 w-full max-w-[480px] z-10 bg-white">
            <TopBar />
          </div>
        )}

        <div
          className={`overflow-auto flex-1 no-scrollbar ${contentMarginClass}`}
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
