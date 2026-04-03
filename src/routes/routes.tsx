import Layout from '@components/Layout';
import ProtectedLayout from '@components/ProtectedLayout';
import ProjectLayout from '@components/ProjectLayout';
import Home from '@pages/home';
import Login from '@pages/login';
import Projects from '@pages/projects';
import Project from '@pages/project';
import ErrorPage from '@pages/error';
import ErrorNotFoundPage from 'pages/errorNotFound';
import type { RouteObject } from 'react-router';
export const routes: RouteObject = {
  element: <Layout />,
  errorElement: <ErrorPage />,
  children: [
    {
      Component: ProtectedLayout,
      children: [
        {
          path: '/projects',
          Component: ProjectLayout,
          children: [
            {
              index: true,
              Component : Projects
            },
            {
              path: ':id',
              Component: Project
            }
          ]
        },
        {
              path: '/projects/:id',
              Component: Project
        },
        {
          path: '/',
          Component: Home,
        },
      ],
    },
    {
      path: '/login',
      Component: Login,
    },
    {
      path: '/*',
      Component: ErrorNotFoundPage,
    },
  ],
};
