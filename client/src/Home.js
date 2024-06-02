import React, { useState } from 'react';
import { Row, Col, Card, CardTitle, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'


const Home = ({ loggedIn, email }) => {
  const navigate = useNavigate();

  const onButtonClick = () => {
    if (loggedIn) {
      // If logged in, log out logic can be added here
    } else {
      // If not logged in, navigate to the login page
      navigate('/login');
    }
  };

  return (
    <div className="mainContainer">
      <div className={'titleContainer'}>
        <div>Welcome!</div>
      </div>
      <div>This is the home page.</div>
      <div className={'buttonContainer'}>
        <input
          className={'inputButton'}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />
        {loggedIn ? <div>Your email address is {email}</div> : <div />}
      </div>
    </div>
  );
};

export default Home;
