import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.ico'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import Loader from './Loader';
function Login() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const handleSubmit = async () => {
        if (name == "" || password == "") {
            return alert('please enter Name or Password')
        }
        try {
            setLoading(true)
            const res = await axios.post('https://key-manager-backend-delta.vercel.app/login', {
                name, password
            })
            setLoading(false)
            localStorage.setItem('token', res.data.token);
            if (res.data.status == 201) {
                notify(res.data.msg)
            }
            if (res.data.status == 200) {
                return navigate('/home')
            }

        } catch (e) {
            console.log(e)
        }
    }
    const notify = (msg) => toast.error(msg);
    return (
        <>
            <ToastContainer />
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className='border-b-[1px] pb-3'>
                        <nav className=' container flex m-auto justify-between pt-8 px-4 md:px-0'>
                            <h1 className='text-4xl text-green-500 font-mono'>Keeper</h1>
                            <div className='flex gap-6'>

                                <button className='bg-green-500 px-4 rounded-lg text-white hover:bg-green-700'><Link to={'/'}>Log In</Link></button>


                                <button className='text-green-700 hover:text-green-900'><Link to={'/signup'}>Sign Up</Link></button>


                            </div>
                        </nav>
                    </div>

                    <div className='flex flex-col pt-4 gap-16 items-center h-[91vh] bg-gray-200'>
                        <div className='flex justify-center flex-col items-center md:mb-8'>

                            <img src="https://cdn.pixabay.com/animation/2023/06/13/15/12/15-12-30-710_512.gif" className='md:w-36 w-24 pb-8 md:pb-0' />
                            <h1 className='text-3xl font-semibold mb-4 text-center'>Say Goodbye to Password Fatigue.</h1>
                            <h2 className='text-xl text-gray-700 text-center'>Keep your passwords secure and accessible with Keeper.</h2>
                        </div>
                        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm'>
                            <h2 className='text-4xl flex justify-center items-center gap-3 text-green-500 mb-6 font-mono'>
                                <img src={logo} alt="Keeper Logo" />
                                Keeper
                            </h2>
                            <div className='mb-4'>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='shadow-sm rounded w-full py-2 px-3  border-green-400 text-black focus:outline-none focus:ring-2 focus:ring-green-500' type='text' placeholder='Username' />
                            </div>
                            <div className='mb-6'>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='shadow-sm rounded w-full py-2 px-3  border-green-400 text-black focus:outline-none focus:ring-2 focus:ring-green-500' type='password' placeholder='Password' />
                            </div>
                            <div className='flex items-center justify-between'>
                                <button
                                    onClick={handleSubmit}
                                    className='bg-green-500 hover:bg-green-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'>
                                    Log In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login