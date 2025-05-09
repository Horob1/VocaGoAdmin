import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import ROUTES from "../../utils/routes";

interface AuthGuardProps {
  children: React.ReactNode;
  mode: "AUTH" | "UNAUTH"; // "AUTH" => yêu cầu đăng nhập, "UNAUTH" => không cho đã đăng nhập vào
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, mode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated && mode === "AUTH") {
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  if (isAuthenticated && mode === "UNAUTH") {
    return <Navigate to={ROUTES.HOME} />; // hoặc bất kỳ trang nào bạn muốn
  }

  return <>{children}</>;
};

export default AuthGuard;
