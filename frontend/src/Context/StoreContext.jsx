import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import api from "../api/client"; // axios instance

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  // -------------------------------
  // CART FUNCTIONS
  // -------------------------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        await api.post(
          "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to sync addToCart:", err);
        // rollback
        setCartItems((prev) => {
          const rollback = { ...prev, [itemId]: prev[itemId] - 1 };
          if (rollback[itemId] <= 0) delete rollback[itemId];
          localStorage.setItem("cart", JSON.stringify(rollback));
          return rollback;
        });
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCount = (prev[itemId] || 0) - 1;
      const updated = { ...prev };
      if (newCount > 0) {
        updated[itemId] = newCount;
      } else {
        delete updated[itemId];
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    if (token) {
      try {
        await api.post(
          "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to sync removeFromCart:", err);
        // rollback
        setCartItems((prev) => {
          const rollback = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
          localStorage.setItem("cart", JSON.stringify(rollback));
          return rollback;
        });
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  // -------------------------------
  // API CALLS
  // -------------------------------
  const fetchFoodList = async () => {
    try {
      const response = await api.get("/api/food/list");
      setFoodList(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    }
  };

  const loadCartData = async (authToken) => {
    try {
      const response = await api.post(
        "/api/cart/get",
        {},
        { headers: { token: authToken } }
      );
      setCartItems(response.data?.cartData || {});
    } catch (err) {
      console.error("Failed to load cart data:", err);
    }
  };

  // -------------------------------
  // EFFECTS
  // -------------------------------
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
        await loadCartData(localToken);
      } else {
        const localCart = localStorage.getItem("cart");
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setUserData(null);
    }
  }, [token]);

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  // -------------------------------
  // CONTEXT VALUE
  // -------------------------------
  const contextValue = {
    food_list,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    userData,
    setUserData,
    loadCartData,
    setCartItems,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
