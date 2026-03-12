import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  return (
    <nav className="admin-navbar glass-morphism">
      <div className="navbar-left">
        <div className="admin-logo">
          <span className="logo-icon">💠</span>
          <div className="logo-text-group">
            <h1 className="logo-title">Cravely</h1>
            <span className="logo-badge">Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="admin-profile-chip">
          <div className="admin-info">
            <p className="admin-name">Super Admin</p>
            <p className="admin-role">System Manager</p>
          </div>
          <div className="admin-avatar-wrapper">
            <img className="admin-avatar" src={assets.profile_image} alt="Admin" />
            <div className="status-indicator"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
