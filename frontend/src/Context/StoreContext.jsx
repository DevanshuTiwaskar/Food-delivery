import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import api from "../api/client"; // axios instance

export const StoreContext = createContext(null);

const StoreContextProvider = ({children}) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  // -------------------------------
  // CART FUNCTIONS
  // -------------------------------
  const addToCart = async (itemId) => {
    // optimistic update
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await api.post("/api/cart/add", { itemId }, { headers: { token } });
      } catch (err) {
        console.error("Failed to sync addToCart:", err);
        // rollback if API failed
        setCartItems((prev) => ({
          ...prev,
          [itemId]: prev[itemId] - 1,
        }));
      }
    }
  };

  const removeFromCart = async (itemId) => {
    // optimistic update
    setCartItems((prev) => {
      const newCount = (prev[itemId] || 1) - 1;
      return {
        ...prev,
        [itemId]: newCount > 0 ? newCount : 0,
      };
    });

    if (token) {
      try {
        await api.post("/api/cart/remove", { itemId }, { headers: { token } });
      } catch (err) {
        console.error("Failed to sync removeFromCart:", err);
        // rollback if API failed
        setCartItems((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1,
        }));
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
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

  const loadCartData = async (token) => {
    try {
      const response = await api.post(
        "/api/cart/get",
        {},
        { headers: { token } }
      );
      setCartItems(response.data?.cartData || {});
    } catch (err) {
      console.error("Failed to load cart data:", err);
    }
  };

  // -------------------------------
  // INIT APP
  // -------------------------------
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

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
