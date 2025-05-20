import { RouteObject } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "@/pages/HomePage/ProductPage/HomePage";
import { LoginPage }  from "@/pages/login"
import { MyPage, PurchasesPage, SalesPage, FavoritesPage } from "@/pages/MyPage";
import MapPage from "@/pages/MapPage";
import NotFoundPage from "@/pages/UtilPage/NotFoundPage";
import AlarmPage from "@/pages/UtilPage/AlarmPage";
import { RequireAuth } from "@/app/providers/RequireAuth";
import ProductDetailPage from "@/pages/HomePage/ProductPage/ProductDetailPage";
import Product3DViewerPage from "@/pages/HomePage/ProductPage/Product3DViewerPage";
import AddPage from "@/pages/AddPage/AddPage";
import SchedulePage from "@/pages/MyPage/SchedulePage";
import SearchPage from "@/pages/HomePage/SearchPage/SearchPage";
import SearchResultPage from "@/pages/HomePage/SearchPage/SearchResultPage/ui/SearchResultPage";
import { AuthRedirectPage } from "@/pages/auth/AuthRedirectPage";
import CategoryListPage from "@/pages/HomePage/CategoryPage/CategoryListPage";
import MyPageEdit from "@/pages/MyPage/MyPageEdit";
import { ChatsPage, ChatRoomPage, ChatRoomPage2 }from "@/pages/chats";
import { SignupPage } from "@/pages/signup"
import CategoryProductsPage from "@/pages/HomePage/CategoryPage/CategoryProductsPage";
import RecentPage from "@/pages/HomePage/CategoryPage/RecentPage";


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
      { path: "map", element: <MapPage /> },
      {
        path: "chats",
        children: [
          { index: true, element: <ChatsPage /> },
          { path: ":id", element: <ChatRoomPage /> },
        ],
      },
      {
        path: "chats2",
        children: [
          { index: true, element: <ChatsPage /> },
          { path: ":id", element: <ChatRoomPage2 /> },
        ],
      },
      {
        path: "category",
        children: [
          { index: true, element: <CategoryListPage /> },
          { path: ":category", element: <CategoryProductsPage /> },
        ],
      },
      {
        path: "mypage",
        children: [
          { index: true, element: <MyPage /> },
          { path: "purchases", element: <PurchasesPage /> },
          { path: "sales", element: <SalesPage /> },
          { path: "favorites", element: <FavoritesPage /> },
          { path: "schedule", element: <SchedulePage /> },
          { path: "edit", element: <MyPageEdit /> },
        ],
      },
      {
        path: "product/:id",
        children: [
          { index: true, element: <ProductDetailPage /> },
          { path: "3d", element: <Product3DViewerPage /> },
        ],
      },
      {
        path: "search",
        children: [
          { index: true, element: <SearchPage /> },
          { path: "result", element: <SearchResultPage /> },
        ],
      },
      { path: "alarm", element: <AlarmPage /> },
      { path: "add", element: <AddPage /> },
      { path: "recent", element: <RecentPage />}
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
  { path: "*", element: <NotFoundPage /> },
];
