import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="">
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
