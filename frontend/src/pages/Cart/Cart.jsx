import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });

  const cartData = food_list.filter(item => cartItems[item._id] > 0);

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
    <div className='cart container fade-in'>
      <div className="cart-header">
        <h1>Your Gourmet Cart</h1>
        <p className="text-muted">Review your selected delicacies before checkout.</p>
      </div>

      {cartData.length > 0 ? (
        <div className="cart-masonry-wrapper">
          <div className="cart-masonry-grid">
            {cartData.map((item, index) => (
              <div key={index} className="cart-card">
                <div className="cart-card-img">
                  <img src={item.image.startsWith("http") ? item.image : url + "/images/" + item.image} alt={item.name} />
                  <div className="cart-card-badge">₹{item.price}</div>
                </div>
                <div className="cart-card-info">
                  <div className="cart-card-top">
                    <h3>{item.name}</h3>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>×</button>
                  </div>
                  <div className="cart-card-details">
                    <div className="quantity-control">
                      <button onClick={() => removeFromCart(item._id)}>−</button>
                      <span>{cartItems[item._id]}</span>
                      <button onClick={() => addToCart(item._id)}>+</button>
                    </div>
                    <div className="item-total">
                      <p className="label">Total</p>
                      <p className="price">₹{item.price * cartItems[item._id]}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-cart-view">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Treat yourself to something delicious from our menu!</p>
          <button className="return-btn" onClick={() => navigate('/')}>Explore Menu</button>
        </div>
      )}

      {cartData.length > 0 && (
        <div className="cart-summary-section">
          <div className="cart-total-card">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount-row" style={{ color: '#22c55e' }}>
                  <span>Discount ({appliedPromo?.type === 'PERCENT' ? '10%' : '₹50 Flat'})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/order')}>
              Proceed to Checkout
            </button>
          </div>

          <div className="promo-card">
            <p>Have a promo code?</p>
            <div className='promo-input-group'>
              <input 
                type="text" 
                placeholder='Enter code here (e.g. DISCOUNT10)' 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={handleApplyPromo}>Apply</button>
            </div>
            {promoMessage.text && (
              <p className={`promo-message ${promoMessage.type === 'error' ? 'text-danger' : 'text-success'}`} style={{ marginTop: '10px', fontSize: '0.9rem', color: promoMessage.type === 'error' ? '#ef4444' : '#22c55e' }}>
                {promoMessage.text}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
