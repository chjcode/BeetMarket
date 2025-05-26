import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";

interface TopBarDetailProps {
  title?: string;
}

export const TopBarDetail = ({ title }: TopBarDetailProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isCategoryPage = pathname.startsWith("/category/");
  const categoryName = isCategoryPage
    ? decodeURIComponent(pathname.replace("/category/", ""))
    : null;

  const isProductDetail =
    pathname.startsWith("/product/") && !pathname.endsWith("/3d");
  const isProduct3DPage =
    pathname.startsWith("/product/") && pathname.endsWith("/3d");
  
  if (isProductDetail){
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon
            name="back"
            className="w-6 h-6 text-gray-500 stroke-[0.5]"
          />
        </div>
        <div className="font-semibold pt-1"></div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/alarm") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">알림</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/category") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">카테고리 목록</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/mypage/purchases") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">구매 내역</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/mypage/sales") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">판매 내역</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/mypage/favorites") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">관심 목록</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/mypage/schedule") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">내 일정</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/mypage/edit") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">내 정보 수정</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/add") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">물품 등록</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }
  if (pathname === "/recent") {
    return (
      <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_1px_8px_rgba(0,0,0,0.1)]">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">최근 본 상품</div>
        <div className="w-[36px] h-[36px]" />
      </div>
    );
  }

  return (
    <div className="h-[54px] flex items-center justify-between px-4 shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
      <div
        className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
      </div>
      <div className="font-semibold pt-1">
        {isCategoryPage && categoryName
          ? categoryName
          : isProduct3DPage && title
          ? title
          : ""}
      </div>
      <div className="w-[36px] h-[36px]" />
    </div>
  );
};
