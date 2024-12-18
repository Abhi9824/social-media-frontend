import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import postSlice from "../features/postSlice";
import bookmarkSlice from "../features/bookmarkSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    bookmark: bookmarkSlice,
  },
});
