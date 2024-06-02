import React, { useState } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Themeroutes from "./routes/Router";
import Home from "./Home";
import Login from "./Login";
import Registration from "./register";
import Cards from "./views/ui/Cards";

const App = () => {
  const [userRole, setUserRole] = useState(null);

  // Function to handle login and update userRole
  const handleLogin = (userData) => {
    // Extract userRole from userData
    const { userRole } = userData;
    // Update userRole in state
    setUserRole(userRole);
  };

  // Use routes with Themeroutes and add a custom route for Home
  const routing = useRoutes([
    { path: "/Home", element: <Home /> },
    { path: "/Login", element: <Login onLogin={handleLogin} /> }, // Pass handleLogin as prop
    { path: "/register", element: <Registration /> },
    { path: "/Cards", element: <Cards /> },
    ...Themeroutes(),
    { path: "/", element: <Navigate to="/Home" /> }
  ]);

  return <div className={userRole === 0 ? "dark" : "light"}>{routing}</div>;
};

export default App;
