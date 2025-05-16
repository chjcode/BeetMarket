import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi2";

export const MyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center bg-white pt-6">
      {/* 프로필 영역 */}
      <div className="relative mb-2">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400" />
        <button
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow"
          onClick={() => navigate("/mypage/edit")}
        >
          <FiSettings className="text-2xl text-black" />
        </button>
      </div>
      <div className="text-2xl font-bold mb-1">안녕하세요</div>
      <div className="text-gray-400 text-base mb-1">서울특별시 강남구</div>
      <div className="text-red-500 text-sm font-semibold mb-4">거래 취소 횟수 : 1</div>

      {/* 네 개의 아이콘 메뉴 */}
      <div className="flex justify-between gap-6 w-full mb-8 px-14">
        <NavLink to="/mypage/purchases" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#F7DAF1] flex items-center justify-center mb-1">
            <FaShoppingBag className="text-2xl text-[#A349A4]" />
          </div>
          <span className="text-xs">구매내역</span>
        </NavLink>
        <NavLink to="/mypage/sales" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#F7DAF1] flex items-center justify-center mb-1">
            <FaRegListAlt className="text-2xl text-[#A349A4]" />
          </div>
          <span className="text-xs">판매내역</span>
        </NavLink>
        <NavLink to="/mypage/favorites" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#F7DAF1] flex items-center justify-center mb-1">
            <FaHeart className="text-2xl text-[#A349A4]" />
          </div>
          <span className="text-xs">관심목록</span>
        </NavLink>
        <NavLink to="/mypage/schedule" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#F7DAF1] flex items-center justify-center mb-1">
            <FaRegCalendarAlt className="text-2xl text-[#A349A4]" />
          </div>
          <span className="text-xs">내 일정</span>
        </NavLink>
      </div>

      {/* 본인 인증 */}
      <div className="w-full max-w-md px-10 flex justify-start">
        <button className="flex items-center gap-2 mt-2 text-lg font-medium ml-4">
          <HiOutlineIdentification className="text-2xl text-black" />
          본인 인증 하기
        </button>
      </div>
    </div>
  );
};

export default MyPage;