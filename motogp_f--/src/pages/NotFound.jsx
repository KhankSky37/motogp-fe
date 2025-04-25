import React from 'react';
import { Link } from 'react-router-dom'; // Import Link để tạo liên kết về trang chủ

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Oops! Trang không tồn tại</h2>
        <p className="text-lg text-gray-600 mb-8">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          Có thể trang đã bị xóa hoặc đường dẫn bị sai.
        </p>
        <Link
          to="/" // Đường dẫn về trang chủ
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
        >
          Quay về Trang Chủ
        </Link>
      </div>
      {/* Bạn có thể thêm một hình ảnh minh họa ở đây nếu muốn */}
      {/* <img src="/path/to/your/image.svg" alt="Not Found Illustration" className="mt-8 w-64 h-auto" /> */}
    </div>
  );
};

export default NotFound;