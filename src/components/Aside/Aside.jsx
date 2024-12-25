import React, { useEffect, useState } from "react";
import "./Aside.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchAllUsersAsync, followUserAsync } from "../../features/userSlice";

const Aside = () => {
  const dispatch = useDispatch();
  const { users, user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const excludedLoginUser = users?.filter(
    ({ username }) => username !== user.username
  );

  const excludedFollowing = excludedLoginUser?.filter(
    ({ followers }) =>
      !followers?.some((username) => username?.username === user.username)
  );

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };
  const searchedUser = excludedFollowing?.filter(({ username, name }) =>
    [username, name].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredUsers = searchedUser?.slice(
    0,
    showAll ? searchedUser.length : 4
  );
  const expandedFilterUsers = () => {
    setShowAll(!showAll);
  };

  const followHandler = (followerId) => {
    dispatch(followUserAsync(followerId));
  };
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllUsersAsync());
    }
  }, []);
  return (
    <div className="d-flex flex-column mt-1 asideContainer px-2">
      <h5 className="text-center suggestion">Suggestion</h5>
      <div className="py-3">
        <input
          type="search"
          placeholder="Search Posts, People"
          className="form-control rounded p-2"
          onChange={searchHandler}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center filterSuggestion py-2">
        <p className="fw-semibold mb-0">Who to Follow?</p>
        <button onClick={expandedFilterUsers} className="showMore fw-semibold">
          {showAll ? "Show Less" : "Show More"}
        </button>
      </div>
      <div className="py-2">
        <ul className="moreList">
          {filteredUsers?.map((users) => (
            <li
              className="d-flex justify-content-around align-items-center"
              key={users._id}
            >
              <img
                className="img-fluid imgProfile"
                src={users?.image ? users?.image?.url : "/images/profile.jpg"}
                alt={users?.username}
              />
              <p className="d-flex flex-column">
                <span className="fw-bold">{users?.name}</span>
                <span
                  onClick={() => navigate(`profile/${users.username}`)}
                  className="username"
                >
                  {users?.username}
                </span>
              </p>
              <div className="followBtnDiv">
                <button
                  className="followBtn fw-bold"
                  onClick={() => followHandler(users._id)}
                >
                  Follow +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Aside;
