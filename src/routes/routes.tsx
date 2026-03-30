import Layout from "@components/Layout";
import Home from "@pages/home";
import type { RouteObject } from "react-router";
export const routes:RouteObject = 
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        Component: Home,
      },
    ],
  }
