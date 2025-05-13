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
      <br />
      <NavLink to="/login" className="" onClick={()=>{localStorage.removeItem("accessToken");}}>로그아웃</NavLink>
    </div>
  );
}; 

export default MyPage;