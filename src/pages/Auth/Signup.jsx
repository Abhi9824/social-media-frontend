import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../features/userSlice";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const isFormValid = () => {
    const { name, username, email, password } = formData;
    return (
      name.trim() !== "" &&
      username.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      isChecked
    );
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("All fields are required, and terms must be accepted.");
      return;
    }
    const resultAction = await dispatch(signupUser(formData));
    if (resultAction.type === signupUser.fulfilled.type) {
      console.log("Signup Successful");
      navigate("/login");
    } else {
      console.log("Signup Failed");
    }
  };
  return (
    <div className="form-container">
      <div className="form-content">
        <div className="form-header">
          <header>Signup</header>
        </div>
        <form onSubmit={submitHandler} className="form-body">
          <div className="form-item">
            <label htmlFor="username">Username:</label>

            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              placeholder="Enter you username"
              onChange={(e) =>
                setFormData((form) => ({ ...form, username: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-item">
            <label htmlFor="name">Name:</label>

            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              placeholder="Enter you name"
              onChange={(e) =>
                setFormData((form) => ({ ...form, name: e.target.value }))
              }
              required
            />
          </div>
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
              required
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
              required
            />
          </div>
          <div>
            <input
              type="checkbox"
              id="termsId"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              required
            />
            <label htmlFor="terms"> I accept all Terms & conditions</label>
          </div>
          <button type="submit" className="submitBtn">
            Submit
          </button>
        </form>
        <div className="form-footer">
          <Link to="/login" className="loginNavigation">
            <p>Already have an Account </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
