import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaBookmark, FaUser } from "react-icons/fa";
import { MdRocketLaunch, MdAddBox } from "react-icons/md";
import { NavLink } from "react-router";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { addToPostAsync } from "../../features/postSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showModal, setModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState([]);
  // State for media file preview
  const [preview, setPreview] = useState(null);

  // Updated changeMediaHandler function
  const mediaHandler = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
    if (files.length > 0) {
      const previewUrl = URL.createObjectURL(files[0]);
      setPreview(previewUrl);
    }
  };
  const toggleForm = () => {
    setModal(!showModal);
    setPreview("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addToPostAsync({
        caption,
        media,
      })
    );

    setModal(false);
  };

  const getActiveStyle = ({ isActive }) => ({
    textDecoration: isActive ? "underline" : "",
  });
  return (
    <>
      <ul className="d-flex flex-column gap-2 side-items">
        <li className="d-flex justify content-center align-items-center">
          <NavLink to="/" className="link">
            <FaHome className="sidebar-icon" />
            <span>Home</span>
          </NavLink>
        </li>
        <li className="d-flex justify content-center align-items-center">
          <NavLink to="/explore" className="link">
            <MdRocketLaunch className="sidebar-icon" />
            <span>Explore</span>
          </NavLink>
        </li>
        <li className="d-flex justify content-center align-items-center">
          <NavLink to="/bookmark" className="link" style={getActiveStyle}>
            <FaBookmark className="sidebar-icon" />
            <span>Bookmark</span>
          </NavLink>
        </li>
        <li className="d-flex justify content-center align-items-center">
          <NavLink to={`/profile/${user.username}`} className="link">
            <FaUser className="sidebar-icon" />
            <span>Profile</span>
          </NavLink>
        </li>
        <li className="d-flex justify content-center align-items-center py-4">
          <button className="postBtn" onClick={toggleForm}>
            <MdAddBox className="btn__icon" />
            <span>Create post</span>
          </button>
        </li>
      </ul>
      {showModal && (
        <>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Launch demo modal
          </button>

          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Modal title
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">...</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="model-header">
              <h2>Create a Post</h2>
              <span className="close-btn" onClick={() => setModal(false)}>
                &times;
              </span>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Caption</label>
                  <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                <div>
                  <label>Media</label>
                  <input type="file" id="media" onChange={mediaHandler} />
                </div>
                <button type="submit" className="uploadBtn">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )} */}

      {/* {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upload File</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="caption">Caption:</label>
              <input
                type="text"
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter caption"
              />
              <label htmlFor="media-upload">Upload Media:</label>
              <input
                type="file"
                id="media-upload"
                onChange={changeMediaHandler}
              />
              {preview && (
                <img src={preview} alt="Preview" className="preview-image" />
              )}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="cancel-btn"
                >
                  Close
                </button>
                <button type="submit" className="submit-btn">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Sidebar;
