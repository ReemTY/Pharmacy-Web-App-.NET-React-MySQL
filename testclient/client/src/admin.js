import React from "react";

const Admin = ({ CurrentUser }) => {
    return (
        CurrentUser === "admin" ?
        <div>admin</div>
        : <div>Not Authorized</div>
    );
}

export default Admin;
