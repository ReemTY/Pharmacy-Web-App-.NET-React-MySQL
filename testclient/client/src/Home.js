import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <h1>Welcome to the Home Page</h1>
            <p>This is the home page content.</p>
            <Link to="/admin" className="btn btn-primary mr-2">Go to Admin Page</Link>
            <Link to="/user" className="btn btn-primary">Go to User Page</Link>
        </div>
    );
}

export default Home;
