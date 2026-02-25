import { useState, useContext } from "react";
import "./Navbar.css";
import { StoreContext } from "../../Context/StoreContext";
import api from "../../api/client"; // axios instance

const LoginPopup = ({ setShowLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { setToken, loadCartData } = useContext(StoreContext);

  const handleClose = () => {
    setShowLogin(false);
  };

  // handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // ------------------ LOGIN ------------------
        const res = await api.post("/api/user/login", {
          email: formData.email,
          password: formData.password,
        });

        if (res.data?.success) {
          const token = res.data.token;
          setToken(token);
          localStorage.setItem("token", token);
          await loadCartData(token);
          handleClose();
        } else {
          setErrorMsg(res.data?.message || "Login failed.");
        }
      } else {
        // ------------------ REGISTER ------------------
        const res = await api.post("/api/user/register", {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        if (res.data?.success) {
          const token = res.data.token;
          setToken(token);
          localStorage.setItem("token", token);
          await loadCartData(token);
          handleClose();
        } else {
          setErrorMsg(res.data?.message || "Signup failed.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay" onClick={handleClose}>
      <div
        className="login-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="login-popup-close" onClick={handleClose}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="login-popup-header">
          <div className="login-popup-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="login-popup-title">{isLogin ? "Welcome Back!" : "Join Cravely"}</h2>
          <p className="login-popup-subtitle">
            {isLogin
              ? "Sign in to your account to continue ordering."
              : "Create your account and start your food journey."}
          </p>
        </div>

        {/* Form */}
        <form className="login-popup-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            {!isLogin && (
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <button type="button" className="forgot-password">
                  Forgot Password?
                </button>
              </div>
            )}

            {errorMsg && <p className="error-message">{errorMsg}</p>}

            <button className="form-submit login-submit" type="submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button type="button" className="social-btn google-btn">
              {/* Google Icon */}
              Continue with Google
            </button>
            <button type="button" className="social-btn facebook-btn">
              {/* Facebook Icon */}
              Continue with Facebook
            </button>
          </div>

          {/* Switch */}
          <div className="form-switch">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="form-switch-button"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
