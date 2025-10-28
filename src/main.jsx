import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { TransactionProvider } from "./context/TransactionContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "transactions", element: <Transactions /> },
      { path: "settings", element: <Settings /> },
      { path: "login", element: <Login /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TransactionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
    </TransactionProvider>
  </React.StrictMode>
);
