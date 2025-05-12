import { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "@/pages/HomePage/ProductPage/HomePage";
import {LoginPage, SignUpPage } from "@/pages/AuthPage";
import {MyPage, PurchasesPage, SalesPage, FavoritesPage} from "@/pages/mypage";
import PickPage from "@/pages/PickPage";
import ChatsPage from "@/pages/ChattingPage";
import NotFoundPage from "@/pages/UtilPage/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pick", element: <PickPage /> },
      { path: "chatting", element: <ChatsPage /> },
      {
        path: "mypage",
        children: [
          { index: true, element: <MyPage /> },
          { path: "purchases", element: <PurchasesPage /> },
          { path: "sales", element: <SalesPage /> },
          { path: "favorites", element: <FavoritesPage /> },
        ],
      },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignUpPage /> },
  { path: "*", element: <NotFoundPage /> },
];