import DefaultLayout from "../layouts/DefaultLayout.jsx";
import Home from "../pages/user/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import NotFound from "../pages/NotFound.jsx";
import AdminCategory from "../pages/Admin/category/AdminCategory.jsx";
import AdminEvent from "../pages/Admin/event/AdminEvent.jsx";
import AdminResult from "../pages/Admin/result/AdminResult.jsx";
import AdminUser from "../pages/Admin/userAdmin/AdminUser.jsx";
import AdminContract from "../pages/Admin/AdminContract.jsx";
import AdminRider from "../pages/Admin/rider/AdminRider.jsx";
import AdminRiderCreate from "../pages/Admin/rider/AdminRiderCreate.jsx";
import AdminRiderUpdate from "../pages/Admin/rider/AdminRiderUpdate.jsx";
import AdminSeason from "../pages/Admin/season/AdminSeason.jsx";
import AdminSeasonCreate from "../pages/Admin/season/AdminSeasonCreate.jsx";
import AdminSeasonUpdate from "../pages/Admin/season/AdminSeasonUpdate.jsx";
import AdminSession from "../pages/Admin/session/AdminSession.jsx";
import AdminSessionCreate from "../pages/Admin/session/AdminSessionCreate.jsx";
import AdminSessionUpdate from "../pages/Admin/session/AdminSessionUpdate.jsx";
import AdminEventCreate from "../pages/Admin/event/AdminEventCreate.jsx";
import AdminEventUpdate from "../pages/Admin/event/AdminEventUpdate.jsx";
import AdminCircuit from "../pages/Admin/circuit/AdminCircuit.jsx";
import AdminCircuitCreate from "../pages/Admin/circuit/AdminCircuitCreate.jsx";
import AdminCircuitUpdate from "../pages/Admin/circuit/AdminCircuitUpdate.jsx";
import AdminManufacturer from "../pages/Admin/manufacturer/AdminManufacturer.jsx";
import AdminManufacturerCreate from "../pages/Admin/manufacturer/AdminManufacturerCreate.jsx";
import AdminManufacturerUpdate from "../pages/Admin/manufacturer/AdminManufacturerUpdate.jsx";
import AdminResultCreate from "../pages/Admin/result/AdminResultCreate.jsx";
import AdminResultUpdate from "../pages/Admin/result/AdminResultUpdate.jsx";
import Result from "../pages/user/Result.jsx";
import AdminTeam from "../pages/Admin/team/AdminTeam.jsx";
import AdminTeamCreate from "../pages/Admin/team/AdminTeamCreate.jsx";
import AdminTeamUpdate from "../pages/Admin/team/AdminTeamUpdate.jsx";
import AdminUserCreate from "../pages/Admin/userAdmin/AdminUserCreate.jsx";
import AdminUserUpdate from "../pages/Admin/userAdmin/AdminUserUpdate.jsx";
import AdminNewsArticle from "../pages/Admin/newsArticle/AdminNewsArticle.jsx";
import AdminNewsArticleCreate from "../pages/Admin/newsArticle/AdminNewsArticleCreate.jsx";
import AdminNewsArticleUpdate from "../pages/Admin/newsArticle/AdminNewsArticleUpdate.jsx";

export const routes = [
  {
    path: "/",
    element: <DefaultLayout/>,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: "/gp-results",
        element: <Result/>,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <AdminCategory/>,
      },
      {
        path: "categories",
        element: <AdminCategory/>,
      },
      {
        path: "circuits",
        element: <AdminCircuit/>,
      },
      {
        path: "circuits/create",
        element: <AdminCircuitCreate/>,
      },
      {
        path: "circuits/update/:id",
        element: <AdminCircuitUpdate/>,
      },
      {
        path: "events",
        element: <AdminEvent/>,
      },
      {
        path: "events/create",
        element: <AdminEventCreate/>,
      },
      {
        path: "events/update/:eventId",
        element: <AdminEventUpdate/>,
      },
      {
        path: "manufacturers",
        element: <AdminManufacturer/>,
      },
      {
        path: "manufacturers/create",
        element: <AdminManufacturerCreate/>,
      },
      {
        path: "manufacturers/update/:id",
        element: <AdminManufacturerUpdate/>,
      },
      {
        path: "news",
        element: <AdminNewsArticle/>,
      },
      {
        path: "results",
        element: <AdminResult/>,
      },
      {
        path: "results/create",
        element: <AdminResultCreate/>,
      },
      {
        path: "results/update/:resultId",
        element: <AdminResultUpdate/>,
      },
      {
        path: "riders",
        element: <AdminRider/>,
      },
      {
        path: "riders/create",
        element: <AdminRiderCreate/>,
      },
      {
        path: "riders/update/:riderId",
        element: <AdminRiderUpdate/>,
      },
      {
        path: "seasons",
        element: <AdminSeason/>,
      },
      {
        path: "seasons/create",
        element: <AdminSeasonCreate/>,
      },
      {
        path: "seasons/update/:seasonId",
        element: <AdminSeasonUpdate/>,
      },
      {
        path: "sessions",
        element: <AdminSession/>,
      },
      {
        path: "sessions/create",
        element: <AdminSessionCreate/>,
      },
      {
        path: "sessions/update/:sessionId",
        element: <AdminSessionUpdate/>,
      },
      {
        path: "teams",
        element: <AdminTeam/>,
      },
      {
        path: "teams/create",
        element: <AdminTeamCreate/>,
      },
      {
        path: "teams/update/:id",
        element: <AdminTeamUpdate/>,
      },
      {
        path: "users",
        element: <AdminUser/>,
      },
      {
        path: "users/create", // Trang tạo user mới
        element: <AdminUserCreate/>
      },
      {
        path: "users/update/:id", // Route mới cho trang cập nhật user
        element: <AdminUserUpdate/>
      },
      {
        path: "contracts",
        element: <AdminContract/>,
      },

      {
        path: "news-articles", // Hoặc tên route bạn muốn
        element: <AdminNewsArticle/>
      },
      {
        path: "news-articles/create", // Trang tạo bài viết mới
        element: <AdminNewsArticleCreate/>
      },
      {
        path: "news-articles/update/:id", // Route mới cho trang cập nhật
        element: <AdminNewsArticleUpdate/>
      },
    ],
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "*",
    element: <NotFound/>,
  },
];
