import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  addToBookmark,
  fetchBookmark,
  removeFromBookmark,
} from "../../features/bookmarkSlice";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegHeart,
} from "react-icons/fa";
import {
  fetchAllPostAsync,
  addToPostAsync,
  removeCommentAsync,
  addCommentAsync,
  updatePost,
  likePostAsync,
  unlikePost,
  deletePostAsync,
} from "../../features/postSlice";
import "./Post.css";

import { formatDate } from "../../utils/formatDate";

const Post = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, postStatus } = useSelector((state) => state.post);
  const { bookmarks, bookmarkStatus } = useSelector((state) => state.bookmark);
  const { user } = useSelector((state) => state.user);
  const post = posts?.find((post) => post._id === postId);
  console.log("user details", user);
  console.log("All bookmarks", bookmarks);
  console.log("postId", postId);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const toggleForm = () => {};

  const handleDelete = async (postId) => {
    await dispatch(
      deletePostAsync(postId).then(() => {
        navigate("/");
      })
    );
  };

  const addBookmarkHandler = (postId) => {
    dispatch(addToBookmark(postId));
    console.log("added from Bookmark");
  };

  const removeBookmarkHandler = (postId) => {
    dispatch(removeFromBookmark(postId));
    console.log("remove from Bookmark");
  };
  const handleUnLike = (postId) => {
    dispatch(unlikePost(postId));
  };
  const handleLike = (postId) => {
    dispatch(likePostAsync(postId));
  };

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(addCommentAsync({ postId: post._id, comment: commentText }));
    toggleCommentBox();
    setCommentText("");
  };

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchAllPostAsync());
    }
  }, [postStatus, dispatch]);

  useEffect(() => {
    if (bookmarkStatus === "idle") {
      dispatch(fetchBookmark());
    }
  }, [bookmarkStatus, dispatch]);

  return (
    <div className="post_container container">
      <div className="post_header">
        <div className="post_header-content">
          <img
            src={
              post?.author?.image?.url
                ? post.author.image.url
                : "/images/demo.png"
            }
            alt={post?.author?.username || "Author"}
          />
          <Link
            to={`/profile/${user._id}`}
            className="text-decoration-none username"
          >
            <p>{post?.author?.username}</p>
          </Link>
          <small>{formatDate(post?.createdAt)}</small>
        </div>
        <div>
          {user.username === post.author.username ? (
            <div className="post__header-btns mx-2">
              <button onClick={toggleForm}>
                <MdEdit />
              </button>
              <button onClick={() => handleDelete(post._id)}>
                <MdDelete />
              </button>
            </div>
          ) : (
            " "
          )}
        </div>
      </div>
      <div className="post-main-content">
        <p>{post.caption}</p>
        <div className="post-media">
          {post?.media?.length > 0
            ? post.media.map((mediaItem, index) => (
                <img
                  src={mediaItem.url}
                  key={mediaItem._id || index}
                  alt={`Post media ${index + 1}`}
                  className="post-media-image img-fluid mb-2"
                />
              ))
            : ""}
        </div>
      </div>
      <div className="d-flex justify-content-between gap-1 pb-2">
        <div className="post-content-buttons">
          {post.likes.find(({ username }) => username === user.username) ? (
            <button onClick={() => handleUnLike(post._id)}>
              <FaHeart className="fill_red" />
            </button>
          ) : (
            <button onClick={() => handleLike(post._id)}>
              <FaRegHeart />
            </button>
          )}

          <button onClick={toggleCommentBox} className="mx-4">
            <FaRegCommentAlt />
          </button>
        </div>
        <div className="post-content-button-bookmark">
          {bookmarks?.find(({ _id }) => _id === post._id) ? (
            <button onClick={() => removeBookmarkHandler(post._id)}>
              <FaBookmark className="fill_accent_color" />
            </button>
          ) : (
            <button
              onClick={() => addBookmarkHandler(post._id)}
              className="bookmark_btn"
            >
              <FaRegBookmark />
            </button>
          )}
        </div>
      </div>
      {/* likes and comments  */}
      <div className="d-flex flex-column">
        <div>{post.likes.length} likes</div>
        <div>
          {post.comments.length > 0 ? (
            <Link to={`/posts/${post._id}`}>
              View all {post.comments.length > 1 ? post.comments.length : ""}{" "}
              Comments
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      {showCommentBox && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add a Comment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleCommentBox}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={commentSubmitHandler}>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment..."
                  ></textarea>
                  <button type="submit" className="btn btn-primary mt-2">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default Post;
