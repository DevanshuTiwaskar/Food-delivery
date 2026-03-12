import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Dashboard = ({ url }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use the provided url or fallback to localhost
  const API_URL = url || "http://localhost:4000";

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics`);
      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading Analytics...</div>;
  }

  if (!analytics) return null;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Overview Dashboard</h1>
        <p>Monitor your restaurant's performance</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card glass-card">
          <span className="metric-icon">💰</span>
          <div className="metric-info">
            <p className="metric-label">Total Revenue</p>
            <h2 className="metric-value">₹{analytics.totalRevenue}</h2>
          </div>
        </div>

        <div className="metric-card glass-card">
          <span className="metric-icon">📦</span>
          <div className="metric-info">
            <p className="metric-label">Total Orders</p>
            <h2 className="metric-value">{analytics.totalOrders}</h2>
          </div>
        </div>

        <div className="metric-card glass-card">
          <span className="metric-icon">👥</span>
          <div className="metric-info">
            <p className="metric-label">Total Users</p>
            <h2 className="metric-value">{analytics.totalUsers}</h2>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container glass-card">
          <h3>Revenue Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff6347"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-card">
          <h3>Top 5 Popular Dishes</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topDishes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
