import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoIosSave } from "react-icons/io";

function Page1() {
    const webRefs = useRef([]);
    const passRefs = useRef([]);
    const [form, setForm] = useState({ Name: "", Pass: "", })
    const [loading, setLoading] = useState(true);
    const [passwords, setPasswords] = useState([]);
    const [editStates, setEditStates] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const getPasswords = async () => {
        try {
            const res = await axios.get('https://key-manager-backend-delta.vercel.app/passwords', {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            setPasswords(res.data.allPasswords.allData)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const handleADD = async () => {
        if (form.Name === "" || form.Pass === "") {
            return alert("Name or Password is empty")
        }
        try {
            const res = await axios.post('https://key-manager-backend-delta.vercel.app/save', form, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            getPasswords();
        } catch (e) {
            console.log(e)
        }
    }

    const addRefWeb = (ref) => {
        if (ref && !webRefs.current.includes(ref)) {
            webRefs.current.push(ref);
        }
    }

    const addRefPass = (ref) => {
        if (ref && !passRefs.current.includes(ref)) {
            passRefs.current.push(ref);
        }
    }

    const toggleEdit = (id) => {
        setEditStates((prevStates) => ({
            ...prevStates,
            [id]: !prevStates[id]
        }));
    }
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`https://key-manager-backend-delta.vercel.app/delete/${id}`, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })

            let newPass = []
            for (let i = 0; i < passwords.length; i++) {
                if (passwords[i]._id !== id) {
                    newPass.push(passwords[i])
                }
            }
            setPasswords([])
            getPasswords()
            // toggleEdit(id);
        } catch (e) {
            console.log(e)
        }
    }
    const handleSave = async (id, index) => {
        const updatedWeb = webRefs.current[index].value;
        const updatedPass = passRefs.current[index].value;

        try {
            const res = await axios.put(`https://key-manager-backend-delta.vercel.app/update/${id}`, { updatedWeb, updatedPass }, {
                headers: {
                    "token": localStorage.getItem('token')
                }
            })
            setPasswords(res.data.allPasswords.allData)
            toggleEdit(id);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getPasswords();
    }, [])
    return (
        <div className='min-h-[91vh] pt-8 bg-gray-200'>
            <div className='text-green-700 flex flex-col items-center gap-8 px-4 md:px-0'>
                <h1 className='text-4xl md:text-6xl'>Keeper</h1>
                <p className='text-xl md:text-2xl'>Your Own Personal Password Manager.</p>
            </div>
            <div className='text-green-800 flex flex-col items-center justify-start mt-4 gap-4 px-4 md:px-0'>
                <input
                    onChange={handleChange}
                    value={form.Name}
                    name='Name'
                    className='w-full md:w-2/3 h-10 p-3 rounded-md border-[1px] border-green-400 text-black focus:outline-none focus:ring-2 focus:ring-green-500'
                    type="text"
                    placeholder='Website Name' />
                <input
                    onChange={handleChange}
                    value={form.Pass}
                    name='Pass'
                    className='w-full md:w-2/3 h-10 p-3 rounded-md border-[1px] border-green-400 text-black focus:outline-none focus:ring-2 focus:ring-green-500'
                    type="password"
                    placeholder='Website Password' />
                <div className='flex w-full md:w-2/3 justify-end'>
                    <button className='bg-green-500 px-4 py-2 rounded-md text-lg font-semibold text-white hover:bg-green-600' onClick={handleADD}>Add Password</button>
                </div>
            </div>
            <div className='text-green-800 mt-8 text-center text-xl md:text-2xl font-bold'>
                ALL PASSWORDS
            </div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className='flex justify-center mt-8 px-4 md:px-0'>
                    <table className='w-full md:w-2/3'>
                        <thead>
                            <tr className='text-green-700 text-lg md:text-xl'>
                                <th className='font-medium'>Website Name</th>
                                <th className='font-medium'>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwords.length > 0 && passwords.map((pass, i) => (
                                <tr key={i} className='text-base md:text-lg text-center relative md:left-16 '>
                                    <td>
                                        <input
                                            ref={addRefWeb}
                                            disabled={!editStates[pass._id]}
                                            defaultValue={pass.Name}
                                            className=' w-20 md:w-2/3'
                                        />
                                    </td>
                                    <td>
                                        <input
                                            ref={addRefPass}
                                            disabled={!editStates[pass._id]}
                                            defaultValue={pass.Pass}
                                            className=' w-20 md:w-2/3'
                                        />
                                    </td>
                                    <td>
                                        <MdDelete
                                            onClick={() => handleDelete(pass._id)}
                                            className='text-red-400 hover:text-red-700 text-2xl md:text-3xl hover:cursor-pointer'
                                        />
                                    </td>
                                    {editStates[pass._id] ? (
                                        <td>
                                            <IoIosSave
                                                onClick={() => handleSave(pass._id, i)}
                                                className='text-green-600 text-4xl md:text-5xl pl-4 hover:text-green-800 hover:cursor-pointer'
                                            />
                                        </td>
                                    ) : (
                                        <td>
                                            <CiEdit
                                                onClick={() => toggleEdit(pass._id)}
                                                className='text-blue-400 rounded-lg hover:text-blue-700 text-4xl md:text-5xl hover:cursor-pointer pl-4'
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    )
}

export default Page1
