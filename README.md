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
