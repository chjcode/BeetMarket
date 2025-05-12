import { NavLink } from "react-router-dom";

export const MyPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">MyPage</h1>
      <NavLink to="sales">판매</NavLink>
      <br />
      <NavLink to="purchases">구매</NavLink>
      <br />
      <NavLink to="favorites">찜</NavLink>
    </div>
  );
}; 