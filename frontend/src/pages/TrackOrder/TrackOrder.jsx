import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { StoreContext } from '../../Context/StoreContext';
import api from '../../api/client';
import { assets } from '../../assets/assets';
import './TrackOrder.css';

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(StoreContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const response = await api.post("/api/order/userorders", {}, { headers: { token } });
            const currentOrder = response.data.data.find(o => o._id === orderId);
            if (currentOrder) {
                setOrder(currentOrder);
            } else {
                navigate('/myorders');
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        fetchOrderDetails();

        // Socket connection for real-time updates
        const socketUrl = window.location.hostname === 'localhost' 
            ? "http://localhost:4000" 
            : "https://food-delivery-1-8uo5.onrender.com";
        
        const socket = io(socketUrl);

        socket.on("order-status-update", (data) => {
            if (data.orderId === orderId) {
                setOrder(prev => ({ ...prev, status: data.status }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [orderId, token]);

    if (loading) return <div className="track-loading">Refining tracking data...</div>;
    if (!order) return null;

    const steps = ["Food Processing", "Out for Delivery", "Delivered"];
    const currentStepIndex = steps.indexOf(order.status);

    return (
        <div className='track-order-page container fade-in page-clearance'>
            <div className="track-header">
                <button className="back-btn-minimal" onClick={() => navigate('/myorders')}>
                    ← Back to Orders
                </button>
                <h1 className="premium-title">Tracking Your <span className="highlight">Flavors</span></h1>
                <p className="order-id-display">Reference: #{order._id.slice(-8).toUpperCase()}</p>
            </div>

            <div className="track-main-card premium-card">
                <div className="tracking-visual-stepper">
                    {steps.map((step, index) => (
                        <div key={index} className={`step-item ${index <= currentStepIndex ? 'active' : ''} ${index < currentStepIndex ? 'completed' : ''}`}>
                            <div className="step-point">
                                {index < currentStepIndex ? '✓' : index + 1}
                            </div>
                            <div className="step-label">{step}</div>
                            {index < steps.length - 1 && <div className="step-connector"></div>}
                        </div>
                    ))}
                </div>

                <div className="tracking-status-hero">
                    <div className="status-icon-container pulse">
                         <img src={assets.parcel_icon} alt="Delivery" />
                    </div>
                    <div className="status-text-content">
                        <h2>{order.status}</h2>
                        <p>Estimated Arrival: <b>25 - 40 Mins</b></p>
                    </div>
                </div>

                <div className="order-summary-tracking">
                    <h3>Order Items</h3>
                    <div className="items-grid-mini">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="mini-item-card">
                                <span>{item.name}</span>
                                <b>x{item.quantity}</b>
                            </div>
                        ))}
                    </div>
                    <div className="tracking-total-row">
                        <span>Paid via Digital Wallet</span>
                        <b className="highlight">Total Amount: ₹{order.amount}</b>
                    </div>
                </div>
            </div>

            <div className="delivery-person-card glass">
                <div className="avatar-placeholder">👨‍🍳</div>
                <div className="delivery-info">
                    <h4>Chef's Selection Team</h4>
                    <p>Our kitchen is preparing your gourmet experience with precision.</p>
                </div>
                <button className="help-btn">Need Help?</button>
            </div>
        </div>
    );
};

export default TrackOrder;
