import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import MainContent from "../pages/Dashboard/MainContent";

const DashboardLayout = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <MainContent activeComponent={activeComponent} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
