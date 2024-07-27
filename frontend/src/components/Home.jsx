import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Page1 from './Page1'
import { useNavigate } from 'react-router-dom'
function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return navigate('/')
        }
    })
    return (
        <div>
            <Navbar />
            <Page1 />
        </div>
    )
}

export default Home