import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Import the Sidebar component
import Header from "./Header";

const FullLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        {/********Content Area**********/}

        <div className="contentArea">
          {/********header**********/}
          <Header />
          {/********Middle Content**********/}
          <div className="wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
