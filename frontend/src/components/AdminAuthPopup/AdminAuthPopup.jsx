import { useState, useEffect, useContext } from "react";
import "./AdminAuthPopup.css";
import api from "../../api/client";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";

const AdminAuthPopup = ({ onClose, setAdminToken }) => {
    const { setToken, setUserData } = useContext(StoreContext);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    // Handle escape key to close popup
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

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
        setLoading(true);

        try {
            const endpoint = isLogin ? "/api/seller/login" : "/api/seller/register";
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.fullName, email: formData.email, password: formData.password };

            const res = await api.post(endpoint, payload);

            if (res.data?.success) {
                const token = res.data.token;
                const user = res.data.user;

                // Set in context
                setToken(token);
                setUserData(user);

                // Set in localStorage
                localStorage.setItem("adminToken", token);
                localStorage.setItem("token", token);
                localStorage.setItem("userData", JSON.stringify(user));

                if (setAdminToken) setAdminToken(token);
                onClose();
                toast.success(isLogin ? "Admin logged in!" : "Admin account created!");
            } else {
                toast.error(res.data?.message || "Authentication failed.");
            }
        } catch (err) {
            console.error("Admin auth error:", err);
            const msg = err.response?.data?.message || "Something went wrong. Try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-popup-overlay" onClick={onClose}>
            <div
                className="admin-popup-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button className="admin-popup-close" onClick={onClose}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="admin-popup-header">
                    <div className="admin-popup-icon">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <h2 className="admin-popup-title">
                        Admin {isLogin ? "Login" : "Register"}
                    </h2>
                    <p className="admin-popup-subtitle">
                        {isLogin
                            ? "Welcome back! Please sign in to your account."
                            : "Create your admin account to get started."}
                    </p>
                </div>

                {/* Form */}
                <form className="admin-popup-form" onSubmit={handleSubmit}>
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

                        <button className="form-submit" type="submit" disabled={loading}>
                            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
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

export default AdminAuthPopup;
