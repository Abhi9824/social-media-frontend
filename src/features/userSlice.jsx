import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const api = `${BASE_URL}/user`;

export const signupUser = createAsyncThunk("user/signup", async (userData) => {
  try {
    const response = await axios.post(`${api}/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      return data.user;
    }
  } catch (error) {
    throw new Error("SignUp Failed:", error);
  }
});

export const loginUser = createAsyncThunk("user/login", async (credentials) => {
  try {
    const response = await axios.post(`${api}/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      return data.user;
    }
  } catch (error) {
    throw new Error("Error in Logging in");
  }
});

export const fetchProfileAsync = createAsyncThunk("user/profile", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is missing, authentication error");
    }
    const response = await axios.get(`${api}/profile`, {
      headers: {
        Authorization: token,
      },
    });
    if (response.status === 200) {
      const data = response.data;
      return data.profile;
    }
  } catch (error) {
    throw new Error("Failed to fetch profile");
  }
});
export const editProfile = createAsyncThunk(
  "users/updateProfile",
  async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing, authentication error");
      }
      const response = await axios.put(
        `${api}/profile/update`,
        { updatedData },
        { headers: { Authorization: token } }
      );
      const data = response.data;
      return data.profile;
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  }
);

export const fetchAllUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing, authentication required!");
      }
      const response = await axios.get(`${BASE_URL}/users`);
      if (response) {
        const data = response.data;
        return data.users;
      }
    } catch (error) {
      throw new Error("Failed to fetch all users");
    }
  }
);

export const followUserAsync = createAsyncThunk(
  "user/followUser",
  async (followerUserId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing, auhtentication error");
      }
      const response = await axios.post(
        `${api}/follow/${followerUserId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        return data;
      } else {
        throw new Error("Failed to follow");
      }
    } catch (error) {
      throw new Error("Failed to follow the user");
    }
  }
);

export const unfollowUserAsync = createAsyncThunk(
  "user/unfollow",
  async (followerUserId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token missing");
      }
      const response = await axios.post(
        `${api}/unfollow/${followerUserId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        const { data } = response.data;
        return data;
      }
    } catch (error) {
      throw new Error("Failed to unfollow");
    }
  }
);

export const changeAvatarAsync = createAsyncThunk(
  "user/avatar",
  async (avatar) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      if (avatar) {
        formData.append("image", avatar);
      }

      const response = await axios.post(`${api}/change-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        return data.user;
      }
    } catch (error) {
      throw new Error("Failed to change the avatar");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    isLoggedIn: false,
    token: localStorage.getItem("token") || null,
    user: {},
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.isLoggedIn = false;
      toast.success("Logout Successful");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
        state.users.push(action.payload);
        toast.success("Signup successful");
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
        toast.success("Login Successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(fetchProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(editProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => (user.username = updatedUser.username)
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        state.user = updatedUser;
        toast.success("Profile Updated");
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchAllUsersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action.payload;
      })
      .addCase(fetchAllUsersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(followUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const updatedFollowerUser = action.payload.followUser;
        state.user = updatedUser;
        const userIndex = state.users.findIndex(
          ({ username }) => username === updatedFollowerUser.username
        );
        state.users[userIndex] = updatedFollowerUser;
        state.status = "success";
        toast.success("User followed");
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(unfollowUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const updatedFollowUser = action.payload.unfollowUser;
        state.user = updatedUser;
        const userIdx = state.users.findIndex(
          ({ username }) => username === updatedFollowUser.username
        );
        state.users[userIdx] = updatedFollowUser;
        state.status = "success";
        toast.success("User unfollowed");
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(changeAvatarAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changeAvatarAsync.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload;
        console.log("action", action.payload);

        // Ensure updatedUser exists before accessing properties
        if (!updatedUser) {
          console.error("Updated user data is missing!");
          return;
        }
        if (state.users) {
          const userIdx = state.users.findIndex(
            ({ username }) => username === updatedUser.username
          );
          if (userIdx !== -1) {
            state.users[userIdx] = updatedUser;
          }
        }
        state.user = updatedUser;
        toast.success("Avatar Updated");
      })
      .addCase(changeAvatarAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
export const { logoutUser } = userSlice.actions;
