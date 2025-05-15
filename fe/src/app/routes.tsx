import { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "@/pages/HomePage/ProductPage/HomePage";
import { LoginPage }  from "@/pages/login"
import { MyPage, PurchasesPage, SalesPage, FavoritesPage } from "@/pages/MyPage";
import PickPage from "@/pages/PickPage";
import ChatsPage from "@/pages/ChattingPage";
import NotFoundPage from "@/pages/UtilPage/NotFoundPage";
import AlarmPage from "@/pages/UtilPage/AlarmPage";
import { RequireAuth } from "@/app/providers/RequireAuth";
import ProductDetailPage from "@/pages/HomePage/ProductPage/ProductDetailPage";
import Product3DViewerPage from "@/pages/HomePage/ProductPage/Product3DViewerPage";
import AddPage from "@/pages/AddPage/AddPage";
import MyPageEdit from "@/pages/MyPage/MyPageEdit";
import CategoryPage from "@/pages/HomePage/CategoryPage/CategoryPage";
import { AuthRedirectPage } from "@/pages/auth/AuthRedirectPage";

export const routes: RouteObject[] = [
  { path: "auth-redirect", element: <AuthRedirectPage /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "pick", element: <PickPage /> },
      { path: "chatting", element: <ChatsPage /> },
      { path: "category", element: <CategoryPage /> },
      {
        path: "mypage",
        children: [
          { index: true, element: <MyPage /> },
          { path: "purchases", element: <PurchasesPage /> },
          { path: "sales", element: <SalesPage /> },
          { path: "favorites", element: <FavoritesPage /> },
          { path: "edit", element: <MyPageEdit /> },
        ],
      },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "product/:id/3d", element: <Product3DViewerPage /> },
      { path: "alarm", element: <AlarmPage /> },
      { path: "add", element: <AddPage /> },
    ],
  },
  { path: "login", element: <LoginPage /> },
  // { path: "signup", element: <SignupPage /> },
  { path: "*", element: <NotFoundPage /> },
];