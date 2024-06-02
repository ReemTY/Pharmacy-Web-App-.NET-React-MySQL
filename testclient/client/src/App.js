import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Admin from './admin';
import UserComponent from './user'; // Renamed the User component to UserComponent
import Navbar from './Navbar';

const User = {
  Registered: "Registered",
  Public: "Public",
  Admin: "Admin"
}

const CurrentUser = User.Public; // Renamed Current_user to CurrentUser

function App() {
  return (
    <BrowserRouter>
      <Navbar CurrentUser={CurrentUser} /> {/* Pass the CurrentUser prop */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin CurrentUser={CurrentUser} />} />
        <Route path="/user" element={<UserComponent CurrentUser={CurrentUser} />} /> {/* Use UserComponent instead of user */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
