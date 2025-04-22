# MotoGP Frontend

This project is a React-based frontend application for MotoGP built with Vite and styled using Tailwind CSS.

## Prerequisites

- Node.js (version 18.x or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to the project directory:

```bash
cd motogp_f--
```

3. Install dependencies:

```bash
npm install
# or
yarn
```

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in development mode with hot-reload enabled.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.

### `npm run preview` or `yarn preview`

Locally preview the production build after running the build command.

### `npm run lint` or `yarn lint`

Lints the project files using ESLint.

## Project Structure

```
motogp_f--/
├── public/           # Static files
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── App.jsx       # Main app component
│   ├── App.css       # App-specific styles
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles with Tailwind
├── index.html        # HTML entry point
├── vite.config.js    # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
├── eslint.config.js  # ESLint configuration
└── package.json      # Project dependencies and scripts
```

## Technologies Used

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ant Design](https://ant.design/)
- [ESLint](https://eslint.org/)

## Customization

You can customize the Tailwind configuration by editing `tailwind.config.js`.


# Cách đặt tên nhánh
````
      1 Nhánh master: nhánh chính chứa source code ổn định, đã được kiểm tra. 
      
      2 Nhánh develop: nhánh chính chứa source code mới nhất.
      Tất cả các thay đổi mới nhất sẽ được push/merge lên nhánh develop
      
      3 Feature branches: các nhánh hỗ trợ phục vụ quá trình phát triển
         Checkout từ: develop
         Merge vào: develop
         Đặt  tên:  [feature]/[Tên]-[Chức năng phát triển] 
         Ví dụ: feature/[KhankSky]-manage-user
         Lưu ý: Tên feature không sử dụng tiếng việt và không chứa dấu cách dấu cách
      Khi phát triển một tính năng mới, một nhánh feature sẽ được tạo từ source code mới nhất của nhánh develop, nhằm tách biệt với các tính năng đang phát triển khác. 
````


# Cách comment commit theo 
````
      Cấu trúc:
      <type>[scope]: <description>
      [optional body]
      -	type: Sử dụng các từ khóa sau để mô tả nội dung làm.
           feat: thêm một feature
           fix: fix bug cho hệ thống, vá lỗi trong codebase
           refactor: sửa code nhưng không fix bug cũng không thêm feature hoặc đôi khi bug cũng được fix từ việc refactor.
           docs: thêm/thay đổi document
           chore: những sửa đổi nhỏ nhặt không liên quan tới code
           style: những thay đổi không làm thay đổi ý nghĩa của code như thay đổi css/ui chẳng hạn.
           perf: code cải tiến về mặt hiệu năng xử lý
           vendor: cập nhật version cho các dependencies, packages.
      -	description: là mô tả ngắn về những gì sẽ bị sửa đổi trong commit đấy
      -	body: là mô tả dài và chi tiết hơn, cần thiết khi description chưa thể nói rõ hết được, có thể thêm phần ghi chú bằng các keyword
      
      Ví dụ: feat[home]: add pagination
````