import DefaultLayout from "../layouts/DefaultLayout.jsx";
import Home from "../pages/user/Home.jsx";
// Sessions component is missing - removing import
import Login from "../pages/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminRider from "../pages/Admin/rider/AdminRider.jsx";
import NotFound from "../pages/NotFound.jsx";
import AdminCategory from "../pages/Admin/AdminCategory.jsx";
import AdminCircuit from "../pages/Admin/AdminCircuit.jsx";
import AdminEvent from "../pages/Admin/event/AdminEvent.jsx";
import AdminManufacturer from "../pages/Admin/AdminManufacturer.jsx";
import AdminNewsArticle from "../pages/Admin/AdminNewsArticle.jsx";
import AdminResult from "../pages/Admin/AdminResult.jsx";
import AdminSeason from "../pages/Admin/season/AdminSeason.jsx";
import AdminTeam from "../pages/Admin/AdminTeam.jsx";
import AdminUser from "../pages/Admin/AdminUser.jsx";
import AdminContract from "../pages/Admin/AdminContract.jsx";
import AdminRiderCreate from "../pages/Admin/rider/AdminRiderCreate.jsx";
import AdminRiderUpdate from "../pages/Admin/rider/AdminRiderUpdate.jsx";
import AdminSeasonCreate from "../pages/Admin/season/AdminSeasonCreate.jsx";
import AdminSeasonUpdate from "../pages/Admin/season/AdminSeasonUpdate.jsx";
import AdminSession from "../pages/Admin/session/AdminSession.jsx";
import AdminSessionCreate from "../pages/Admin/session/AdminSessionCreate.jsx";
import AdminSessionUpdate from "../pages/Admin/session/AdminSessionUpdate.jsx";
import AdminEventCreate from "../pages/Admin/event/AdminEventCreate.jsx";
import AdminEventUpdate from "../pages/Admin/event/AdminEventUpdate.jsx";

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Temporarily commenting out the sessions route until the component is created
      // {
      //   path: "sessions",
      //   element: <Sessions />,
      // },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminCategory />,
      },
      {
        path: "categories",
        element: <AdminCategory />,
      },
      {
        path: "circuits",
        element: <AdminCircuit />,
      },
      {
        path: "events",
        element: <AdminEvent />,
      },
      {
        path: "events/create",
        element: <AdminEventCreate />,
      },
      {
        path: "events/update/:eventId",
        element: <AdminEventUpdate />,
      },
      {
        path: "manufacturers",
        element: <AdminManufacturer />,
      },
      {
        path: "news",
        element: <AdminNewsArticle />,
      },
      {
        path: "results",
        element: <AdminResult />,
      },
      {
        path: "riders",
        element: <AdminRider />,
      },
      {
        path: "riders/create",
        element: <AdminRiderCreate />,
      },
      {
        path: "riders/update/:riderId",
        element: <AdminRiderUpdate />,
      },
      {
        path: "seasons",
        element: <AdminSeason />,
      },
      {
        path: "seasons/create",
        element: <AdminSeasonCreate />,
      },
      {
        path: "seasons/update/:seasonId",
        element: <AdminSeasonUpdate />,
      },
      {
        path: "sessions",
        element: <AdminSession />,
      },
      {
        path: "sessions/create",
        element: <AdminSessionCreate />,
      },
      {
        path: "sessions/update/:sessionId",
        element: <AdminSessionUpdate />,
      },
      {
        path: "teams",
        element: <AdminTeam />,
      },
      {
        path: "users",
        element: <AdminUser />,
      },
      {
        path: "contracts",
        element: <AdminContract />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
