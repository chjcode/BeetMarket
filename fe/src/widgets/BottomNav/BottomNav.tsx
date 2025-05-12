import { NavItem } from "./NavItem";

export const BottomNav = () => {
  return (
    <nav className="h-[56px] fixed bottom-0 w-full max-w-[480px] bg-gray-50 flex justify-around items-center inset-shadow-sm z-10">
      <NavItem to="/" label="홈" icon="home" />
      <NavItem to="/pick" label="추천" icon="pick" />
      <NavItem to="/create" label="" icon="plus" />
      <NavItem to="/chatting" label="채팅" icon="chat" />
      <NavItem to="/mypage" label="마이" icon="user" />
    </nav>
  );
};
