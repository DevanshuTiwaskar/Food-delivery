import { useState, useEffect, useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Verify from './pages/Verify/Verify';
import TrackOrder from './pages/TrackOrder/TrackOrder';

import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import AdminAuthPopup from './components/AdminAuthPopup/AdminAuthPopup';
import Navbar from './components/Navbar/Navbar';
import Preloader from './components/Preloader/Preloader';
import ServerWakeup from './components/ServerWakeup/ServerWakeup';
import { StoreContext } from './context/StoreContext';
import Lenis from 'lenis';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { serverAwake } = useContext(StoreContext);

  // Handle Preloader timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800); // Premium length for impact

    return () => clearTimeout(timer);
  }, []);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Smoother, more consistent feel
      wheelMultiplier: 1,
      gestureOrientation: 'vertical',
      normalizeWheel: true,
      smoothTouch: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Update Lenis on route change to ensure scroll height is recalculated
    lenis.on('scroll', () => {
      // Optional: handle any scroll-based animations here efficiently
    });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = 'Home - Cravely';
        break;
      case '/cart':
        document.title = 'Cart - Cravely';
        break;
      case '/order':
        document.title = 'Place Order - Cravely';
        break;
      case '/myorders':
        document.title = 'My Orders - Cravely';
        break;
      case '/verify':
        document.title = 'Verify Order - Cravely';
        break;
      default:
        document.title = 'Cravely';
    }
  }, [location.pathname]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modern Intro Preloader */}
      {loading && <Preloader />}

      {/* Server Wakeup Overlay - shows when Render backend is cold-starting */}
      {!loading && !serverAwake && <ServerWakeup />}

      {/* Popups */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {showAdminLogin && <AdminAuthPopup onClose={() => setShowAdminLogin(false)} />}

      {/* Enhanced Navbar - 100% width sticky (No transform wrapper) */}
      {!loading && <Navbar setShowLogin={setShowLogin} setShowAdminLogin={setShowAdminLogin} />}

      <div className={`app ${loading ? 'app-content-hidden' : 'app-content-visible'}`}>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
        </Routes>
      </div>

      {/* Footer */}
      {!loading && !['/order', '/track-order', '/verify'].some(path => location.pathname.startsWith(path)) && <Footer />}
    </>
  )
};

export default App;