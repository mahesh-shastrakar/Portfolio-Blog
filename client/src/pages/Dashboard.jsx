// Importing necessary modules from libraries and hooks
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Importing DashSidebar, DashProfile, DashPosts, DashUsers, DashComments, and DashboardComp components
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

// Dashboard Component to display the dashboard page
const Dashboard = () => {
  // State variables to store currentUser and tab
  const { currentUser } = useSelector((state) => state.user);

  // useLocation hook to get the current location of the page
  const location = useLocation();

  // useState hook to store the tab value
  const [tab, setTab] = useState("");

  // useEffect hook to get the tab value from the URL and set the tab value to the tabFromUrl
  useEffect(() => {
    // Get the tab value from the URL
    const urlParams = new URLSearchParams(location.search);

    // Set the tab value to the tabFromUrl
    const tabFromUrl = urlParams.get("tab");

    // If tabFromUrl is not null then set the tab value to the tabFromUrl
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Return the JSX for the Dashboard component
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/*sidebar*/}
      <div>
        <DashSidebar />
      </div>

      {/*profile*/}
      {tab === "profile" && <DashProfile />}

      {/*posts*/}
      {currentUser.isAdmin && tab === "posts" && <DashPosts />}

      {/*users*/}
      {currentUser.isAdmin && tab === "users" && <DashUsers />}

      {/*comments*/}
      {currentUser.isAdmin && tab === "comments" && <DashComments />}

      {/* // If the user is an admin and the tab value is dashboard then display the DashboardComp component */}
      {/*dashboard*/}
      {currentUser.isAdmin && tab === "dashboard" && <DashboardComp />}
    </div>
  );
};

export default Dashboard;
