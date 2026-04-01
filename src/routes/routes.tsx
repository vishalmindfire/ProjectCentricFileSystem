import Layout from "@components/Layout";
import ProtectedLayout from "@components/ProtectedLayout";
import Home from "@pages/home";
import Login from "@pages/login";
import ErrorPage from "@pages/error";
import ErrorNotFoundPage from "pages/errorNotFound";
import type { RouteObject } from "react-router";
export const routes: RouteObject = {
  element: <Layout />,
  errorElement: <ErrorPage/>,
  children: [
    {
      Component: ProtectedLayout,
      children: [
        {
          path: "/projects",
          element: <div>Project page</div>,
        },
        {
          path: "/",
          Component: Home,
        },
      ],
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/*",
      Component: ErrorNotFoundPage
    }
  ],
};
