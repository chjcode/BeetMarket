import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/shared/api/axiosInstance";

export const AuthRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const issueAccessToken = async () => {
      try {
        localStorage.removeItem("accessToken");
        const res = await axiosInstance.get("/api/auth/issue");
        const accessToken = res.headers["authorization"]?.replace("Bearer ", "");
        const hasNickname = res.data?.content;
        // const nickName = res.data?.nickName;
        if (!accessToken) {
          throw new Error("accessToken 누락");
        }
        localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("nickName", nickName);
        if (!hasNickname) {
          navigate("/signup");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("토큰 발급 실패:", err);
        navigate("/login");
      }
    };
    issueAccessToken();
  }, []);

  return <div>로그인중</div>;
};
