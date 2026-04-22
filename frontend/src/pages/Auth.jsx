import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: ""
  });

  const API = axios.create({
    baseURL: "http://localhost:4000/api/v1",
    withCredentials: true
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await API.post("/users/login", {
          ...form,
          role
        });

        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        navigate("/dashboard");
      } else {
        await API.post("/users/register", {
          ...form,
          role
        });

        alert("Account created");
        setIsLogin(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(msg);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2>{isLogin ? "Welcome back" : "Join the Hub"}</h2>
        <p>
          {isLogin
            ? "Please enter your details to sign in."
            : "Connect with campus events across the region."}
        </p>

        {/* ROLE TOGGLE */}
        <div className="role-toggle">
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
          >
            Student
          </button>

          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            College Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                name="fullname"
                placeholder="Full Name"
                onChange={handleChange}
              />

              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
              />
            </>
          )}

          <input
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
            />
          )}

          <button type="submit" className="main-btn">
            {isLogin ? "Sign in" : "Create Account"}
          </button>
        </form>

        <p className="switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Create an account" : " Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
