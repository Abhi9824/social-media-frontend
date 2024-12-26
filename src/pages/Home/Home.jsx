import React from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Middlebar from "../../components/Middlebar/Middlebar";
import Aside from "../../components/Aside/Aside";

const Home = () => {
  return (
    <div className="row py-4">
      {/* left */}
      <div className="col-md-3">
        <Sidebar />
      </div>

      {/* middle */}
      <div className="col-md-6">
        <Middlebar />
      </div>

      {/* right */}
      <div className="col-md-3 ">
        <Aside />
      </div>
    </div>
  );
};

export default Home;
