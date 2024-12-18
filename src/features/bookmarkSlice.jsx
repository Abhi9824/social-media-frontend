import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/baseUrl";
import axios from "axios";

const api = `${BASE_URL}/user`;

export const fetchBookmark = createAsyncThunk(
  "bookmarks/fetchBookmarks",
  async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/bookmarks`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("FetchBookmark", data);
        return data.bookmarks;
      }
    } catch (error) {
      throw new Error("Failed to fetch bookmark");
    }
  }
);

export const addToBookmark = createAsyncThunk(
  "bookmark/addToBookmark",
  async (postId) => {
    try {
      console.log("postId", postId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "User is not authenticated to add to bookmark.Token is missing"
        );
      }
      const response = await axios.post(
        `${api}/bookmark/${postId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        console.log("addBookmark", data.bookmarks);
        return data.bookmarks;
      }
    } catch (error) {
      throw new Error("Failed to add to Bookmark");
    }
  }
);

export const removeFromBookmark = createAsyncThunk(
  "bookmark/removeFromBookmark",
  async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "User is not authenticated to add to bookmark.Token is missing"
        );
      }
      const response = await axios.delete(`${api}/remove-bookmark/${postId}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        console.log("Remove bookmark", data);
        return data.bookmark;
      }
    } catch (error) {
      throw new Error("Failed to remove from the boookmark");
    }
  }
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarkStatus: "idle",
    bookmarks: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmark.pending, (state) => {
        state.bookmarkStatus = "loading";
      })
      .addCase(fetchBookmark.fulfilled, (state, action) => {
        state.bookmarkStatus = "success";
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmark.rejected, (state, action) => {
        state.bookmarkStatus = "failed";
        state.error = action.error.message;
      })
      //add to Bookmark
      .addCase(addToBookmark.pending, (state) => {
        state.bookmarkStatus = "loading";
      })
      .addCase(addToBookmark.fulfilled, (state, action) => {
        state.bookmarkStatus = "success";
        console.log("addBookmark payload", action.payload);
        state.bookmarks.push(action.payload);
        // state.bookmarks = action.payload;
      })
      .addCase(addToBookmark.rejected, (state, action) => {
        state.bookmarkStatus = "failed";
        state.error = action.error.message;
      })
      //remove from Bookmark
      .addCase(removeFromBookmark.pending, (state) => {
        state.bookmarkStatus = "loading";
      })
      .addCase(removeFromBookmark.fulfilled, (state, action) => {
        state.bookmarkStatus = "success";
        console.log("remove wala", action.payload);
        state.bookmarks = state.bookmarks.filter(
          (bookmark) => bookmark._id !== action.payload._id
        );
        // state.bookmarks = action.payload;
      })
      .addCase(removeFromBookmark.rejected, (state, action) => {
        state.bookmarkStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default bookmarkSlice.reducer;
