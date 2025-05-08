import { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/AuthPage";
import MyPage from "@/pages/MyPage";
import PickPage from "@/pages/PickPage";
import ChatsPage from "@/pages/ChattingPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "pick", element: <PickPage /> },
      { path: "chatting", element: <ChatsPage /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
];
