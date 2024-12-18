import React from "react";
import "./Home.css";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar/Sidebar";
import Middlebar from "../../components/Middlebar/Middlebar";

const Home = () => {
  const { posts, postStatus } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  return (
    <div className="container">
      <div className="row py-4">
        {/* left */}
        <div className="col-md-3 sideBar">
          <Sidebar />
        </div>

        {/* middle */}
        <div className="col-md-6">
          <Middlebar />
        </div>

        {/* right */}
        <div className="col-md-3"></div>
      </div>
    </div>
  );
};

export default Home;
