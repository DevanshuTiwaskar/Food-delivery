import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const getAnalytics = async (req, res) => {
  try {
    // 1. Total Revenue (from paid orders)
    const orders = await orderModel.find({ payment: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    // 2. Total Users (excluding admins)
    const totalUsers = await userModel.countDocuments({ role: "user" });

    // 3. Top Dishes (flattening all order items and summing quantities)
    const dishCounts = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (dishCounts[item.name]) {
          dishCounts[item.name] += item.quantity;
        } else {
          dishCounts[item.name] = item.quantity;
        }
      });
    });

    const topDishes = Object.keys(dishCounts)
      .map((name) => ({
        name,
        quantity: dishCounts[name],
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5); // top 5 dishes

    // 4. Daily Revenue Trend (Simple mapping based on order date)
    const revenueByDate = {};
    orders.forEach((order) => {
      const dateObj = new Date(order.date);
      // Format as DD/MM
      const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`; 
      
      if (revenueByDate[dateStr]) {
        revenueByDate[dateStr] += order.amount;
      } else {
        revenueByDate[dateStr] = order.amount;
      }
    });

    const revenueTrend = Object.keys(revenueByDate).map(date => ({
      date,
      revenue: revenueByDate[date]
    }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        totalUsers,
        topDishes,
        revenueTrend
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching analytics" });
  }
};

export { getAnalytics };
