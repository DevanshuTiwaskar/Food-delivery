import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { menu_list } from "../assets/assets";
import api from "../api/client"; // axios instance

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [serverAwake, setServerAwake] = useState(true); // Track if server is cold-starting
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  // -------------------------------
  // API CALLS
  // -------------------------------
  const fetchFoodList = useCallback(async () => {
    const startTime = Date.now();
    let wakeupShown = false;

    // If the request takes more than 5 seconds, assume cold start
    const wakeupTimer = setTimeout(() => {
      wakeupShown = true;
      setServerAwake(false);
    }, 5000);

    try {
      const response = await api.get("/api/food/list");
      setFoodList(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    } finally {
      clearTimeout(wakeupTimer);
      if (wakeupShown) {
        // Small delay so the "connected" state is visible to user
        setTimeout(() => setServerAwake(true), 800);
      }
    }
  }, []);

  const loadCartData = useCallback(async (authToken) => {
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
  }, []);

  // -------------------------------
  // CART FUNCTIONS
  // -------------------------------
  const addToCart = useCallback(async (itemId) => {
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
          const rollback = { ...prev, [itemId]: (prev[itemId] || 1) - 1 };
          if (rollback[itemId] <= 0) delete rollback[itemId];
          localStorage.setItem("cart", JSON.stringify(rollback));
          return rollback;
        });
      }
    }
  }, [token]);

  const removeFromCart = useCallback(async (itemId) => {
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
  }, [token]);

  const getTotalCartAmount = useCallback(() => {
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
  }, [cartItems, food_list]);

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
          try {
            setCartItems(JSON.parse(localCart));
          } catch (e) {
            console.error("Failed to parse local cart", e);
          }
        }
      }
    }
    loadData();
  }, [fetchFoodList, loadCartData]);

  // Listen for session expiration
  useEffect(() => {
    const handleSessionExpired = () => {
      setToken("");
      setUserData(null);
      setCartItems({});
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("adminToken");
      toast.error("Session expired. Please log in again.");
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => window.removeEventListener("session-expired", handleSessionExpired);
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
  const contextValue = useMemo(() => ({
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
    serverAwake,
  }), [food_list, cartItems, addToCart, removeFromCart, getTotalCartAmount, token, userData, loadCartData, serverAwake]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
