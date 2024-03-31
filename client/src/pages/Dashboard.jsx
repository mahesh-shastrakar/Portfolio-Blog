import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";
const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        {/*sidebar*/}
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
      {/*dashboard*/}
      {currentUser.isAdmin && tab === "dashboard" && <DashboardComp />}
    </div>
  );
};

export default Dashboard;
