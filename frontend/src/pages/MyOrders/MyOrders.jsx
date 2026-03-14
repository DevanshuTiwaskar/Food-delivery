import React, { useContext, useEffect, useState, useCallback } from 'react'
import './MyOrders.css'
import api from '../../api/client'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data.reverse()); // Show most recent orders first
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'food processing': return 'status-processing';
      case 'out for delivery': return 'status-delivery';
      case 'delivered': return 'status-delivered';
      default: return 'status-default';
    }
  };

  return (
    <div className='my-orders-page container fade-in page-clearance'>
      <div className="my-orders-nav">
        <button className="back-btn-minimal" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </button>
      </div>
      <div className="orders-header">
        <h1 className="premium-title">Your <span className="highlight">Culinary History</span></h1>
        <p className="text-muted">Track your journeys through flavors and delicate cuisines.</p>
        <div className="orders-count-badge">
          {data.length} Orders Placed
        </div>
      </div>

      {loading ? (
        <div className="orders-loading-state">
           <div className="loader-pulse"></div>
           <p>Retrieving your orders...</p>
        </div>
      ) : data.length > 0 ? (
        <div className="orders-grid">
          {data.map((order, index) => (
            <div key={order._id || index} className='order-card premium-card'>
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-id">ID: #{order._id.slice(-6).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className={`status-badge ${getStatusColor(order.status)}`}>
                  <span className="dot"></span>
                  {order.status}
                </div>
              </div>

              <div className="order-card-body">
                <div className="parcel-visual">
                   <img src={assets.parcel_icon} alt="Parcel" />
                </div>
                
                <div className="order-details-info">
                  <div className="items-list-modern">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="order-item-chip">
                        {item.name} <mark>x{item.quantity}</mark>
                      </span>
                    ))}
                  </div>
                  
                  <div className="order-stats-row">
                    <div className="stat-item">
                      <span className="stat-label">Total Amount</span>
                      <span className="stat-value highlight">₹{order.amount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Items</span>
                      <span className="stat-value">{order.items.length} Units</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <button className="track-order-btn-premium" onClick={() => navigate(`/track-order/${order._id}`)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    <path d="M9 10l3 3 3-3"></path>
                  </svg>
                  Update Status
                </button>
                <div className="payment-indicator">
                  {order.payment ? (
                    <span className="paid-text">✓ Paid Secured</span>
                  ) : (
                    <span className="unpaid-text">⚠ Payment Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders-premium">
          <div className="empty-visual">🍱</div>
          <h2>No orders yet</h2>
          <p>Your culinary journey is just beginning. Explore our menu and place your first order.</p>
          <button className="start-exploring-btn" onClick={() => window.location.href='/'}>
            Start Exploring
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
