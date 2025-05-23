import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "./config/Layout";
import RequireAuth from "./config/RequireAuth";
import PersistLogin from "./config/PersistLogin";

import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import Unauthorized from "./pages/unauthorized";

import DashboardPage from "./pages/dashboard";
import ProfilePage from "./pages/profile";

import UsersPage from "./pages/users";

import './app.scss';
import LocationPage from "./pages/location";
import ReservationsPage from "./pages/reservations/indes";
import ListReservationsPage from "./pages/list-reservations";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        <Route path="*" element={<Layout />} >
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRole={"BASIC"} />}>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reservations" element={<ReservationsPage />} />
            </Route>

            <Route element={<RequireAuth allowedRole={"ADMIN"} />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="location" element={<LocationPage />} />
              <Route path="list-reservations" element={<ListReservationsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;