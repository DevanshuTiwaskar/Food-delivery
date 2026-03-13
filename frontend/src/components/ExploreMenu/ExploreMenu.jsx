import { useContext, memo } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = memo(({ category, setCategory }) => {

  const { menu_list } = useContext(StoreContext);

  return (
    <div className='explore-menu container' id='menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes.
        Our mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>

      <div className="explore-menu-list-wrapper">
        <div className="explore-menu-list">
          {menu_list.map((item, index) => {
            const isActive = category === item.menu_name;
            return (
              <div
                onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                key={index}
                className={`explore-menu-list-item ${isActive ? "active-item" : ""}`}
              >
                <div className="category-img-container">
                  <img src={item.menu_image} alt={item.menu_name} />
                </div>
                <p>{item.menu_name}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="scroll-hint">
        <span>↔ Scroll to explore categories</span>
      </div>

      <hr />
    </div>
  )
})

export default ExploreMenu
