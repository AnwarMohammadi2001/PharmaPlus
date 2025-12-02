import React, { useEffect, useState } from "react";
import {
  MdDashboardCustomize,
  MdWork,
  MdAddCard,
  MdLogout,
} from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { LuUser } from "react-icons/lu";
import { FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const token = localStorage.getItem("token");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
        } else {
          console.error("Failed to fetch user", await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
    console.log(currentUser);
  }, [token]);

  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token"); // remove token
        navigate("/login"); // redirect to login
      }
    });
  };

  const menuItems = [
    { name: "Dashboard", value: "dashboard", icon: <MdDashboardCustomize /> },
    { name: "News", value: "news", icon: <MdWork /> },
    { name: "New News", value: "newnews", icon: <MdAddCard /> },
    { name: "Authors", value: "author", icon: <FiUsers /> },
    { name: "Setting", value: "setting", icon: <CiSettings /> },
    { name: "Profile", value: "profile", icon: <LuUser /> },
    { name: "Logout", value: "logout", icon: <MdLogout /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sticky right-0 left-0 top-0 z-30 transition-all duration-300 flex justify-between items-center bg-white shadow-md ${
          isOpen ? "h-20" : ""
        } overflow-hidden`}
      >
        {/* Header */}
        <header className="flex items-center justify-between lg:justify-start gap-3 p-5">
          <div className="flex items-center justify-center p-2 bg-gray-300 h-10 w-10 rounded-full">
            <MdDashboardCustomize className="text-green-600 text-xl" />
          </div>
          <span
            className={`text-lg font-semibold text-blue-600 whitespace-nowrap ${
              isOpen ? "inline" : "hidden lg:inline"
            }`}
          >
            News Blog
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-red-500"
          >
            <FaTimes size={18} />
          </button>
        </header>

        {/* Menu Links */}
        <ul className="mx-2 flex space-x-1">
          {menuItems.map((item, index) => (
            <li key={index} className="cursor-pointer">
              <button
                onClick={() => {
                  if (item.value === "logout") handleLogout();
                  else setActiveComponent(item.value);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`flex items-center gap-x-3 w-full px-4 py-3 rounded-md transition-all duration-300 ${
                  activeComponent === item.value
                    ? "bg-gray-200 text-blue-600"
                    : "hover:bg-gray-200 text-black"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`${isOpen ? "inline" : "hidden lg:inline"}`}>
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* User info */}
        <div className="flex items-center gap-3 p-3">
          <img
            src={
              currentUser?.image
                ? `${BASE_URL}/uploads/${currentUser.image}`
                : "/default-avatar.png"
            }
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-blue-600">
            {currentUser?.name || "Guest"}
          </span>
        </div>
      </div>

      {/* Toggle button for mobile */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg block lg:hidden"
        >
          <FaBars size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
