import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserName } from '../hooks/useUserName';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const { userName, loading, error } = useUserName();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // if (!userName) {
  //   return <Navigate to="/UserName" />;
  // }

  return children;
}
