import DefaultLayout from "../layouts/DefaultLayout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path:'/',
        element:<Home/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
];
