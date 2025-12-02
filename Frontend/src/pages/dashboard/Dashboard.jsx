import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* FIXED SIDEBAR AT TOP */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Sidebar
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
      </div>

      {/* MAIN CONTENT UNDER SIDEBAR */}
      <main className="pt-20  dark:bg-gray-700 min-h-screen">
        <MainContent activeComponent={activeComponent} />
      </main>
    </div>
  );
};

export default Dashboard;
