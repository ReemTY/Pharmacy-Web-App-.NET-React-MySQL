import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import Cards from "../views/ui/Cards"; // Importing Cards component directly

const UserLayout = () => {
  return (
    <main>
      <div className="pageWrapper">
        {/* Cards Component */}
        <Cards />
      </div>
    </main>
  );
};

export default UserLayout;
