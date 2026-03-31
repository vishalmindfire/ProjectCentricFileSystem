import Layout from "@components/Layout";
import ProtectedLayout from "@components/ProtectedLayout";
import Home from "@pages/home";
import Login from "@pages/login";

import type { RouteObject } from "react-router";
export const routes: RouteObject = {
  element: <Layout />,
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
  ],
};
