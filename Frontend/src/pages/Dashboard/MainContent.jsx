import Category from "./pages/Category";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Profile from "./pages/Profile";


const MainContent = ({ activeComponent }) => {
  switch (activeComponent) {
    case "dashboard":
      return <Dashboard />;
    case "medicines":
      return <Medicines />;
    case "profile":
      return <Profile />;
    case "newnews":
      return <Profile />;
    case "setting":
      return <Profile />;
    case "categories":
      return <Category />;
    case "logout":
      return <Profile />;
    default:
      return <Profile />;
  }
};

export default MainContent;
