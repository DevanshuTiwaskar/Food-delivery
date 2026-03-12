// Food Delivery Backend Server
import 'dotenv/config'

import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import Router from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import analyticsRouter from "./routes/analyticsRoute.js"
import { Server } from "socket.io";
import http from "http";

// app config
const app = express()
const server = http.createServer(app);

// initialize socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "https://food-delivery-one-tau.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("A user connected via WebSockets:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io }; // Export io to emit events from controllers

const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://food-delivery-one-tau.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



// db connection
connectDB()

// api endpoints
app.use("/api", Router)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/analytics", analyticsRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });

server.listen(port, () => console.log(`Server started on http://localhost:${port}`))
