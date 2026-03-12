import { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'

const FoodItem = ({ image, name, price, desc, id }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)

  return (
    <div className='food-item-card'>
      <div className='food-item-img-box'>
        <img
          className='food-item-main-img'
          src={image.startsWith("http") ? image : url + "/images/" + image}
          alt={name}
          loading='lazy'
        />

        {/* Price Badge */}
        <div className="food-item-price-badge">
          ₹{price}
        </div>

        {/* Counter Overlay */}
        <div className="food-item-controls">
          {!cartItems[id] ? (
            <button className="add-btn-floating" onClick={() => addToCart(id)}>
              <img src={assets.add_icon_white} alt='Add' />
            </button>
          ) : (
            <div className='food-item-counter-glass'>
              <button onClick={() => removeFromCart(id)}>
                <img src={assets.remove_icon_red} alt='Remove' />
              </button>
              <span>{cartItems[id]}</span>
              <button onClick={() => addToCart(id)}>
                <img src={assets.add_icon_green} alt='Add' />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='food-item-details'>
        <div className='food-item-header'>
          <h3>{name}</h3>
          <div className='rating-stars'>
            <img src={assets.rating_starts} alt='Rating stars' />
          </div>
        </div>
        <p className='food-item-description'>{desc}</p>
      </div>
    </div>
  )
}

export default FoodItem
