import DefaultLayout from "../layouts/DefaultLayout.jsx";
import Home from "../pages/user/Home.jsx";
import Login from "../pages/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminRider from "../pages/Admin/AdminRider.jsx";
import NotFound from "../pages/NotFound.jsx";
import AdminCategory from "../pages/Admin/AdminCategory.jsx";
import AdminCircuit from "../pages/Admin/AdminCircuit.jsx";
import AdminEvent from "../pages/Admin/AdminEvent.jsx";
import AdminManufacturer from "../pages/Admin/AdminManufacturer.jsx";
import AdminNewsArticle from "../pages/Admin/AdminNewsArticle.jsx";
import AdminResult from "../pages/Admin/AdminResult.jsx";
import AdminSeason from "../pages/Admin/AdminSeason.jsx";
import AdminSession from "../pages/Admin/AdminSession.jsx";
import AdminTeam from "../pages/Admin/AdminTeam.jsx";
import AdminUser from "../pages/Admin/AdminUser.jsx";
import AdminContract from "../pages/Admin/AdminContract.jsx";

export const routes = [
  {
    path: "/",
    element: <DefaultLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <AdminCategory />
      },
      {
        path: "categories",
        element: <AdminCategory/>
      },
      {
        path: "circuits",
        element: <AdminCircuit/>
      },
      {
        path: "events",
        element: <AdminEvent/>
      },
      {
        path: "manufacturers",
        element: <AdminManufacturer/>
      },
      {
        path: "news",
        element: <AdminNewsArticle/>
      },
      {
        path: "results",
        element: <AdminResult/>
      },
      {
        path: "riders",
        element: <AdminRider/>
      },
      {
        path: "seasons",
        element: <AdminSeason/>
      },
      {
        path: "sessions",
        element: <AdminSession/>
      },
      {
        path: "teams",
        element: <AdminTeam/>
      },
      {
        path: "users",
        element: <AdminUser/>
      },
      {
        path: "contracts",
        element: <AdminContract/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: '*',
    element: <NotFound/>
  }
];