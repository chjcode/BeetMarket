import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegListAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import axiosInstance from "@/shared/api/axiosInstance";

interface UserInfo {
  email: string;
  nickname: string;
  birthDate: string;
  gender: string;
  profileImage: string;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export const MyPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get("/api/users/my");
        setUser(res.data.content);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center bg-white pt-20">
      {/* 프로필 영역 */}
      <div className="relative mb-2">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필 이미지"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <img
            src="/beet.png"
            alt="프로필 이미지"
            className="w-32 h-32 rounded-full object-contain"
          />
        )}

        <button
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow"
          onClick={() => navigate("/mypage/edit")}
        >
          <FiSettings className="text-2xl text-black" />
        </button>
      </div>
      <div className="text-2xl font-bold mb-1">
        {user?.nickname ?? "닉네임을 설정하세요."}
      </div>
      <div className="text-gray-400 text-base mb-1">
        {user?.region ?? "사용자 지역을 설정하세요."}
      </div>

      {/* 네 개의 아이콘 메뉴 */}
      <div className="flex justify-between gap-6 w-full mb-8 px-14 py-34">
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

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="mt-4 mb-10 px-6 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600"
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
