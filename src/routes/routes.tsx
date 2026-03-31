import Layout from "@components/Layout";
import LoginForm from "@components/LoginForm";
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
      {
        path: "/login",
        Component: LoginForm
      },
      {
        path: "/projects",
        element: <div>Project page</div>
      }
    ],
  }
