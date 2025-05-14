import { useGoogleLogin as useGoogleLoginBase } from "@react-oauth/google";
import axios from "axios";

export const useGoogleLogin3 = () => {
  return useGoogleLoginBase({
    onSuccess: async () => {
      try {
        // const accessToken = tokenResponse.access_token;

        const res = await axios.get(
          `https://k12a307.p.ssafy.io/api/oauth2/authorization/google`
        );

        localStorage.setItem("accessToken", res.data.accessToken);
      } catch (err) {
        console.error("서버 로그인 실패", err);
      }
    },
    onError: () => {
      console.error("구글 로그인 실패");
    },
  });
};
