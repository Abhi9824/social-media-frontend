import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { CiLogin, CiLogout } from "react-icons/ci";
import { logoutUser } from "../../features/userSlice";
import { TiSocialGithubCircular } from "react-icons/ti";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div className="nav">
      <div className="navbarContainer container">
        <header className="nav-header">
          <NavLink className="text-decoration-none brand-name" to="/">
            ShareX
            <TiSocialGithubCircular />
          </NavLink>
        </header>
        <ul className="nav-body">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  <CiLogout className="nav-icon" />
                </button>
              </li>
            </>
          ) : (
            <>
              {" "}
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  <CiLogin className="nav-icon" />
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
