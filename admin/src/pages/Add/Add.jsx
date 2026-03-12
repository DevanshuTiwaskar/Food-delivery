import { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import api from "../../assets/assets"; // axios instance
import { toast } from "react-toastify";

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) return toast.error("Please upload an image!");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);

      const response = await api.post("/api/food/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("✅ Food Added Successfully!");
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(null);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="add-container">
      <div className="page-header">
        <h2 className="heading-xl">Add New Product</h2>
        <p className="text-secondary">Create a new delicious item for your menu.</p>
      </div>

      <form className="add-form-card card" onSubmit={onSubmitHandler}>
        <div className="form-grid">
          {/* Left Column: Image Upload */}
          <div className="upload-section">
            <p className="form-label">Product Image</p>
            <label htmlFor="image" className="image-dropzone">
              <img
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt="preview"
                className={!image ? "placeholder-icon" : "uploaded-img"}
              />
              <div className="upload-overlay">
                <span>{image ? "Replace Image" : "Click to Upload"}</span>
              </div>
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
            <p className="upload-hint">Recommended size: 800x600px. JPG, PNG formats.</p>
          </div>

          {/* Right Column: Details */}
          <div className="details-section">
            <div className="form-field">
              <label className="form-label">Product Name</label>
              <input
                className="form-input"
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder="Ex. Mediterranean Salad"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                onChange={onChangeHandler}
                value={data.description}
                rows={4}
                placeholder="Describe the taste, ingredients, etc."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  onChange={onChangeHandler}
                  value={data.category}
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Desserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Price (₹)</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    className="form-input price-input"
                    type="number"
                    name="price"
                    onChange={onChangeHandler}
                    value={data.price}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    Publish Item
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Add;
