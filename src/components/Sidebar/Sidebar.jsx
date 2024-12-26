import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaBookmark, FaUser } from "react-icons/fa";
import { MdRocketLaunch, MdAddBox } from "react-icons/md";
import { NavLink, useNavigate } from "react-router";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { addToPostAsync, fetchAllPostAsync } from "../../features/postSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [showModal, setModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState([]);
  // State for media file preview
  const [preview, setPreview] = useState([]);

  // Updated changeMediaHandler function
  const mediaHandler = (e) => {
    const newFiles = Array.from(e.target.files);
    setMedia((prevMedia) => {
      const updatedMedia = [...prevMedia, ...newFiles];
      return updatedMedia;
    });

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreview((previewUrls) => [...previewUrls, ...newPreviews]);
  };
  const toggleForm = () => {
    setModal(!showModal);
    setCaption("");
    setMedia([]);
    setPreview([]);
  };

  const postHandleSubmit = (e) => {
    e.preventDefault();
    console.log("media", media);
    dispatch(
      addToPostAsync({
        caption,
        media,
      })
    ).then(() => {
      dispatch(fetchAllPostAsync());
    });

    toggleForm();
  };

  const getActiveStyle = ({ isActive }) => ({
    textDecoration: isActive ? "underline" : "",
  });

  return (
    <>
      <div className="main">
        <ul className="d-flex flex-column gap-3 side-items py-2 px-2">
          <li className="d-flex justify content-center align-items-center">
            <NavLink to="/" className="link" style={getActiveStyle}>
              <FaHome className="sidebar-icon" />
              <span>Home</span>
            </NavLink>
          </li>
          <li className="d-flex justify content-center align-items-center">
            <NavLink to="/explore" className="link" style={getActiveStyle}>
              <MdRocketLaunch className="sidebar-icon" />
              <span>Explore</span>
            </NavLink>
          </li>
          <li className="d-flex justify content-center align-items-center ">
            <NavLink to="/bookmark" className="link" style={getActiveStyle}>
              <FaBookmark className="sidebar-icon" />
              <span>Bookmark</span>
            </NavLink>
          </li>
          <li className="d-flex justify content-center align-items-center">
            <NavLink
              to={`/profile/${user.username}`}
              className="link"
              style={getActiveStyle}
            >
              <FaUser className="sidebar-icon" />
              <span>Profile</span>
            </NavLink>
          </li>
          <li className="d-flex justify-content-center align-items-center py-2">
            <button className="postBtn mx-1" onClick={toggleForm}>
              <MdAddBox className="btn__icon" />
              <span>Create post</span>
            </button>
          </li>
        </ul>
        <div className="d-flex justify-content-between align-items-center py-1 gap-4 mx-2 mb-4">
          <div>
            <img
              src={user?.image ? user?.image.url : "/images/profile.jpg"}
              alt={user?.username}
              className="img-fluid profile"
            />
          </div>
          <div
            className="d-flex flex-column sidebarFooter"
            onClick={() => navigate(`/profile/${user?.username}`)}
            style={{ cursor: "pointer" }}
          >
            <span>{user?.name}</span>
            <span className="fw-light">{user?.username}</span>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={postHandleSubmit}>
                  <div className="py-1">
                    <label htmlFor="caption">Caption:</label>
                    <br />
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      name="caption"
                      className="form-control"
                    />
                  </div>
                  <div className="py-1">
                    <label htmlFor="media">Media:</label>
                    <input
                      type="file"
                      onChange={mediaHandler}
                      multiple
                      accept="image/*,video/*"
                      className="form-control"
                    />
                  </div>
                  <div className="py-2">
                    {/* Show previews */}
                    {preview.length > 0 &&
                      preview.map((url, index) => (
                        <img
                          src={url}
                          key={index}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                      ))}
                  </div>

                  <button
                    type="submit"
                    className="postSubmit mt-2 form-control"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </>
  );
};

export default Sidebar;
