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
  addToPostAsync,
  removeCommentAsync,
  addCommentAsync,
  updatePost,
  likePostAsync,
  unlikePost,
  deletePostAsync,
} from "../../features/postSlice";
import "./PostDetails.css";

import { formatDate } from "../../utils/formatDate";
import Sidebar from "../../components/Sidebar/Sidebar";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, postStatus } = useSelector((state) => state.post);
  const { bookmarks, bookmarkStatus } = useSelector((state) => state.bookmark);
  const { user } = useSelector((state) => state.user);
  const post = posts?.find((post) => post._id === id);
  console.log("user details", user);
  console.log("comments", posts?.comments);

  const [showCommentBox, setShowCommentBox] = useState(false);

  const toggleForm = () => {};

  const handleDelete = (postId) => {
    dispatch(deletePostAsync(postId));
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

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleDeleteComment = (postId, commentId) => {
    dispatch(removeCommentAsync({ postId, commentId }));
  };

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchAllPostAsync());
    }
    if (bookmarkStatus === "idle") {
      dispatch(fetchBookmark());
    }
  }, [dispatch, id]);

  return (
    <div className="container py-2 d-flex row py-2">
      <div className="col-md-3">
        <Sidebar />
      </div>
      <div className="col-md-6 mb-2">
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

        <div>
          <p>Comments:</p>
          <ul className="comment_list">
            {post?.comments.map(({ _id, comment, commentedBy }) => (
              <>
                <hr />
                <li className="comment_list_item" key={_id}>
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <img
                          src={
                            commentedBy.image
                              ? commentedBy.image.url
                              : "/images/demo.png"
                          }
                          alt={commentedBy.username}
                          className="img-fluid commentedByImage"
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
                            <MdDelete />
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
    </div>
  );
};

export default PostDetails;
