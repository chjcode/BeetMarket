import { NavItem } from "./NavItem";
import ChatIcon from '@/shared/ui/icons/ChatIcon';
import HomeIcon from '@/shared/ui/icons/HomeIcon';
import MyIcon from '@/shared/ui/icons/MyIcon';

export const BottomNav = () => {
  return (
    <nav className="h-[56px] fixed bottom-0 w-full max-w-[600px] bg-white border-t flex justify-around items-center z-10">
      <NavItem to="/" label="홈" icon = {<HomeIcon />} />
      <NavItem to="/1" label="??" />
      <NavItem to="/2" label="+" />
      <NavItem to="/chatting" label="채팅"  icon = {<ChatIcon />} />
      <NavItem to="/mypage" label="마이" icon = {<MyIcon />} />
    </nav>
  );
};
