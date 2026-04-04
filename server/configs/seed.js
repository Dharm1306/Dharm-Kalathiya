import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

const sampleHotel = {
  name: 'Sunset Paradise Hotel',
  address: '123 Ocean Drive, Miami',
  contact: '+1 305 555 0123',
  city: 'Miami',
  owner: 'sample-owner-id',
};

const sampleRooms = [
  {
    roomType: 'Luxury Room',
    pricePerNight: 450,
    amenities: ['Free WiFi', 'Free Breakfast', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    roomType: 'Family Suite',
    pricePerNight: 780,
    amenities: ['Free WiFi', 'Mountain View', 'Pool Access'],
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

export const seedSampleData = async () => {
  try {
    const hotelCount = await Hotel.countDocuments();
    const roomCount = await Room.countDocuments();

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
