import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Dashboard - Cravely Admin";
        break;
      case "/add":
        document.title = "Add Item - Cravely Admin";
        break;
      case "/list":
        document.title = "Food List - Cravely Admin";
        break;
      case "/orders":
        document.title = "Orders - Cravely Admin";
        break;
      default:
        document.title = "Cravely Admin";
    }
  }, [location]);

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-view">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
