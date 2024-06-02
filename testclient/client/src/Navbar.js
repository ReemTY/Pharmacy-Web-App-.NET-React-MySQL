import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ CurrentUser }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link to="/admin" className="nav-link">Admin</Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/user" className="nav-link">User</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                    </li>
                </ul>
                <span className="navbar-text">
                    Logged in as: {CurrentUser}
                </span>
            </div>
        </nav>
    );
}

export default Navbar;
