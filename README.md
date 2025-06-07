# MotoGP Frontend

## Project Overview

MotoGP Frontend is a dynamic web application designed for MotoGP enthusiasts. It provides users with up-to-date information on race schedules, rider profiles, team details, and current standings. The application also features an administrative backend for managing the content, including users, news articles, events, and more.

## Live Demo

`Deployed: [https://motogp-k.me](https://motogp-k.me)`

## Features

### User-Facing Features:
*   **Homepage**: Overview of latest news, upcoming events, and videos.
*   **News Section**: Browse and read the latest MotoGP news articles ([`src/pages/user/news/NewsPage.jsx`](motogp_f--/src/pages/user/news/NewsPage.jsx)).
*   **Results & Standings**: View detailed race results and championship standings by season, event, and category ([`src/pages/user/resultStanding/Result.jsx`](motogp_f--/src/pages/user/resultStanding/Result.jsx)).
*   **Riders & Teams**: Explore profiles of MotoGP riders and teams ([`src/layouts/RidersTeamsMenu.jsx`](motogp_f--/src/layouts/RidersTeamsMenu.jsx)).
*   **Authentication**: Secure user registration and login ([`src/pages/auth/Login.jsx`](motogp_f--/src/pages/auth/Login.jsx), [`src/contexts/AuthContext.jsx`](motogp_f--/src/contexts/AuthContext.jsx)).
*   **User Profile**: Manage user-specific information (accessible via `/profile`).
*   **Responsive Design**: Adapts to various screen sizes for a seamless experience.

### Admin Panel Features:
*   **Dashboard**: Overview of site statistics and management links.
*   **User Management**: CRUD operations for users ([`src/pages/Admin/userAdmin/AdminUser.jsx`](motogp_f--/src/pages/Admin/userAdmin/AdminUser.jsx)).
*   **News Article Management**: Create, read, update, and delete news articles with image uploads ([`src/pages/Admin/newsArticle/AdminNewsArticle.jsx`](motogp_f--/src/pages/Admin/newsArticle/AdminNewsArticle.jsx)).
*   **Event Management**: Manage race events, including details and scheduling ([`src/pages/Admin/event/AdminEventUpdate.jsx`](motogp_f--/src/pages/Admin/event/AdminEventUpdate.jsx)).
*   **Rider Management**: Manage rider profiles and information ([`src/pages/Admin/rider/AdminRiderUpdate.jsx`](motogp_f--/src/pages/Admin/rider/AdminRiderUpdate.jsx)).
*   **Team Management**: Manage team details and associated riders.
*   **Manufacturer Management**: Manage manufacturers involved in MotoGP ([`src/pages/Admin/manufacturer/AdminManufacturer.jsx`](motogp_f--/src/pages/Admin/manufacturer/AdminManufacturer.jsx)).
*   **Contract Management**: Manage contracts between riders, teams, and seasons ([`src/pages/Admin/contract/AdminContract.jsx`](motogp_f--/src/pages/Admin/contract/AdminContract.jsx)).
*   **Session Management**: Manage specific race sessions (e.g., FP1, Q2, Race) ([`src/pages/Admin/session/AdminSession.jsx`](motogp_f--/src/pages/Admin/session/AdminSession.jsx)).
*   **Result Management**: Input and manage results for various sessions ([`src/pages/Admin/result/AdminResultUpdate.jsx`](motogp_f--/src/pages/Admin/result/AdminResultUpdate.jsx)).

## Technologies Used

*   **Frontend**: React, Vite
*   **UI Framework**: Ant Design
*   **Styling**: Tailwind CSS, CSS Modules, Global CSS ([`src/App.css`](motogp_f--/src/App.css), [`src/index.css`](motogp_f--/src/index.css))
*   **Routing**: React Router DOM
*   **State Management**: React Context API ([`src/contexts/AuthContext.jsx`](motogp_f--/src/contexts/AuthContext.jsx))
*   **HTTP Client**: Axios (configured in [`src/config/HttpClient.jsx`](motogp_f--/src/config/HttpClient.jsx))
*   **Linting**: ESLint ([`eslint.config.js`](motogp_f--/eslint.config.js))
*   **Date Handling**: Day.js
*   **Carousel/Slider**: React Slick
*   **Deployment**: Vercel (inferred from [vercel.json](motogp_f--/vercel.json))

## Project Structure

The project is organized as follows:

```
motogp_f--/
├── .vscode/                  # VS Code settings (e.g., settings.json)
├── public/
│   ├── fonts/                # Font files
│   └── vite.svg              # Vite logo
├── src/
│   ├── assets/
│   │   ├── data/             # Static JSON data (e.g., countries.json)
│   │   └── images/           # Image assets
│   ├── components/
│   │   ├── admin/            # Admin-specific reusable components
│   │   ├── shared/           # Components shared across user and admin sections
│   │   └── user/             # User-facing reusable components
│   ├── config/
│   │   └── HttpClient.jsx    # Axios instance configuration
│   ├── constants/
│   │   ├── Countries.jsx     # Country-related constants
│   │   └── routes.jsx        # Application route definitions
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication context provider
│   ├── hooks/                # Custom React hooks (if any)
│   ├── layouts/
│   │   ├── AdminLayout.jsx   # Layout for admin pages
│   │   ├── DefaultLayout.jsx # Default layout for user-facing pages
│   │   └── RidersTeamsMenu.jsx # Specific menu component
│   ├── pages/
│   │   ├── Admin/            # Admin-specific page components
│   │   │   ├── contract/
│   │   │   ├── event/
│   │   │   ├── manufacturer/
│   │   │   ├── newsArticle/
│   │   │   ├── result/
│   │   │   ├── rider/
│   │   │   ├── season/
│   │   │   ├── session/
│   │   │   ├── team/
│   │   │   └── userAdmin/
│   │   ├── auth/             # Authentication pages (Login, Register)
│   │   └── user/             # User-facing page components
│   │       ├── home/
│   │       ├── news/
│   │       ├── profile/
│   │       └── resultStanding/
│   ├── services/             # API service integration modules
│   │   ├── AdminService.jsx
│   │   ├── ContractService.jsx
│   │   ├── EventService.jsx
│   │   ├── ManufacturerService.jsx
│   │   ├── NewsArticleService.jsx
│   │   ├── ResultService.jsx
│   │   ├── RiderService.jsx
│   │   ├── SeasonService.jsx
│   │   ├── SessionService.jsx
│   │   ├── TeamService.jsx
│   │   └── UserService.jsx
│   ├── utils/                # Utility functions
│   │   ├── formatters.js
│   │   └── urlHelpers.js
│   ├── App.jsx               # Main application component
│   ├── App.css               # Global styles for App component
│   ├── index.css             # Global styles, often imported in main.jsx
│   └── main.jsx              # Application entry point
├── .env.local.example        # Example environment variables file
├── .eslintignore             # Files/directories to ignore for ESLint
├── .eslintrc.cjs             # ESLint configuration (older format, might be superseded by eslint.config.js)
├── .gitignore                # Files/directories to ignore for Git
├── eslint.config.js          # ESLint configuration (newer flat config format)
├── index.html                # Main HTML file for Vite
├── package-lock.json         # Exact versions of dependencies
├── package.json              # Project metadata and dependencies
├── postcss.config.js         # PostCSS configuration
├── README.md                 # Project documentation (this file)
├── tailwind.config.js        # Tailwind CSS configuration
├── vercel.json               # Vercel deployment configuration
└── vite.config.js            # Vite build tool configuration
```

## Environment Variables

This project uses environment variables for configuration, primarily for the backend API URL.

Create a `.env.local` file in the root of the project and add the following:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Replace `http://localhost:8080/api/v1` with your actual backend API URL if it's different. This is used in [`src/config/HttpClient.jsx`](motogp_f--/src/config/HttpClient.jsx).

## Getting Started

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm (v9.x or higher) or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://your-repository-url.git
    ```
    (Replace `https://your-repository-url.git` with your actual repository URL)
2.  Navigate to the project directory:
    ```bash
    cd motogp_f--
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Running Locally

To run the application in development mode:

```bash
npm run dev
# or
# yarn dev
```

This will start the development server, typically at [http://localhost:5137](http://localhost:5137) (as configured in [vite.config.js](motogp_f--/vite.config.js)).

## Available Scripts

-   **`npm run dev`**: Starts the development server.
-   **`npm run build`**: Builds the application for production in the `dist` folder.
-   **`npm run lint`**: Lints the project files using ESLint.
-   **`npm run preview`**: Serves the production build locally for preview.

## API Backend

This frontend application consumes a backend API for data. The base URL for the API is configured using the `VITE_API_BASE_URL` environment variable. If not set, it defaults to `http://localhost:8080/api/v1` as defined in [`src/config/HttpClient.jsx`](motogp_f--/src/config/HttpClient.jsx).

Ensure the backend server is running and accessible at the configured URL.

## Contribution Guidelines

*(Note: The following sections are in Vietnamese. Consider adding English translations if targeting a broader audience or English-speaking interviewers.)*

### Cách đặt tên nhánh
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

### Cách comment commit theo
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

---
