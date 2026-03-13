import { useEffect, useState, useContext, memo, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import "./Navbar.css";

const Navbar = memo(({ setShowLogin, setShowAdminLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { token, setToken, userData, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized Cart Count
  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((acc, curr) => acc + curr, 0);
  }, [cartItems]);

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync active section with hash
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    } else {
      const hash = location.hash.replace("#", "") || "home";
      setActiveSection(hash);
    }
  }, [location]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.navbar')) setMenuOpen(false);
      if (showProfileMenu && !e.target.closest('.profile-section')) setShowProfileMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen, showProfileMenu]);

  const navLinks = useMemo(() => [
    { id: "home", label: "Home", href: "/#home", icon: "🏠" },
    { id: "menu", label: "Menu", href: "/#menu", icon: "🍴" },
    { id: "about", label: "About", href: "/#about", icon: "💡" },
    { id: "contact", label: "Contact", href: "/#contact", icon: "✉️" },
  ], []);

  const handleNavClick = useCallback((link) => {
    setActiveSection(link.id);
    setMenuOpen(false);
    const targetId = link.href.split("#")[1];

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else if (targetId === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      }, 400);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (targetId === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setShowProfileMenu(false);
    navigate("/");
  }, [navigate, setToken]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setActiveSection("home")}>
          <div className="logo-wrapper">
             <span className="logo-icon">🥘</span>
          </div>
          <div className="logo-text-group">
            <h1 className="logo-text">Cravely</h1>
            <p className="logo-motto">Fresh & Fast</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-menu">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNavClick(link)}
                className={`menu-link ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Action Group */}
        <div className="navbar-right">
          
          {/* Cart Icon */}
          <Link to="/cart" className="action-btn cart-btn">
            <div className="icon-badge-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </div>
          </Link>

          {/* Auth/Profile */}
          {!token ? (
            <div className="auth-group">
              <button 
                className="btn-signin" 
                onClick={() => setShowLogin(true)}
              >
                Sign In
              </button>
              <button 
                className="btn-admin"
                onClick={() => setShowAdminLogin(true)}
              >
                Admin
              </button>
            </div>
          ) : (
            <div className="profile-section">
              <button 
                className={`profile-toggle ${showProfileMenu ? 'active' : ''}`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img src={assets.profile_icon} alt="user" className="profile-img" />
                <span className="user-firstname">{userData?.fullName?.firstName || "Me"}</span>
                <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown-premium">
                  <div className="dropdown-user-header">
                    <p className="user-full-name">{userData?.fullName?.firstName} {userData?.fullName?.lastName}</p>
                    <p className="user-email-muted">{userData?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/myorders" onClick={() => setShowProfileMenu(false)} className="dropdown-item">
                     <img src={assets.bag_icon} alt="" /> <span>My Orders</span>
                  </Link>
                  <button onClick={logout} className="dropdown-item logout-link">
                     <img src={assets.logout_icon} alt="" /> <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button 
            className={`mobile-toggle-btn ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>

      {/* Modern Mobile Overlay */}
      <div className={`mobile-nav-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-nav-panel" onClick={(e) => e.stopPropagation()}>
           <div className="panel-header">
             <div className="logo-placeholder">🥘 Cravely</div>
             <button className="panel-close" onClick={() => setMenuOpen(false)}>&times;</button>
           </div>
           <nav className="panel-links">
             {navLinks.map((link) => (
                <button 
                  key={link.id} 
                  className={`panel-link ${activeSection === link.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(link)}
                >
                  <span className="panel-link-icon">{link.icon}</span>
                  <span className="panel-link-text">{link.label}</span>
                </button>
             ))}
           </nav>
           <div className="panel-footer">
             {!token ? (
               <button className="btn-panel-auth" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>Get Started</button>
             ) : (
                <button className="btn-panel-logout" onClick={logout}>Logout</button>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;