// controllers/userController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

// -------------------- Helper --------------------
async function createUser({
  username,
  email,
  fullName: { firstName, lastName },
  password,
  role = "user",
}) {
  // ✅ Validate inputs
  if (!username || !email || !firstName || !lastName || !password) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // ✅ Check if user exists
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    throw new Error("User already exists");
  }

  // ✅ Hash password
  const hash = await bcrypt.hash(password, 10);

  // ✅ Create user
  const user = await userModel.create({
    username,
    email,
    fullName: {
      firstName,
      lastName,
    },
    password: hash,
    role,
  });

  // ✅ Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { user, token };
}

// -------------------- Controllers --------------------

// login
async function loginUser(req, res) {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({
      message: "Email/username and password are required",
    });
  }

  const user = await userModel
    .findOne({
      $or: [{ username }, { email }],
    })
    .select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid username or email",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use true in prod (HTTPS)
    sameSite: "None",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

// register normal user
async function registerUser(req, res) {
  const { email, fullName, name, username, password } = req.body;
  const displayName = fullName || name || "";
  const parts = displayName.trim().split(" ");
  const firstName = parts[0] || "User";
  const lastName = parts.slice(1).join(" ") || "Default";
  const finalUsername = username || email.split("@")[0] + Math.floor(Math.random() * 1000);

  try {
    const { user, token } = await createUser({
      username: finalUsername,
      fullName: { firstName, lastName },
      email,
      password,
      role: "user",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        username: user.username,
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// register seller
async function registerSeller(req, res) {
  const { email, fullName, name, username, password } = req.body;
  const displayName = fullName || name || "";
  const parts = displayName.trim().split(" ");
  const firstName = parts[0] || "Seller";
  const lastName = parts.slice(1).join(" ") || "Owner";
  const finalUsername = username || email.split("@")[0] + "_admin";

  try {
    const { user: seller, token } = await createUser({
      username: finalUsername,
      email,
      fullName: { firstName, lastName },
      password,
      role: "seller",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      token,
      user: {
        username: seller.username,
        fullName: seller.fullName,
        _id: seller._id,
        email: seller.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// logout
function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 0,
  });
  res.status(200).json({ success: true, message: "Logged out" });
}

export { loginUser, registerUser, registerSeller, logout };
