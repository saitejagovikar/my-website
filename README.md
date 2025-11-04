# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend API (Express + MongoDB)

A backend server is scaffolded under `server/`.

Setup:

1. Create `server/.env` with:

```
PORT=5001
MONGODB_URI="mongodb+srv://saitejaadmin:<password>@cluster0.xjkexnm.mongodb.net/Cluster0dmin123?retryWrites=true&w=majority&appName=Cluster0"
CORS_ORIGIN=http://localhost:5173
```

2. Install and run the API:

```bash
cd server
npm install
npm run dev
```

Frontend config:

Create a `.env` at the project root with:

```
VITE_API_BASE=http://localhost:5001
```

Endpoints:

- GET `http://localhost:5001/api/products?category=everyday|luxe|limited-edition|customizable`
- GET `http://localhost:5001/api/products/:id`
- GET `http://localhost:5001/api/banners`
- POST `http://localhost:5001/api/admin/products` (create)
- POST `http://localhost:5001/api/admin/banners` (create)
- PUT `http://localhost:5001/api/admin/products/:id` (update)
- PUT `http://localhost:5001/api/admin/banners/:id` (update)
- DELETE `http://localhost:5001/api/admin/products/:id`
- DELETE `http://localhost:5001/api/admin/banners/:id`
