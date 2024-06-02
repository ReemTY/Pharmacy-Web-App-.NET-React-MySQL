import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import user1 from "../assets/images/users/user1.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Optionally, you can redirect the user to the login page after logout
    // window.location.href = '/login';
  };

  return (
    <Navbar color="primary" dark expand="md">
      <div className="d-flex align-items-center">
        {/* Display the text "Pharmacy" */}
        <NavbarBrand>Pharmacy</NavbarBrand>
        <Button
          color="primary"
          className="d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          {/* <NavItem>
            <Link to="/AdminDashboard" className="nav-link">
              Dashboard
            </Link>
          </NavItem> */}
          {/* <NavItem>
            <Link to="/categories" className="nav-link">
              Categories
            </Link>
          </NavItem> */}
          {/* <NavItem>
            <Link to="/medicines" className="nav-link">
              Medicines
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/users" className="nav-link">
              Users
            </Link>
          </NavItem> */}
          {/* Add a link to the dashboard */}
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="primary">
            <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Account</DropdownItem>
            <DropdownItem>
              <Link to="../useraccount" className="nav-link">
                My Account
              </Link>
            </DropdownItem>
            <DropdownItem divider />
            {/* Add logout functionality */}
            <DropdownItem onClick={handleLogout}>
              <Link to="/login" className="nav-link">
                Logout
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>
      {/* Add the Dashboard component */}
    </Navbar>
  );
};

export default Header;
