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
  const { bookmarks, bookmarkStatus } = useSelector((state) => state.bookmark);

  const [trending, setTrending] = useState(false);
  const [allPost, setPosts] = useState([]); // To hold posts to display

  // Filter posts by user and their following
  const showPosts = posts.filter(({ author }) => {
    return (
      author.username === userState.user.username ||
      userState.user?.following?.some(
        (follower) => follower.username === author.username
      ) ||
      false
    );
  });
  // Sorting logic for trending
  const sortPosts = () => {
    setTrending(!trending);
    if (!trending) {
      const sortedPosts = [...showPosts].sort(
        (a, b) => Number(b.likes.length) - Number(a.likes.length)
      );
      setPosts(sortedPosts);
    } else {
      setPosts(showPosts); // Reset posts
    }
  };

  useEffect(() => {
    sortPosts();
  }, []);
  // Fetch posts when the component mounts
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
  // Update `allPost` based on filtered `showPosts`
  useEffect(() => {
    setPosts(showPosts); // Populate with filtered posts
  }, [posts, userState]);

  return (
    <div className="content">
      {allPost.length !== 0 ? (
        <div className="filter-container d-flex justify-content-end align-items-center">
          <div>
            <p>Show Trending: </p>
          </div>
          <div>
            <button onClick={sortPosts} className="filter_btn mx-1">
              {trending ? (
                <AiOutlineFire />
              ) : (
                <AiFillFire className="color_fill" />
              )}
            </button>
          </div>
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
