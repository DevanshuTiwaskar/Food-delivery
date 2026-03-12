import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/add",
      label: "Add Items",
      icon: "➕",
      img: assets.add_icon
    },
    {
      path: "/list",
      label: "List Items",
      icon: "📋",
      img: assets.order_icon
    },
    {
      path: "/orders",
      label: "Orders",
      icon: "📦",
      img: assets.order_icon
    }
  ];

  return (
    <aside className="admin-sidebar glass-morphism">
      <div className="sidebar-container">
        <div className="sidebar-group">
          <p className="sidebar-title">Menu Management</p>
          <div className="sidebar-links">
            {menuItems.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <div className="link-icon-wrapper">
                  <span className="link-emoji">{item.icon}</span>
                </div>
                <span className="link-label">{item.label}</span>
                <div className="active-indicator"></div>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-dot online"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
