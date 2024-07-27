import React from 'react'
import logo from '../assets/logo.ico'
import { useNavigate } from 'react-router-dom';
function Navbar() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('token');
        return navigate('/')
    }
    const handle = () => {
        return navigate(0)
    }
    return (
        <div className='border-b-[1px] pb-3'>
            <nav className=' container flex m-auto justify-between pt-8 px-8 md:px-0'>
                <h1
                    onClick={handle}
                    className='text-4xl text-green-500 font-mono hover:cursor-pointer'>Keeper</h1>

                <button
                    onClick={handleLogout}
                    className='text-red-500 hover:text-red-700 text-md'>Log Out</button>
            </nav>
        </div>
    )
}

export default Navbar