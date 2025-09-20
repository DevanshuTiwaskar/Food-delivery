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
    <div className="add">
      <form className="add-form" onSubmit={onSubmitHandler}>
        {/* Upload Section */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image" className="image-upload-label">
            <img
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt="preview"
              className="preview-img"
            />
            <span className="upload-text">
              {!image ? "Choose File" : "Change"}
            </span>
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
        </div>

        {/* Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            name="name"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            placeholder="Type here..."
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={data.description}
            rows={5}
            placeholder="Write content here..."
            required
          />
        </div>

        {/* Category + Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select
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
          <div className="add-price flex-col">
            <p>Price (₹)</p>
            <input
              type="number"
              name="price"
              onChange={onChangeHandler}
              value={data.price}
              placeholder="e.g. 250"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Adding..." : "➕ Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
