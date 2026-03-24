import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "../pages/users-page";
import UserDetailPage from "../pages/user-detail-page";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
