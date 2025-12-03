import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/authSlice";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    // redirect to login if needed
    window.location.href = "/login";
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutBtn;
