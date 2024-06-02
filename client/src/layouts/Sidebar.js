import { Button, Nav, NavItem } from "reactstrap";
// import Logo from "./Logo";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboard",
    href: "/About",
    icon: "bi bi-speedometer2",
  },
  // {
  //   title: "Alert",
  //   href: "/alerts",
  //   icon: "bi bi-bell",
  // },
  // {
  //   title: "Badges",
  //   href: "/badges",
  //   icon: "bi bi-patch-check",
  // },
  // {
  //   title: "Buttons",
  //   href: "/buttons",
  //   icon: "bi bi-hdd-stack",
  // },
  {
    title: "Medicine Repo",
    href: "/cards",
    icon: "bi bi-card-text",
  },
  // {
  //   title: "Grid",
  //   href: "/grid",
  //   icon: "bi bi-columns",
  // },
  {
    title: "Categories",
    href: "/categories",
    icon: "bi bi-layout-split",
  },
  {
    title: "Medicine",
    href: "/medicines",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Register",
    href: "/register", // Add the registration link
    icon: "bi bi-person-plus",
  },
  {
    title: "Users",
    href: "/users",
    icon: "bi bi-people",
  },
  {
    title: "Logout",
    href: "/Home",
    icon: "bi bi-link",
  },


];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        {/* <Logo /> */}
        <h2> P h a r m a c y</h2>
        <span className="ms-auto d-lg-none">
        <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={() => showMobilemenu()}
        ></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
