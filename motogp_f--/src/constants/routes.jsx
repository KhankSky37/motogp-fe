import DefaultLayout from "../layouts/DefaultLayout.jsx";
import Home from "../pages/user/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import NotFound from "../pages/NotFound.jsx";
import AdminCategory from "../pages/Admin/category/AdminCategory.jsx";
import AdminEvent from "../pages/Admin/event/AdminEvent.jsx";
import AdminResult from "../pages/Admin/result/AdminResult.jsx";
import AdminContract from "../pages/Admin/contract/AdminContract.jsx";
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
import Result from "../pages/user/resultStanding/Result.jsx";
import AdminUserUpdate from "../pages/Admin/userAdmin/AdminUserUpdate.jsx";
import AdminNewsArticle from "../pages/Admin/newsArticle/AdminNewsArticle.jsx";
import AdminNewsArticleCreate from "../pages/Admin/newsArticle/AdminNewsArticleCreate.jsx";
import AdminNewsArticleUpdate from "../pages/Admin/newsArticle/AdminNewsArticleUpdate.jsx";

import NewsPage from "../pages/user/news/NewsPage.jsx";
import Riders from "../pages/user/Riders.jsx";
import Teams from "../pages/user/Teams.jsx";
import Calendar from "../pages/user/calendar/Calendar.jsx";
import Legends from "../pages/user/Legends.jsx";
import ResultStanding from "../pages/user/resultStanding/ResultStanding.jsx";
import Standing from "../pages/user/resultStanding/Standing.jsx";
import VideoPass from "../pages/user/VideoPass.jsx";
import Videos from "../pages/user/Videos.jsx";
import Register from "../pages/auth/Register.jsx";
import ProtectedRoute from "../components/admin/ProtectedRoute.jsx";
import UserProfile from "../pages/user/UserProfile.jsx";
import CalendarDetail from "../pages/user/calendar/CalendarDetail.jsx";


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
        path: "/",
        element: <ResultStanding/>,
        children: [
          {
            // index: true,
            path: 'gp-results',
            element: <Result/>,
          },
          {
            path: "standings",
            element: <Standing/>
          }
        ],
      },
      // Add News route
      {
        path: "/news",
        element: <NewsPage/>,
      },
      {
        path: "/videopass",
        element: <VideoPass/>,
      },
      {
        path: "/videos",
        element: <Videos/>,
      },
      {
        path: "riders",
        element: <Riders/>,
      },
      {
        path: "teams", // thêm dòng này
        element: <Teams/>,
      },
      {
        path: "legends",
        element: <Legends/>,
      },
      {
        path: "calendar",
        element: <Calendar/>
      },
      {
        path: "calendar/:eventName/:eventId",
        element: <CalendarDetail/>,
      }
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={['ADMIN']}/>,
    children: [
      {
        element: <AdminLayout/>, // AdminLayout now wraps all admin children
        children: [
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
          { // Add Contract Route
            path: "contracts",
            element: <AdminContract/>,
          },
        ],
      }
    ],

  },
  {
    path: "/profile",
    element: <UserProfile/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "*",
    element: <NotFound/>,
  },
];
