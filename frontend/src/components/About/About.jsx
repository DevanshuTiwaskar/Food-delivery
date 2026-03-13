import React, { memo, useMemo } from 'react'
import './About.css'

const About = memo(() => {
  const features = useMemo(() => [
    {
      icon: "🛵",
      title: "Lightning Fast",
      description: "Our delivery partners are optimized to get your food to you while it's still piping hot."
    },
    {
      icon: "🍃",
      title: "Fresh Quality",
      description: "We partner with the best local restaurants that use only the finest, freshest ingredients."
    },
    {
      icon: "🍱",
      title: "Diverse Menu",
      description: "From local favorites to international cuisines, find exactly what you're craving for."
    }
  ], []);

  return (
    <section className='about container' id='about'>
      <div className='about-header'>
        <span className='about-badge'>ABOUT US</span>
        <h2>Why Choose <span className='highlight-text'>Cravely</span>?</h2>
        <p className='about-subtitle'>
          We're more than just a food delivery service. We're a gateway to your favorite culinary experiences, delivered with passion and precision.
        </p>
      </div>

      <div className='about-content'>
        <div className='about-grid'>
          {features.map((feature, index) => (
            <div className='about-card' key={index}>
              <div className='card-icon'>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className='about-stats-banner'>
          <div className='stat-box'>
            <span className='stat-num'>50k+</span>
            <span className='stat-txt'>Happy Users</span>
          </div>
          <div className='stat-divider'></div>
          <div className='stat-box'>
            <span className='stat-num'>100+</span>
            <span className='stat-txt'>Top Chefs</span>
          </div>
          <div className='stat-divider'></div>
          <div className='stat-box'>
            <span className='stat-num'>4.9★</span>
            <span className='stat-txt'>User Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
})

export default About
