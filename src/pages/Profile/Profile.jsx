import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profile.css";
import {
  changeAvatarAsync,
  editProfile,
  unfollowUserAsync,
  followUserAsync,
} from "../../features/userSlice";
import { NoPost } from "../../components/Empty/Empty";
import Post from "../../components/Post/Post";

const Profile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const { user, users } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);
  const foundUser = users?.find((u) => u?.username === username);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(foundUser?.name);
  const [userName, setUserName] = useState(foundUser?.username);
  const [bio, setBio] = useState(foundUser?.bio);
  const [avatar, setAvatar] = useState();
  const [avatarForm, setAvatarForm] = useState(false);

  const toggleAvatarForm = () => {
    setAvatarForm(!avatarForm);
  };

  const toggleForm = () => {
    setShowEditModal(!showEditModal);
  };

  const handlefollow = (id) => {
    dispatch(followUserAsync(id));
  };

  const handleUnfollow = (id) => {
    dispatch(unfollowUserAsync(id));
  };

  const editHandleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      username,
      bio,
    };
    dispatch(editProfile(updatedData));
  };

  const editAvatarSubmit = (e) => {
    e.preventDefault();
    dispatch(changeAvatarAsync(avatar));
    setAvatar("");
    setAvatarForm(false);
  };

  return (
    <>
      <div className="col-md-12 row py-2">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-6">
          {/* Profile Details Container */}
          <div className="profile-details d-flex flex-column align-items-center text-center gap-1">
            <div className="py-2 avatarContainer">
              <img
                src={
                  foundUser?.image ? foundUser.image.url : "/images/profile.jpg"
                }
                alt={foundUser.username}
                className="img-fluid profile-img"
              />
              {user?.username === foundUser?.username ? (
                <button onClick={toggleAvatarForm} className="editBtn">
                  <MdEdit />
                </button>
              ) : (
                ""
              )}
            </div>
            <h2 className="username">{foundUser.name}</h2>
            <p className="usernameLight">{foundUser.username}</p>
            {foundUser?.username === user?.username ? (
              <button onClick={toggleForm} className="primary_btn btn">
                Edit Profile
              </button>
            ) : (
              <>
                {user.following.some(
                  ({ username }) => username === foundUser.username
                ) ? (
                  <button
                    onClick={() => handleUnfollow(foundUser._id)}
                    className="primary_btn"
                  >
                    unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handlefollow(foundUser._id)}
                    className="primary_btn"
                  >
                    Follow
                  </button>
                )}
              </>
            )}
            <p className="py-1">
              {foundUser?.bio ? foundUser.bio : "Edited my bio"}
            </p>
            <div className="d-flex justify-content-between gap-4 user_stats">
              <p>
                <span className="fw-bold">
                  {foundUser?.following?.length || 0}
                </span>
                <br />
                <span className="fw-semibold">following</span>
              </p>
              <p>
                <span className="fw-bold">
                  {foundUser?.posts?.length || 0}{" "}
                </span>
                <br />
                <span className="fw-semibold">posts</span>
              </p>
              <p>
                <span className="fw-bold">
                  {foundUser?.follower?.length || 0}
                </span>
                <br />
                <span className="fw-semibold">followers</span>
              </p>
            </div>
          </div>

          {/* Posts Section */}
          <hr className="py-1" />
          {foundUser?.posts.length === 0 ? (
            <NoPost />
          ) : (
            <ul className="post-list">
              {posts?.map((post) =>
                post?.author?.username === foundUser?.username ? (
                  <li key={post._id} className="post-list-style">
                    <Post postId={post._id} />
                  </li>
                ) : (
                  ""
                )
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={editHandleSubmit}>
                  <div className="py-1">
                    <label htmlFor="name" className="py-1">
                      Name:
                    </label>
                    <br />
                    <input
                      type="text"
                      value={name}
                      placeholder={foundUser.name}
                      onChange={(e) => setName(e.target.value)}
                      name="name"
                      className="form-control"
                    />
                  </div>
                  <div className="py-1">
                    <label htmlFor="userName" className="py-1">
                      Username:
                    </label>
                    <br />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      name="userName"
                      placeholder={foundUser.userName}
                      className="form-control"
                    />
                  </div>
                  <div className="py-1">
                    <label htmlFor="bio" className="py-1">
                      Bio:
                    </label>
                    <br />
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      name="userName"
                      placeholder={foundUser.bio}
                      className="form-control"
                      maxLength="150"
                    />
                  </div>

                  <button
                    type="submit"
                    className="editSubmit mt-3 py-2 form-control"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {avatarForm && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Avatar</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleAvatarForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={editAvatarSubmit}>
                  <div className="py-2">
                    <label htmlFor="name" className="py-1">
                      Image:
                    </label>
                    <br />
                    <input
                      type="file"
                      onChange={(e) => setAvatar(e.target.files[0])}
                      name="avatar"
                      className="form-control"
                    />
                  </div>
                  <button
                    type="submit"
                    className="editSubmit mt-3 py-1 form-control"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
