import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserNameModal } from "./components/UserNameModal";
import TodayTaskBar from "./components/todayTaskBar-component/TodayTaskBar";
import UpcomingBar from "./components/upcoming-Component/UpcomingBar";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import OverTodayTaskBar from "./components/OverdueTaskBar";
import PastCompletedTasks from "./components/todayTaskBar-component/PastCompletedTasks";
function App() {
  const [mainbarMenu, setMainbarMenu] = useState(true);

  const toggleMenu = () => {
    setMainbarMenu(!mainbarMenu);
  };

  const handleToggleMenu = () => {
    setMainbarMenu(true);
  };

  return (
    <Router>
      <div className="todo_app">
        <Sidebar mainbarMenu={mainbarMenu} onToggleMenu={toggleMenu} />
        <div className="mainbar">
          {!mainbarMenu && (
            <button
              onClick={handleToggleMenu}
              className={`button menuIcon mainbarMenu-btn ${
                !mainbarMenu ? "closed" : "open"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}
          <UserNameModal />
          <Routes>
            <Route path="/" element={<Navigate to={"TodayTaskBar"} />} />
            <Route
              path="/PastCompletedTasks"
              element={<PastCompletedTasks />}
            />
            <Route path="/TodayTaskBar" element={<TodayTaskBar />} />
            <Route path="/UpcomingBar" element={<UpcomingBar />} />
            <Route path="/OverTodayTaskBar" element={<OverTodayTaskBar />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
