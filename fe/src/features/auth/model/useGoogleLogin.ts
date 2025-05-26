export const useGoogleLogin = () => {
  return () => {
    window.location.href =
      "https://k12a307.p.ssafy.io/api/oauth2/authorization/google";
  };
};
