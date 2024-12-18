import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Routes,
  Route,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import { RequiresAuth } from "./utils/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllUsersAsync, fetchProfileAsync } from "./features/userSlice";
import Loading from "./components/Loading/Loading";
import PostDetails from "./pages/Post/PostDetails";

function App() {
  const { isLoggedIn, status } = useSelector((state) => state.user);
  const postStatus = useSelector((state) => state.post.postStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isLoggedIn) {
      dispatch(fetchProfileAsync()).then(() => navigate("/"));
    }
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllUsersAsync());
    }
  }, []);

  return (
    <div className="container">
      <ToastContainer
        position="bottom-right"
        autoClose="400"
        closeOnClick="true"
        draggable="true"
        borderRadius="10px"
      />
      {status === "loading" || postStatus === "loading" ? (
        <Loading />
      ) : (
        <>
          <div>
            <Routes>
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <RequiresAuth>
                    <Home />
                  </RequiresAuth>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <RequiresAuth>
                    <PostDetails />
                  </RequiresAuth>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
