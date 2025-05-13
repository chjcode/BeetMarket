import { GoogleLoginButton } from "@/features/auth/ui/GoogleLoginButton";

const LoginPage = () => {
  return (
    <div className="flex justify-center w-screen bg-gray-100 min-h-screen">
      <div
        className="
          w-full 
          min-w-[360px] 
          max-w-[480px] 
          flex flex-col 
          bg-[#F3D6F7]
          shadow-md 
          items-center
          justify-between
          gap-4
          pt-48
          pb-36"
      >
        <div className="flex flex-col justify-center items-center">
          <img
            src="/beet3.png"
            className="w-[140px] mb-4 animate-bounce"
          />
          <h1 className="text-[#370035] text-4xl font-extrabold font-moneygraphy tracking-wide">
            비트마켓
          </h1>
        </div>
        <GoogleLoginButton />

      </div>
    </div>
  );
};

export default LoginPage;
