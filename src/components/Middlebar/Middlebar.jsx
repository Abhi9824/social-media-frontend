import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";
import { NoPost } from "../Empty/Empty";
import Post from "../Post/Post";
import { fetchAllPostAsync } from "../../features/postSlice";
import "./Middlebar.css";
import { fetchBookmark } from "../../features/bookmarkSlice";

const Middlebar = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { posts, postStatus } = useSelector((state) => state.post);
  const { bookmarkStatus } = useSelector((state) => state.bookmark);

  const [trending, setTrending] = useState(false);
  const [allPost, setPosts] = useState([]);

  const showPosts = posts.filter((post) => {
    if (!post || !post.author) return false;
    return (
      post.author?.username === userState?.user?.username ||
      userState.user?.following?.some(
        (follower) => follower?.username === post.author?.username
      )
    );
  });

  // Sorting logic for trending
  const sortPosts = () => {
    if (trending) {
      const sortedPosts = [...showPosts].sort(
        (a, b) => Number(b.likes.length) - Number(a.likes.length)
      );
      setPosts(sortedPosts);
    } else {
      setPosts(showPosts); // Reset posts
    }
    setTrending(!trending);
  };

  useEffect(() => {
    sortPosts();
  }, []);
  // Fetch posts and bookmarks when the component mounts
  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchAllPostAsync());
    }
    if (bookmarkStatus === "idle") {
      dispatch(fetchBookmark());
    }
  }, [postStatus, bookmarkStatus, dispatch]);

  // Updating `allPost` based on filtered `showPosts`
  useEffect(() => {
    setPosts(showPosts);
  }, [posts, userState]);

  return (
    <div className="content">
      {allPost.length !== 0 ? (
        <div className="filter-container d-flex justify-content-end align-items-center">
          <p className="mb-0">Show Trending: </p>

          <button
            onClick={() => {
              sortPosts();
            }}
            className="filter_btn mx-1"
          >
            {trending ? (
              <AiOutlineFire />
            ) : (
              <AiFillFire className="color_fill" />
            )}
          </button>
        </div>
      ) : (
        ""
      )}

      <div className="home_container">
        {allPost.length === 0 ? (
          <NoPost />
        ) : (
          <ul className="post_list">
            {allPost?.map((post) => (
              <li key={post._id} className="post_item">
                <Post postId={post._id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Middlebar;
