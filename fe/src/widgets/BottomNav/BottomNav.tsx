import { NavItem } from "./NavItem";

export const BottomNav = () => {
  return (
    <nav
      className="h-[56px] fixed bottom-0 w-full max-w-[480px] bg-gray-50 flex justify-around items-center z-10
      shadow-[0_-1px_10px_rgba(0,0,0,0.1)]
    ">
      <NavItem to="/" label="홈" icon="home" />
      <NavItem to="/pick" label="지도" icon="map" />
      <NavItem to="/add" label="" icon="plus" />
      <NavItem to="/chats" label="채팅" icon="chat" />
      <NavItem to="/mypage" label="마이" icon="user" />
    </nav>
  );
};
