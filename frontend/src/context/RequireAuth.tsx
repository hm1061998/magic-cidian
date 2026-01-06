import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SplashScreen from "@/components/common/SplashScreen";

const RequireAuth = ({ needAdmin }: { needAdmin?: boolean }) => {
  const { user, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated || (needAdmin && !user?.isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
