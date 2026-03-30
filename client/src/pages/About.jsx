import React from 'react'
import Title from '../components/Title'

const About = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Title title="About QuickStay" subtitle="Your trusted partner for hotel bookings" />
      <div className='max-w-3xl mx-auto text-center'>
        <p className='text-gray-600 mb-6'>
          QuickStay is a modern hotel booking platform that connects travelers with the best accommodations worldwide.
          We strive to provide seamless booking experiences with competitive prices and excellent customer service.
        </p>
        <p className='text-gray-600'>
          Whether you're planning a business trip, family vacation, or weekend getaway, QuickStay makes it easy to find
          and book the perfect hotel room that meets your needs.
        </p>
      </div>
    </div>
  )
}

export default About