import React from 'react'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {

    const { hotel } = useAppContext();

    return (
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
            <div className="flex items-center gap-4">
                <Link to="/">
                    <img className="h-9 invert opacity-80" src={assets.logo} alt="logo" />
                </Link>
                {hotel && (
                    <div className="text-lg font-medium text-gray-700">
                        {hotel.name}
                    </div>
                )}
            </div>
            <UserButton />
        </div>
    )
}

export default Navbar