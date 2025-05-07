import { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MyPage from "@/pages/MyPage";
import ChattingListPage from "@/pages/ChattingPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "chatting", element: <ChattingListPage /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
];
