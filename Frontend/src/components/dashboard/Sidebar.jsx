import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import {
  MdDashboardCustomize,
  MdWork,
  MdMessage,
  MdLogout,
} from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [isOpen, setIsOpen] = useState(true);

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
        dispatch(logoutUser());
        navigate("/login");
      }
    });
  };

  const allMenuItems = [
    {
      name: "Dashboard",
      value: "dashboard",
      icon: <MdDashboardCustomize className="text-green-500" />,
      adminOnly: false,
    },
    {
      name: "Projects",
      value: "projects",
      icon: <MdWork className="text-blue-500" />,
      adminOnly: false,
    },
    {
      name: "Message",
      value: "message",
      icon: <MdMessage className="text-pink-500" />,
      adminOnly: false,
    },
    {
      name: "Logout",
      value: "logout",
      icon: <MdLogout className="text-rose-500" />,
      adminOnly: false,
    },
  ];

  const accessibleComponents = allMenuItems.filter((item) => {
    if (item.adminOnly && currentUser?.role !== "admin") return false;
    return true;
  });

  return (
    <>
      <div
        className={`fixed lg:static top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out
          dark:bg-gray-900 dark:text-gray-200 bg-white shadow-md
          ${isOpen ? "w-64" : "w-0 lg:w-20"} 
          overflow-hidden`}
      >
        <header className="flex items-center justify-between lg:justify-start gap-3 p-5">
          <div className="flex items-center justify-center p-2 bg-gray-300 h-10 w-10 rounded-full">
            <MdDashboardCustomize className="text-green-600 text-xl" />
          </div>

          <span
            className={`text-lg font-semibold text-blue-600 whitespace-nowrap 
            ${isOpen ? "inline" : "hidden lg:inline"}`}
          >
            TET Dashboard
          </span>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-red-500"
          >
            <FaTimes size={18} />
          </button>
        </header>

        <ul className="mx-2 space-y-1">
          {accessibleComponents.map((component, index) => (
            <li key={index} className="relative group cursor-pointer">
              <button
                onClick={() => {
                  if (component.value === "logout") handleLogout();
                  else setActiveComponent(component.value);

                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`flex items-center gap-x-3 w-full px-4 py-3 rounded-md transition-all duration-300
                  ${
                    activeComponent === component.value
                      ? "bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-blue-400 border-l-4 border-blue-600"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-gray-200"
                  }`}
              >
                <span className="text-xl">{component.icon}</span>

                <span
                  className={`text-base font-medium whitespace-nowrap 
                    ${isOpen ? "inline" : "hidden lg:inline"}`}
                >
                  {component.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

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
