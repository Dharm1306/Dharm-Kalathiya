import React, { useEffect, useState } from 'react'
import { assets, roomCommonData } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { facilityIcons, rooms, getToken, axios, navigate, user } = useAppContext();

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
                return false;
            }

            if (new Date(checkInDate) >= new Date(checkOutDate)) {
                toast.error('Check-In date should be before Check-Out date');
                return false;
            }

            const { data } = await axios.post('/api/bookings/check-availability', {
                roomId: id,
                hotelId: room?.hotel?._id,
                checkInDate,
                checkOutDate,
            });

            setHasCheckedAvailability(true);
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true);
                    toast.success('Room is available');
                    return true;
                } else {
                    setIsAvailable(false);
                    toast.error('Room is not available');
                    return false;
                }
            } else {
                setIsAvailable(false);
                toast.error(data.message || 'Availability check failed');
                return false;
            }
        } catch (error) {
            setIsAvailable(false);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to check availability';
            toast.error(errorMsg);
            return false;
        }
    }

    const bookRoom = async () => {
        try {
            if (!user) {
                toast.error('Please sign in to complete your booking');
                return;
            }

            if (!checkInDate || !checkOutDate) {
                toast.error('Please select your booking dates first');
                return;
            }

            const available = await checkAvailability();
            if (!available) {
                return;
            }

            const token = await getToken();
            const guestsNumber = Math.max(1, Number(guests) || 1);

            const { data } = await axios.post(
                '/api/bookings/book',
                {
                    roomId: id,
                    hotelId: room?.hotel?._id,
                    checkInDate,
                    checkOutDate,
                    guests: guestsNumber,
                    paymentMethod: "Pay At Hotel"
                },
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                navigate('/my-bookings');
                window.scrollTo(0, 0);
            } else {
                toast.error(data.message || 'Booking failed');
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.response?.data?.error || JSON.stringify(error.response?.data);
            const errorMsg = backendMessage || error.message || 'Failed to book room';
            console.error('Booking request error:', {
                responseData: error.response?.data,
                status: error.response?.status,
                errorMessage: error.message,
            });
            toast.error(errorMsg);
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
            {/* ...rest of the component... */}
        </div>
    )
}

export default RoomDetails