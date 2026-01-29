import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function IsEmployer({ children }) {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  let user;
  try {
    user = jwtDecode(token);
  } catch (err) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "employer") return <Navigate to="/" replace />;

  return children;
}
