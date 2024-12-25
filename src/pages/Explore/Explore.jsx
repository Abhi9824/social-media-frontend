import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar/Sidebar";
import Post from "../../components/Post/Post";
import Aside from "../../components/Aside/Aside";
import { NoPost } from "../../components/Empty/Empty";

const Explore = () => {
  const { posts } = useSelector((state) => state.post);
  return (
    <div className="row py-2">
      <div className="col-md-3">
        <Sidebar />
      </div>
      <div className="container py-2 col-md-6">
        {posts?.length === 0 ? (
          <NoPost />
        ) : (
          <div>
            <ul className="post_list">
              {posts?.map((post) => (
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

export default Explore;
