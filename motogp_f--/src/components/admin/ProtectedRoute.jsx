// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
//
// const ProtectedRoute = ({ allowedRoles }) => {
//   const userString = localStorage.getItem('motogp_user');
//   let user = null;
//   if (userString) {
//     try {
//       user = JSON.parse(userString);
//     } catch (error) {
//       console.error("Failed to parse user from localStorage", error);
//       localStorage.removeItem('motogp_user');
//     }
//   }
//
//   if (!user || !user.role) {
//     return <Navigate to="/login" replace />;
//   }
//
//   if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) {
//     return <Navigate to="/" replace />;
//   }
//
//   return <Outlet />;
// };
//
// export default ProtectedRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('motogp_token');
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
        userRole = decodedToken.role?.toUpperCase(); // Lấy vai trò từ token và chuyển thành chữ hoa
      } else {
        // Token hết hạn
        localStorage.removeItem('motogp_token');
        localStorage.removeItem('motogp_user');
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('motogp_token');
      localStorage.removeItem('motogp_user');
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Backend trả về role (ví dụ "ADMIN"), allowedRoles cũng nên là ["ADMIN"]
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Đã đăng nhập, nhưng vai trò không được phép
    // Chuyển hướng về trang chủ hoặc trang "Không có quyền truy cập"
    return <Navigate to="/" replace />; // Hoặc một trang lỗi 403
  }

  return <Outlet />;
};

export default ProtectedRoute;