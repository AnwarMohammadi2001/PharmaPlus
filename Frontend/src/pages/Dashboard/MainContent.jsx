import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";


const MainContent = ({ activeComponent }) => {
  switch (activeComponent) {
    case "dashboard":
      return <Dashboard />;
    case "news":
      return <Profile />;
    case "profile":
      return <Profile />;
    case "newnews":
      return <Profile />;
    case "setting":
      return <Profile />;
    case "author":
      return <Profile />;
    case "logout":
      return <Profile />;
    default:
      return <Profile />;
  }
};

export default MainContent;
