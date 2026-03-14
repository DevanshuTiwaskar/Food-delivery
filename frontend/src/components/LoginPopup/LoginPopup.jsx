import React, { useContext, useState, useEffect } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import api from "../../api/client";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, setUserData, loadCartData } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowLogin(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowLogin]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (currState === "Sign Up" && data.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const onLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
      const response = await api.post(endpoint, data);

      if (response.data.success) {
        const token = response.data.token;
        const user = response.data.user;
        setToken(token);
        setUserData(user); // Set the full user profile
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(user));

        await loadCartData(token);
        setShowLogin(false);
        toast.success(
          currState === "Login" ? "Welcome back!" : "Account created successfully!"
        );
      } else {
        toast.error(response.data.message || "Authentication failed.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      const msg = error.response?.data?.message || "Connection error. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            title="Close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <div className="input-group">
              <input
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Full Name"
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="input-group">
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Email address"
              required
              autoComplete="email"
            />
          </div>
          <div className="input-group password-group">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              autoComplete={currState === "Login" ? "current-password" : "new-password"}
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            currState === "Login" ? "Sign In" : "Create Account"
          )}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required defaultChecked />
          <p>
            By continuing, I agree to the <span>Terms</span> & <span>Privacy Policy</span>.
          </p>
        </div>

        {currState === "Login" ? (
          <p>
            New to Cravely?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Create account</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
