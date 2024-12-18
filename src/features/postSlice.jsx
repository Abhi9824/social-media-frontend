import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BASE_URL } from "../utils/baseUrl";
import axios from "axios";
const api = `${BASE_URL}/user/post`;

export const fetchAllPostAsync = createAsyncThunk("post/allPost", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is missing");
    }
    const response = await axios.get(`${api}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      console.log("post data", data);
      return data.post;
    }
  } catch (error) {
    throw new Error("Failed to load all posts");
  }
});

export const addToPostAsync = createAsyncThunk(
  "post/addToPost",
  async (postData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const formData = new FormData();
      formData.append("caption", postData.caption);
      postData.media.forEach((file) => {
        formData.append("media", file);
      });

      const response = await axios.post(`${api}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        return data.post;
      }
    } catch (error) {
      throw new Error("Failed to post");
    }
  }
);

export const deletePostAsync = createAsyncThunk(
  "post/deletePost",
  async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.delete(`${api}/${postId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        return data.post;
      }
    } catch (error) {
      throw new Error("Failed to delete the post");
    }
  }
);

export const likePostAsync = createAsyncThunk(
  "post/likePost",
  async (postId) => {
    console.log("like", postId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.post(
        `${api}/like/${postId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        // console.log("like post data", data.post);
        return data.post;
      }
    } catch (error) {
      throw new Error("Failed to like the Post");
    }
  }
);

export const unlikePost = createAsyncThunk(
  "post/unlikePost",
  async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.post(
        `${api}/unlike/${postId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        // console.log("unlike data", data.post);
        return data.post;
      }
    } catch (error) {
      throw new Error("Failed to unlike the post");
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ postId, dataToUpdate }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const formData = new FormData();
      if (dataToUpdate.caption) {
        formData.append("caption", dataToUpdate.caption);
      }
      if (dataToUpdate.media && dataToUpdate.media.length > 0) {
        dataToUpdate.media.forEach((file) => formData.append("media", file));
      }
      const response = await axios.put(`${api}/edit/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        return data.post;
      } else {
        throw new Error(response.data.message || "Failed to update the post");
      }
    } catch (error) {
      throw new Error("Failed to update the post");
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  "post/addComment",
  async ({ postId, comment }) => {
    console.log("postId", postId);
    console.log("commentData", comment);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.post(
        `${api}/comment/${postId}`,
        { newComment: comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        console.log("add post comment", data);
        return data.post;
        // const { updatedPost } = response.data;
        // const { newComment, postId: updatedPostId } = updatedPost;
        // return { postId: updatedPostId, newComment };
      }
    } catch (error) {
      throw new Error("Failed to add comment");
    }
  }
);
export const removeCommentAsync = createAsyncThunk(
  "post/removeComment",
  async ({ postId, commentId }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }
      const response = await axios.delete(
        `${api}/${postId}/delete-comment/${commentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        return data.post;
      }
    } catch (error) {
      throw new Error("Failed to add comment");
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    postStatus: "idle",
    postError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPostAsync.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(fetchAllPostAsync.fulfilled, (state, action) => {
        state.postStatus = "success";
        console.log("all post ka payload", action.payload);
        state.posts = action.payload;
      })
      .addCase(fetchAllPostAsync.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })

      .addCase(addToPostAsync.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(addToPostAsync.fulfilled, (state, action) => {
        state.postStatus = "success";
        state.posts.push(action.payload);
      })
      .addCase(addToPostAsync.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })

      .addCase(updatePost.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postStatus = "success";
        const updatedPost = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })
      .addCase(deletePostAsync.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.postStatus = "success";
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload._id
        );
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })
      .addCase(likePostAsync.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const updatedPost = action.payload;

        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }

        state.postStatus = "success";
      })
      .addCase(likePostAsync.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })
      .addCase(unlikePost.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        console.log("ulinke", action.payload);
        const updatedPost = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
        state.postStatus = "success";
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })
      .addCase(addCommentAsync.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.postStatus = "success";
        const { postId, newComment } = action.payload;
        const postIndex = state.posts.findIndex((post) => post._id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(newComment);
        }
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      })
      .addCase(removeCommentAsync.pending, (state) => {
        state.postStatus = "loading";
      })
      .addCase(removeCommentAsync.fulfilled, (state, action) => {
        state.postStatus = "success";
        const { postId, updatedComments } = action.payload;

        const postIndex = state.posts.findIndex((post) => post._id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex].comments = updatedComments;
        }
        toast.success("Comment removed");
      })
      .addCase(removeCommentAsync.rejected, (state, action) => {
        state.postStatus = "failed";
        state.postError = action.error.message;
      });
  },
});

export default postSlice.reducer;
