import{ useState, useEffect } from 'react'

import "./Header.css"

const Header = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const handleViewMenu = () => {
        // Smooth scroll to menu section
        const menuSection = document.getElementById('menu') || document.querySelector('[data-section="menu"]');
        if (menuSection) {
            menuSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className='header'>
            {/* Background overlay for better text readability */}
            <div className='header-overlay'></div>
            
            {/* Floating elements for visual appeal */}
            <div className='floating-elements'>
                <div className='floating-element element-1'>🍕</div>
                <div className='floating-element element-2'>🍔</div>
                <div className='floating-element element-3'>🍜</div>
                <div className='floating-element element-4'>🥗</div>
            </div>
            
            <div className={`header-contents ${isVisible ? 'animate-in' : ''}`}>
                <div className='header-badge'>
                    <span>✨ New Menu Available</span>
                </div>
                
                <h1 className='header-title'>
                    Order your 
                    <span className='highlight'> favourite food </span>
                    here
                </h1>
                
                <p className='header-description'>
                    Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
                </p>
                
                <div className='header-actions'>
                    <button className='btn-primary' onClick={handleViewMenu}>
                        <span>View Menu</span>
                        <svg className='btn-icon' width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    <button className='btn-secondary'>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch Demo
                    </button>
                </div>
                
                <div className='header-stats'>
                    <div className='stat-item'>
                        <span className='stat-number'>1000+</span>
                        <span className='stat-label'>Happy Customers</span>
                    </div>
                    <div className='stat-divider'></div>
                    <div className='stat-item'>
                        <span className='stat-number'>500+</span>
                        <span className='stat-label'>Delicious Dishes</span>
                    </div>
                    <div className='stat-divider'></div>
                    <div className='stat-item'>
                        <span className='stat-number'>4.8★</span>
                        <span className='stat-label'>Customer Rating</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
