import { NavItem } from "./NavItem";

export const BottomNav = () => {
  return (
    <nav className="h-[56px] fixed bottom-0 w-full max-w-[600px] bg-white border-t flex justify-around items-center z-10">
      <NavItem to="/" label="홈" />
      <NavItem to="/1" label="??" />
      <NavItem to="/2" label="+" />
      <NavItem to="/3" label="채팅" />
      <NavItem to="/mypage" label="마이페이지" />
    </nav>
  );
};
