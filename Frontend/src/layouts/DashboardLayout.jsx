import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import MainContent from "../pages/Dashboard/MainContent";

const DashboardLayout = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  return (
    <div className="flex h-screen w-full overflow-hidden ">
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      <div className="flex flex-col flex-1 h-screen overflow-hidden bg-[#f1f2f5] ">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <MainContent activeComponent={activeComponent} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
