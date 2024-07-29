import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faSun, faUser, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { useUserName } from '../hooks/useUserName';

export default function Profile() {
  const { userName, loading, error: userNameError } = useUserName();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Profile component - userNameError:", userNameError);
  console.log("Profile component - userName:", userName);

  if (loading) {
    return <div>Loading...</div>;
  }

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <div className="WelcomeMessage">
        <FontAwesomeIcon icon={faHandHoldingHeart} />
        <p>{userNameError ? `Error: ${userNameError}` : `User, ${userName}`}</p>
        <FontAwesomeIcon
          className="logoutIcon"
          onClick={handleLogout}
          icon={faSignOut}
        />
        {error && (
          <div className="sideAlert error">
            <span className="closebtn" onClick={() => setError("")}>&times;</span>
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
}
