import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./HomePage";
import PostPage from "./PostPage";
import LoginPage from "./LoginPage";
import AdminPage from "./AdminPage"

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/post/:id",
      element: <PostPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/admin",
      element: <AdminPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;