import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Verify from './pages/Verify/Verify';

import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import AdminAuthPopup from './components/AdminAuthPopup/AdminAuthPopup';
import Navbar from './components/Navbar/Navbar';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const location = useLocation();

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

      {/* Popups */}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      {showAdminLogin && <AdminAuthPopup onClose={() => setShowAdminLogin(false)} />}

      <div className="app">
        {/* Enhanced Navbar */}
        <Navbar setShowLogin={setShowLogin} setShowAdminLogin={setShowAdminLogin} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </>
  )
};

export default App;