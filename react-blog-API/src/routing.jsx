import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./HomePage";
import PostPage from "./PostPage";

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
  ]);

  return <RouterProvider router={router} />;
};

export default Router;