import React, { useEffect, useState } from 'react'
import { assets, roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate } = useAppContext();

    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);

    const [isAvailable, setIsAvailable] = useState(false);

    // Check if the Room is Available
    const checkAvailability = async () => {
        try {
            if (!checkInDate || !checkOutDate) {
                toast.error('Please select both check-in and check-out dates');
                return;
            }

            if (checkInDate >= checkOutDate) {
                toast.error('Check-In Date should be less than Check-Out Date');
                return;
            }

            const { data } = await axios.post('/api/bookings/check-availability', { room: id, checkInDate, checkOutDate });
            setHasCheckedAvailability(true);
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true);
                    toast.success('Room is available');
                } else {
                    setIsAvailable(false);
                    toast.error('Room is not available');
                }
            } else {
                setIsAvailable(false);
                toast.error(data.message);
            }
        } catch (error) {
            setIsAvailable(false);
            toast.error(error.message);
        }
    }

    const bookRoom = async () => {
        try {
            if (!checkInDate || !checkOutDate) {
                toast.error('Please select your booking dates first');
                return;
            }

            if (!isAvailable) {
                toast.error('Please check availability before booking');
                return;
            }

            const { data } = await axios.post('/api/bookings/book', { room: id, checkInDate, checkOutDate, guests, paymentMethod: "Pay At Hotel" }, { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (data.success) {
                toast.success(data.message);
                navigate('/my-bookings');
                scrollTo(0, 0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const existingRoom = rooms.find(room => room._id === id);
        if (existingRoom) {
            setRoom(existingRoom);
            setMainImage(existingRoom.images[0]);
            setError(null);
            setLoading(false);
            return;
        }

        const fetchRoom = async () => {
            try {
                const { data } = await axios.get(`/api/rooms/${id}`);
                if (data.success) {
                    setRoom(data.room);
                    setMainImage(data.room.images[0]);
                    setError(null);
                    toast.success('Room loaded successfully');
                } else {
                    setError(data.message);
                    toast.error(data.message);
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch room';
                setError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [rooms, id]);

    if (loading) {
        return <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 text-center text-gray-500'>Loading room details...</div>;
    }

    if (error) {
        return <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
            <p className='text-red-600 font-medium mb-4'>Error: {error}</p>
            <p className='text-gray-500 mb-6'>Room ID: {id}</p>
            <button onClick={() => window.location.reload()} className='px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600'>
                Try Again
            </button>
        </div>;
    }

    if (!room) {
        return <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 text-center text-gray-500'>Room not found.</div>;
    }

    const hostImage = room?.hotel?.owner?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(room?.hotel?.owner?.username || 'Host')}&size=64&background=FF6B35&color=fff`;
    const hotelName = room?.hotel?.name || 'Hotel';
    const hotelAddress = room?.hotel?.address || 'Location unavailable';
    const roomImages = room?.images || [];
    const roomAmenities = room?.amenities || [];

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* Room Details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{hotelName} <span className='font-inter text-sm'>({room.roomType})</span></h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt='location-icon' />
                <span>{hotelAddress}</span>
            </div>

            {/* Room Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img className='w-full rounded-xl shadow-lg object-cover'
                        src={mainImage} alt='Room Image' />
                </div>

                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {roomImages.length > 1 && roomImages.map((image, index) => (
                        <img key={index} onClick={() => setMainImage(image)}
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`} src={image} alt='Room Image' />
                    ))}
                </div>
            </div>

            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience Luxury Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {roomAmenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Room Price */}
                <p className='text-2xl font-medium'>${room.pricePerNight ?? '-'} /night</p>
            </div>

            {/* CheckIn CheckOut Form */}
            <form onSubmit={(e) => e.preventDefault()} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor='checkInDate' className='font-medium'>Check-In</label>
                        <input onChange={(e) => { setCheckInDate(e.target.value); setIsAvailable(false); setHasCheckedAvailability(false); }} id='checkInDate' type='date' min={new Date().toISOString().split('T')[0]} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' placeholder='Check-In' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor='checkOutDate' className='font-medium'>Check-Out</label>
                        <input onChange={(e) => { setCheckOutDate(e.target.value); setIsAvailable(false); setHasCheckedAvailability(false); }} id='checkOutDate' type='date' min={checkInDate} disabled={!checkInDate} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' placeholder='Check-Out' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor='guests' className='font-medium'>Guests</label>
                        <input onChange={(e) => setGuests(e.target.value)} value={guests} id='guests' type='number' className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' placeholder='0' required />
                    </div>
                </div>
                <div className='flex flex-col gap-3 md:gap-4 w-full md:w-auto'>
                    <button type='button' onClick={checkAvailability} className='bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md w-full md:w-auto px-6 py-3 text-base cursor-pointer'>Check Availability</button>
                    <button type='button' onClick={bookRoom} disabled={!isAvailable} className={`rounded-md w-full md:w-auto px-6 py-3 text-base transition-all ${isAvailable ? 'bg-primary hover:bg-primary-dull text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>Book Now</button>
                </div>
            </form>
            <div className='mt-4 max-w-6xl text-sm text-gray-600'>
                {!hasCheckedAvailability && <p>Please select your check-in and check-out dates, then click <strong>Check Availability</strong> to see if the room can be booked.</p>}
                {hasCheckedAvailability && isAvailable && <p className='text-green-600'>Great news! This room is available. Click <strong>Book Now</strong> to complete the reservation.</p>}
                {hasCheckedAvailability && !isAvailable && <p className='text-red-600'>This room is not available for the selected dates. Try another date range.</p>}
                <p className='mt-2 text-xs'>Payment is handled after booking on the My Bookings page.</p>
            </div>

            {/* Common Specifications */}
            <div className='mt-25 space-y-4'>                
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img className='w-6.5' src={spec.icon} alt={`${spec.title}-icon`} />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guests will be allocated on the ground floor according to availability. You get a comfortable Two bedroom apartment has a true city feeling. The price quoted is for two guest, at the guest slot please mark the number of guests to get the exact price for groups. The Guests will be allocated ground floor according to availability. You get the comfortable two bedroom apartment that has a true city feeling.</p>
            </div>

            <div className='flex flex-col items-start gap-4'>
                <div className='flex gap-4'>
                    <img className='h-14 w-14 md:h-18 md:w-18 rounded-full' src={hostImage} alt='Host' />
                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {hotelName}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => window.open(`tel:${room?.hotel?.contact || '+1234567890'}`)} className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>
                    Contact Now
                </button>
            </div>
        </div>
    )
}

export default RoomDetails
