import React from "react";
import { loginUser } from "../../features/userSlice";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isFormValid = () => {
    const { email, password } = formData;
    return email.trim() !== "" && password.trim() !== "";
  };

  // const [password, setPassword] = useState("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      console.log("All fields are required");
      return;
    }
    const resultAction = await dispatch(loginUser(formData));
    if (resultAction.type === loginUser.fulfilled.type) {
      console.log("Login Successful");
      navigate("/");
    } else {
      console.log("Login Failed");
    }
  };
  return (
    <div className="form-container">
      <div className="form-content">
        <div className="form-header">
          <header>Login</header>
        </div>
        <form onSubmit={submitHandler} className="form-body">
          <div className="form-item">
            <label htmlFor="email">Email:</label>

            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              placeholder="Enter you email"
              onChange={(e) =>
                setFormData((form) => ({ ...form, email: e.target.value }))
              }
            />
          </div>
          <div className="form-item">
            <label htmlFor="password">Password:</label>

            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              placeholder="Enter you password"
              onChange={(e) =>
                setFormData((form) => ({ ...form, password: e.target.value }))
              }
            />
          </div>

          <button type="submit" className="submitBtn">
            Login
          </button>
        </form>
        <div className="form-footer">
          <Link to="/signup" className="loginNavigation">
            <p>Create New Account</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
