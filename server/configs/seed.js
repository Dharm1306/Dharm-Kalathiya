import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import User from '../models/User.js';

const sampleUser = {
  _id: 'demo-hotel-owner-user',
  username: 'demohotelowner',
  email: 'owner@demohotel.com',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
  role: 'hotelOwner',
  recentSearchedCities: [],
};

const sampleHotel = {
  name: 'Sunset Paradise Hotel',
  address: '123 Ocean Drive, Miami',
  contact: '+1 305 555 0123',
  city: 'Miami',
  owner: 'demo-hotel-owner-user', // Reference to actual user now
};

const sampleRooms = [
  {
    roomType: 'Luxury Room',
    pricePerNight: 450,
    amenities: ['Free WiFi', 'Free Breakfast', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307038-da0ec8d70c9b?auto=format&fit=crop&w=1200&q=80',
    ],
    isAvailable: true,
  },
  {
    roomType: 'Family Suite',
    pricePerNight: 780,
    amenities: ['Free WiFi', 'Mountain View', 'Pool Access'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506413-bc45dead85ed?auto=format&fit=crop&w=1200&q=80',
    ],
    isAvailable: true,
  },
  {
    roomType: 'Standard Room',
    pricePerNight: 250,
    amenities: ['Free WiFi', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1631049307038-da0ec8d70c9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537875411079-5a0a826e7d66?auto=format&fit=crop&w=1200&q=80',
    ],
    isAvailable: true,
  },
];

export const seedSampleData = async () => {
  try {
    const userExists = await User.findById('demo-hotel-owner-user');
    const hotelCount = await Hotel.countDocuments();
    const roomCount = await Room.countDocuments();

    if (!userExists) {
      console.log('Creating demo user...');
      await User.create(sampleUser);
      console.log('Demo user created successfully.');
    }

    if (hotelCount === 0 && roomCount === 0) {
      console.log('Seeding sample hotel and room data for development...');
      const hotel = await Hotel.create(sampleHotel);
      const roomsToCreate = sampleRooms.map((room) => ({
        ...room,
        hotel: hotel._id.toString(),
      }));
      await Room.create(roomsToCreate);
      console.log('Sample data seeded successfully.');
    }
  } catch (error) {
    console.error('Failed to seed sample data:', error.message);
  }
};
