import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import sendOrderConfirmationEmail from "../utils/emailService.js";
import { io } from "../server.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "https://localhost:5174";

// Placing User Order for Frontend
const placeOrder = async (req, res) => {
      // 1️⃣ Create a new order in database
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    
    // 2️⃣ Clear user cart after placing order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name, // product name shown in Stripe checkout
        },
        unit_amount: item.price * 100, // Stripe expects amount in lowest currency unit (paise)
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: 40 * 100, // Delivery fee: ₹40 -> 4000 paise
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `http://localhost:5173/verify?success=false&orderId=${newOrder._id}`,
      line_items: line_items,
      mode: "payment",
    });

    console.log("Place Order Request Body:", req.body);
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Order placement error stack:", error.stack);
    console.error("Order placement error message:", error.message);
    res.json({ success: false, message: error.message || "Error" });
  }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
  try {
      // Fetch all orders (Admin can see every order)
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
     // Fetch all orders by logged-in userId
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};



const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    // Update order status (e.g., "Pending" -> "Delivered")
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.body.orderId,
      { status: req.body.status },
      { new: true } // Return the updated document
    );

    // Emit a socket event with the new status to connected clients
    if (updatedOrder) {
      io.emit("order-status-update", {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
      });
    }

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      // If payment success → mark order as paid
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
      
      // Fetch user email
      const user = await userModel.findById(updatedOrder.userId);
      if (user && user.email) {
        // Send email receipt asynchronously
        sendOrderConfirmationEmail(user.email, updatedOrder);
      }

      res.json({ success: true, message: "Paid" });
    } else {
          // If payment failed → delete the order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Not  Verified" });
  }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder };




// placeOrder → Saves order + creates Stripe session.

// listOrders → Admin can see all orders.

// userOrders → User can see only their orders.

// updateStatus → Admin updates order status.

// verifyOrder → Confirms or deletes order depending on payment result.
