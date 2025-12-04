import React, { useState } from "react";
import { Search, Bell, ChevronLeft, ChevronRight, User } from "lucide-react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuUser } from "react-icons/lu";

const Header = ({ onSidebarToggle, isSidebarCollapsed }) => {
  const [showUserModal, setShowUserModal] = useState(false);

  const notifications = [
    { id: 1, text: "New message received", time: "5 min ago" },
    { id: 2, text: "System update completed", time: "1 hour ago" },
  ];

  return (
    <div className="border-b-2 h-[60px] border-gray-200  px-6 flex items-center justify-between">
      {/* Left Section: Sidebar Toggle */}
      <div className="flex items-center gap-x-5">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className=" rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {isSidebarCollapsed ? (
              <TbLayoutSidebarRightCollapse
                size={24}
                className="text-gray-600"
              />
            ) : (
              <TbLayoutSidebarLeftCollapse
                size={24}
                className="text-gray-600"
              />
            )}
          </button>
        </div>

        {/* Center Section: Search Box */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-700" />
            </div>
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-[300px] pl-10 pr-4 py-1.5 border border-gray-200 bg-[#ffffff]  rounded-full focus:outline-none focus:ring-1  focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Right Section: Notifications & User Profile */}
      <div className="flex items-center space-x-6">
        {/* Notifications with Dropdown */}
        <div className="relative">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 hidden hover:block group-hover:block">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 hover:bg-gray-50 rounded"
                  >
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </div>

        {/* User Profile with Modal Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowUserModal(!showUserModal)}
            className="flex items-center space-x-3 bg-[#ffffff] p-1 rounded-full transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8  rounded-full flex items-center border justify-center text-gray-700 font-semibold">
              <LuUser size={24}  />
            </div>
            <div className="hidden md:block text-left">
              <p className="font-medium text-gray-800">John Smith</p>
            </div>
            <div>
              {showUserModal ? (
                <IoMdArrowDropup size={20} className="text-gray-600" />
              ) : (
                <IoMdArrowDropdown size={20} className="text-gray-600" />
              )}
            </div>
          </button>

          {/* User Modal Dropdown */}
          {showUserModal && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    <LuUser size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">John Smith</p>
                    <p className="text-sm text-gray-500">john@example.com</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <a
                    href="#"
                    className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <User size={16} className="inline mr-2" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Help & Support
                  </a>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button className="w-full text-left py-2 px-2 text-red-600 hover:bg-gray-100 rounded">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
