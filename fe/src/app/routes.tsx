import { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "@/pages/HomePage/ProductPage/HomePage";
import AuthPage from "@/pages/AuthPage";
import MyPage from "@/pages/MyPage";
import PickPage from "@/pages/PickPage";
import ChatsPage from "@/pages/ChattingPage";
import ProductDetailPage from "@/pages/HomePage/ProductPage/ProductDetailPage";
import Product3DViewerPage from "@/pages/HomePage/ProductPage/Product3DViewerPage/Product3DViewerPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pick", element: <PickPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "chatting", element: <ChatsPage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "product/:id", element: <ProductDetailPage />},
      { path: "product/:id/3d", element: <Product3DViewerPage /> },
    ],
  },
];
