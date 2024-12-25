import "./Empty.css";
export const NoPost = () => {
  return (
    <div className="no__posts-container">
      <div className="no__posts">
        <img
          src="/images/no_post.png"
          alt="no post availabe"
          className="img-fluid"
        />
        <p>No posts yet</p>
      </div>
    </div>
  );
};

export const NoBookmarks = () => {
  return (
    <div className="no__posts-container">
      <div className="no__posts">
        <img
          src="/images/no_post_alt.png"
          alt="no post availabe"
          className="img-fluid"
        />
        <p>No Post Saved</p>
      </div>
    </div>
  );
};
