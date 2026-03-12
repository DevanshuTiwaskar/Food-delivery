import { useEffect, useState } from "react";
import "./List.css";
import api from "../../assets/assets"; // axios instance
import { toast } from "react-toastify";

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/food/list");
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await api.post("/api/food/remove", { id: foodId });
      await fetchList();
      if (response.data.success) {
        toast.success("Item removed successfully");
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-container">
      <div className="page-header">
        <h2 className="heading-xl">Menu Inventory</h2>
        <p className="text-secondary">Manage and monitor all your food items in one place.</p>
      </div>

      <div className="list-card card">
        <div className="list-table">
          <div className="list-table-header">
            <div className="col-img">Preview</div>
            <div className="col-name">Product Details</div>
            <div className="col-cat">Category</div>
            <div className="col-price">Price</div>
            <div className="col-action">Action</div>
          </div>

          {loading && (
            <div className="table-loading">
              <div className="loading-spinner colored"></div>
              <p>Fetching inventory...</p>
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="table-empty">
              <span>📭</span>
              <p>No products found. Start by adding a new item!</p>
            </div>
          )}

          {!loading && list.map((item, index) => (
            <div key={index} className="list-table-row">
              <div className="col-img">
                <div className="img-wrapper">
                  <img src={item.image.startsWith("http") ? item.image : `${api.defaults.baseURL}/images/` + item.image} alt={item.name} />
                </div>
              </div>
              <div className="col-name">
                <p className="item-name">{item.name}</p>
                <p className="item-id">ID: {item._id.slice(-6)}</p>
              </div>
              <div className="col-cat">
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="col-price">
                <p className="price-text">₹{item.price}</p>
              </div>
              <div className="col-action">
                <button className="delete-btn" title="Delete Item" onClick={() => removeFood(item._id)}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
