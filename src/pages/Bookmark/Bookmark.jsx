import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar/Sidebar";
import { NoBookmarks } from "../../components/Empty/Empty";
import Post from "../../components/Post/Post";
import { fetchBookmark } from "../../features/bookmarkSlice";
import "./Bookmark.css";
import Aside from "../../components/Aside/Aside";

const Bookmark = () => {
  const dispatch = useDispatch();
  const { bookmarks, bookmarkStatus } = useSelector((state) => state.bookmark);

  useEffect(() => {
    if (bookmarkStatus === "idle") {
      dispatch(fetchBookmark());
    }
  }, []);

  return (
    <div className="row py-2">
      <div className="col-md-3">
        <Sidebar />
      </div>
      <div className="container py-2 col-md-6">
        {bookmarks?.length === 0 ? (
          <NoBookmarks />
        ) : (
          <div>
            <ul className="post_list">
              {bookmarks?.map((post) => (
                <li key={post._id} className="post_item">
                  <Post postId={post._id} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="col-md-3">
        <Aside />
      </div>
    </div>
  );
};

export default Bookmark;
