import { createBrowserRouter } from "react-router-dom";
import Landing from "./pages/landing";
// import Dashboard from "./pages/dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Landing/> },
//   { path: "/dashboard", element: <Dashboard/> }
]);
