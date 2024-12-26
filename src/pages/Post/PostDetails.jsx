import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  removeCommentAsync,
  addCommentAsync,
  likePostAsync,
  unlikePost,
  deletePostAsync,
  updatePost,
} from "../../features/postSlice";
import "./PostDetails.css";

import { formatDate } from "../../utils/formatDate";
import Sidebar from "../../components/Sidebar/Sidebar";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, postStatus } = useSelector((state) => state.post);
  const { bookmarks, bookmarkStatus } = useSelector((state) => state.bookmark);
  const { user } = useSelector((state) => state.user);
  const post = posts?.find((post) => post?._id === id);
  const [editPost, setEditPost] = useState(false);
  const [editCaption, setEditCaption] = useState(post?.caption || "");
  const [editMedia, setEditMedia] = useState(post?.media || []);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

  const toggleForm = () => {
    setEditPost(!editPost);
  };
  const editMediaHandler = (e) => {
    const newFiles = Array.from(e.target.files);
    setEditMedia((prevMedia) => {
      const updatedMedia = [...prevMedia, ...newFiles];
      return updatedMedia;
    });
  };

  const postEditHandler = (e) => {
    e.preventDefault();
    const updatedPost = {
      caption: editCaption,
      media: editMedia,
    };
    dispatch(updatePost({ postId: post._id, dataToUpdate: updatedPost }));
    toggleForm();
    setEditCaption("");
    setEditMedia([]);
  };

  const handleDelete = (postId) => {
    dispatch(deletePostAsync(postId));
    navigate("/");
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

  const handleDeleteComment = (postId, commentId) => {
    dispatch(removeCommentAsync({ postId, commentId }));
  };

  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    await dispatch(addCommentAsync({ postId: post._id, comment: commentText }));
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
    <div className="container py-2 d-flex row py-2">
      <div className="col-md-3">
        <Sidebar />
      </div>
      <div className="col-md-6 mb-2 middlebar">
        <div className="post_container container">
          <div className="post_header">
            <div className="post_header-content">
              <img
                src={
                  post?.author?.image?.url
                    ? post.author.image.url
                    : "/images/profile.jpg"
                }
                alt={post?.author?.username || "Author"}
              />
              <Link
                to={`/profile/${post?.author?.username}`}
                className="text-decoration-none username"
              >
                <p>{post?.author?.username}</p>
              </Link>
              <small>{formatDate(post?.createdAt)}</small>
            </div>
            <div>
              {user?.username === post?.author?.username ? (
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
                : null}
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
          <div className="d-flex flex-column">
            <p>{post.likes.length} likes</p>
          </div>
        </div>

        <div className="py-2">
          <p>Comments:</p>
          <ul className="comment_list">
            {post?.comments?.map(({ _id, comment, commentedBy }) => (
              <>
                <hr />
                <li className="comment_list_item" key={_id}>
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex  gap-2">
                        <img
                          src={
                            commentedBy.image
                              ? commentedBy.image.url
                              : "/images/profile.jpg"
                          }
                          alt={commentedBy.username}
                          className="img-fluid commentedByImage "
                        />
                        <p>
                          <Link
                            className="commentedUsername"
                            to={`/profile/${commentedBy.username}`}
                          >
                            {commentedBy.username}
                          </Link>
                        </p>
                      </div>
                      <div>
                        {user.username === commentedBy.username ? (
                          <button
                            className="comment_delete_btn"
                            onClick={() => handleDeleteComment(post._id, _id)}
                          >
                            <MdDelete className="deleteBtn" />
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <p>{comment}</p>
                  </div>
                </li>
              </>
            ))}
          </ul>

          <hr />
        </div>
      </div>
      {/* edit post modal */}
      {editPost && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={postEditHandler}>
                  <div className="py-1">
                    <label htmlFor="caption">Edit Caption:</label>
                    <br />
                    <input
                      type="text"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      name="editCaption"
                      className="form-control"
                      placeholder={editCaption}
                    />
                  </div>
                  <div className="py-1">
                    <label htmlFor="media">Edit Media:</label>
                    <input
                      type="file"
                      onChange={editMediaHandler}
                      multiple
                      accept="image/*,video/*"
                      className="form-control"
                    />
                  </div>
                  <button
                    type="submit"
                    className="postSubmit mt-2 form-control"
                  >
                    Edit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* comment modal */}
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
                  <button type="submit" className="submitBtn mt-2 form-control">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
