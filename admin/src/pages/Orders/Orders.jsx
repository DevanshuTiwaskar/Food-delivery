import { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import api from "../../assets/assets"; // axios instance
import { assets } from "../../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Server error while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await api.post("/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated");
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      toast.error("Server error while updating order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-container">
      <div className="page-header">
        <h2 className="heading-xl">Recent Orders</h2>
        <p className="text-secondary">Track and manage incoming deliveries and fulfillment.</p>
      </div>

      <div className="orders-list">
        {loading && (
          <div className="table-loading">
            <div className="loading-spinner colored"></div>
            <p>Loading orders...</p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="table-empty">
            <span>📦</span>
            <p>No orders yet. They will appear here once customers start purchasing!</p>
          </div>
        )}

        {!loading && orders.map((order, index) => (
          <div key={index} className="order-item-card card">
            <div className="order-item-grid">
              {/* Parcel Icon */}
              <div className="order-parcel">
                <div className="parcel-icon-wrapper">
                  <img src={assets.parcel_icon} alt="parcel" />
                </div>
              </div>

              {/* Order Content */}
              <div className="order-content">
                <div className="order-food-details">
                  <p className="food-list">
                    {order.items.map((item, index) =>
                      index === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `
                    )}
                  </p>
                </div>

                <div className="order-customer-info">
                  <p className="customer-name">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div className="customer-address">
                    <p>{order.address.street}, {order.address.city}</p>
                    <p>{order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                  </div>
                  <p className="customer-phone">📞 {order.address.phone}</p>
                </div>
              </div>

              {/* Order Stats */}
              <div className="order-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Items</span>
                  <span className="stat-value">{order.items.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Amount Paid</span>
                  <span className="stat-value highlight">₹{order.amount}</span>
                </div>
              </div>

              {/* Status Action */}
              <div className="order-status-action">
                <p className="status-label">Review Status</p>
                <select
                  className={`status-select ${order.status.toLowerCase().replace(/ /g, '-')}`}
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
