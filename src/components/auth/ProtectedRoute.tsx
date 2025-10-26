import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // you can replace with a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
