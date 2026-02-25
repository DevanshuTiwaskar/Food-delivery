import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import "./Navbar.css";

// Enhanced Navbar Component
const Navbar = ({ setShowLogin, setShowAdminLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { token, setToken, userData, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate cart count from context
  const cartCount = Object.values(cartItems).reduce((acc, curr) => acc + curr, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active section based on URL/Scroll
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
    } else {
      const hash = location.hash.replace("#", "") || "home";
      setActiveSection(hash);
    }
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.navbar')) {
        setMenuOpen(false);
      }
      if (showProfileMenu && !e.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen, showProfileMenu]);

  const navLinks = [
    { id: "home", label: "Home", icon: "🏠", href: "/" },
    { id: "menu", label: "Menu", icon: "🍽️", href: "/#menu" },
    { id: "about", label: "About", icon: "ℹ️", href: "/#about" },
    { id: "contact", label: "Contact", icon: "📞", href: "/#contact" },
  ];

  const handleNavClick = (link) => {
    setActiveSection(link.id);
    setMenuOpen(false);

    if (link.href.startsWith('/#')) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.href);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={() => setActiveSection("home")}>
            <div className="brand-icon">🍔</div>
            <div className="brand-text-container">
              <span className="brand-text">Cravely</span>
              <div className="brand-subtitle">Food Delivery</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            <div className="nav-pills">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`nav-pill ${activeSection === link.id ? 'nav-pill-active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {/* Cart Button */}
            <Link to="/cart" className="cart-btn-desktop">
              <div className="cart-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </Link>

            {!token ? (
              <div className="auth-buttons">
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn btn-primary"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="btn btn-admin-nav"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Admin</span>
                </button>
              </div>
            ) : (
              <div className="profile-container">
                <button
                  className="profile-trigger"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="user-info-chip">
                    <img src={assets.profile_icon} alt="profile" />
                    <span className="user-name-text">
                      {userData?.fullName?.firstName || "User"}
                    </span>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <Link to="/myorders" onClick={() => setShowProfileMenu(false)}>
                      <img src={assets.bag_icon} alt="" /><p>Orders</p>
                    </Link>
                    <hr />
                    <li onClick={logout}>
                      <img src={assets.logout_icon} alt="" /><p>Logout</p>
                    </li>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-only-actions">
            <Link to="/cart" className="cart-btn-mobile-trigger">
              <div className="cart-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`mobile-menu-btn ${menuOpen ? 'mobile-menu-btn-open' : ''}`}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`mobile-nav-item ${activeSection === link.id ? 'mobile-nav-item-active' : ''}`}
                >
                  <span className="mobile-nav-icon">{link.icon}</span>
                  <span className="mobile-nav-label">{link.label}</span>
                </button>
              ))}
            </div>

            <div className="mobile-menu-footer">
              {!token ? (
                <div className="mobile-auth-actions">
                  <button
                    onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                    className="btn btn-primary btn-mobile"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setShowAdminLogin(true); setMenuOpen(false); }}
                    className="btn btn-admin btn-mobile"
                  >
                    Admin Access
                  </button>
                </div>
              ) : (
                <div className="mobile-profile-actions">
                  <Link to="/myorders" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                    <img src={assets.bag_icon} alt="" /> <span>My Orders</span>
                  </Link>
                  <button onClick={logout} className="mobile-nav-item logout-mobile">
                    <img src={assets.logout_icon} alt="" /> <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;