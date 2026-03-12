import { useContext, useState, useEffect } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Filter foods based on category
  const filteredFoods = food_list.filter(
    (item) => category === "All" || category === item.category
  );

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredFoods.slice(offset, offset + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById("food-display")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="food-display container" id="food-display">
      <div className="food-display-header">
        <h2>Top dishes near you</h2>
        <p className="text-secondary">Handpicked selections to satisfy every palate.</p>
      </div>

      <div className="food-masonry-wrapper">
        <div className="food-display-list">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <FoodItem
                key={item._id}
                image={item.image}
                name={item.name}
                desc={item.description}
                price={item.price}
                id={item._id}
              />
            ))
          ) : (
            <div className="no-foods-card">
              <span>🤷‍♂️</span>
              <p>No items available in this category yet.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
