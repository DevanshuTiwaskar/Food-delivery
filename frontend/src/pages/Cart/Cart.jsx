import React, { useContext, useState, useMemo } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });

  // Memoized cart data for performance
  const cartData = useMemo(() => {
    return food_list.filter(item => cartItems[item._id] > 0);
  }, [food_list, cartItems]);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME50') {
      setAppliedPromo({ type: 'FLAT', value: 50 });
      setPromoMessage({ text: '₹50 discount applied!', type: 'success' });
    } else if (code === 'DISCOUNT10') {
      setAppliedPromo({ type: 'PERCENT', value: 10 });
      setPromoMessage({ text: '10% discount applied!', type: 'success' });
    } else {
      setAppliedPromo(null);
      setPromoMessage({ text: 'Invalid promo code.', type: 'error' });
    }
  };

  const getDiscountAmount = () => {
    const subtotal = getTotalCartAmount();
    if (!appliedPromo || subtotal === 0) return 0;
    if (appliedPromo.type === 'FLAT') {
      return Math.min(appliedPromo.value, subtotal);
    } else if (appliedPromo.type === 'PERCENT') {
      return (subtotal * appliedPromo.value) / 100;
    }
    return 0;
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 40;
  const discountAmount = getDiscountAmount();
  const finalTotal = subtotal + deliveryFee - discountAmount;

  return (
    <div className='cart-page fade-in'>
      <div className="cart-header-nav">
        <button className="back-to-menu" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back to Menu
        </button>
      </div>
      {cartData.length > 0 ? (
        <div className="cart-content-grid">
          {/* Items List */}
          <div className="cart-items-section">
            <div className="cart-items-list">
              {cartData.map((item, index) => (
                <div key={item._id} className="cart-item-card premium-card">
                  <div className="item-img-box">
                    <img src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image} alt={item.name} />
                  </div>
                  <div className="item-info-box">
                    <div className="item-title-row">
                      <h3>{item.name}</h3>
                      <p className="item-category text-muted">{item.category || "Main Course"}</p>
                    </div>
                    <div className="item-price-row">
                       <span className="unit-price">₹{item.price}</span>
                       <div className="quantity-controls-premium">
                          <button onClick={() => removeFromCart(item._id)} className="qty-btn">−</button>
                          <span className="qty-val">{cartItems[item._id]}</span>
                          <button onClick={() => addToCart(item._id)} className="qty-btn">+</button>
                       </div>
                       <span className="item-total-price">₹{item.price * cartItems[item._id]}</span>
                    </div>
                  </div>
                  <button className="delete-item-btn" onClick={() => removeFromCart(item._id, true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Side Summary */}
          <div className="cart-summary-section">
            <div className="summary-card premium-glass">
              <h3>Order Summary</h3>
              <div className="summary-list">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-item discount-item">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-item total-item">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="promo-section-premium">
                <p className="promo-label">Promo Code</p>
                <div className="promo-box">
                  <input 
                    type="text" 
                    placeholder="Promo code (WELCOME50 / DISCOUNT10)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo}>Apply</button>
                </div>
                {promoMessage.text && (
                  <p className={`promo-feedback ${promoMessage.type}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              <button className="checkout-btn-premium" onClick={() => navigate('/order')}>
                Secure Checkout
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart-premium">
          <div className="empty-visual">
             <div className="empty-circle">
                <span className="empty-emoji">🍲</span>
             </div>
          </div>
          <h2>Your cart is longing for flavor</h2>
          <p>Discover our curated selection of gourmet dishes and start your culinary journey.</p>
          <button className="explore-btn-premium" onClick={() => navigate('/')}>
            Explore Menu
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart
