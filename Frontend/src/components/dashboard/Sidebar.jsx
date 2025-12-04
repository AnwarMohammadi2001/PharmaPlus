import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import {
  MdDashboardCustomize,
  MdWork,
  MdMessage,
} from "react-icons/md";
import {
  MdCategory,
  MdSettings,
  MdLogout,
  MdHealthAndSafety,
  MdShoppingCartCheckout,
  MdPeople,
  MdLocalPharmacy,
  MdReport,
} from "react-icons/md";

import {
  FaCapsules,
  FaTruckLoading,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { GiMedicines, GiSandsOfTime } from "react-icons/gi";

import { FaHospital } from "react-icons/fa";
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
      icon: <MdDashboardCustomize />,
      adminOnly: false,
    },
    {
      name: "Medicines",
      value: "medicines",
      icon: <GiMedicines />,
      adminOnly: false,
    },
    {
      name: "Categories",
      value: "categories",
      icon: <MdCategory />,
      adminOnly: false,
    },
    {
      name: "Purchase",
      value: "purchase",
      icon: <FaTruckLoading />,
      adminOnly: false,
    },
    {
      name: "Sales (POS Page)",
      value: "sales",
      icon: <FaFileInvoiceDollar />,
      adminOnly: false,
    },
    {
      name: "Customers",
      value: "customers",
      icon: <MdPeople />,
      adminOnly: false,
    },
    {
      name: "Suppliers",
      value: "suppliers",
      icon: <MdLocalPharmacy />,
      adminOnly: false,
    },
    {
      name: "Expiry Alerts",
      value: "expiry",
      icon: <GiSandsOfTime />,
      adminOnly: false,
    },
    {
      name: "Reports",
      value: "reports",
      icon: <MdReport />,
      adminOnly: false,
    },
    {
      name: "Settings",
      value: "settings",
      icon: <MdSettings />,
      adminOnly: false,
    },
    {
      name: "Logout",
      value: "logout",
      icon: <MdLogout />,
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
          dark:bg-gray-900 dark:text-gray-200 bg-[#ffffff] 
          ${isOpen ? "w-64" : "w-0 lg:w-20"} 
          overflow-hidden`}
      >
        <header className="flex items-center justify-between lg:justify-start gap-3 p-5">
          <div className="flex items-center justify-center p-2 bg-primary h-9 w-9 rounded-md">
            <FaHospital className=" text-secondary h-9 w-9" />
          </div>

          <span
            className={`text-lg font-semibold text-[#000000] whitespace-nowrap 
            ${isOpen ? "inline" : "hidden lg:inline"}`}
          >
            Pharma Plus
          </span>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-red-500"
          >
            <FaTimes size={18} />
          </button>
        </header>

        <ul className="mx-2 mt-7 space-y-1">
          {accessibleComponents.map((component, index) => (
            <li key={index} className="relative group cursor-pointer">
              <button
                onClick={() => {
                  if (component.value === "logout") handleLogout();
                  else setActiveComponent(component.value);

                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`flex items-center gap-x-3 w-full px-5 py-2.5 cursor-pointer  rounded-full transition-all duration-300
                  ${
                    activeComponent === component.value
                      ? "bg-[#3ca181] text-[#f4f6fc]"
                      : "hover:bg-primary  hover:text-secondary text-gray-800"
                  }`}
              >
                <span
                  className={`text-xl  hover:text-secondary ${
                    activeComponent === component.value ? "text-secondary" : ""
                  } `}
                >
                  {component.icon}
                </span>

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
