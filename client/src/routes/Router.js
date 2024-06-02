import { lazy } from "react";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/
const About = lazy(() => import("../views/ui/About.js"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const UserAccount = lazy(() => import("../user/useraccount.js"));
const Medicines = lazy(() => import("../services/medicines.js"));
const Categories = lazy(() => import("../services/categories.js"));
const UsersPage = lazy(() => import("../services/UsersPage.js"));
const UserDetails = lazy(() => import("../services/UserDetails.js"));
const AdminDashboard = lazy(() => import("../components/AdminDashboard.js"));


/*****Routes******/
const ThemeRoutes = () => {
  return [
    {
      path: "/",
      element: <FullLayout />,
      children: [
        { path: "/about", exact: true, element: <About /> },
        { path: "/grid", exact: true, element: <Grid /> },
        { path: "/grid/:id", exact: true, element: <Grid /> },
        { path: "/table", exact: true, element: <Tables /> },
        { path: "/useraccount", exact: true, element: <UserAccount /> },
        { path: "/medicines", exact: true, element: <Medicines /> },
        { path: "/categories", exact: true, element: <Categories /> },
        { path: "/users", exact: true, element: <UsersPage /> },
        { path: "/users/:id", exact: true, element: <UserDetails /> },
        { path: "/admin-dashboard", exact: true, element: <AdminDashboard /> },
      ],
    },
  ];
};

export default ThemeRoutes;
