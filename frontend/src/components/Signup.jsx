import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8000/api/v1/user/register", user, {
                headers: {
                    "content-type": "application/json"
                }, withCredentials: true
            }
            )
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            setLoading(false)
        }
    }
    const changeHandler = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={onSubmitHandler} className='shadow-lg  flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Sign up to see photos and video for your friend</p>
                </div>
                <div>
                    <span className='font-medium'>name</span>
                    <Input type='text'
                        className=" focus-visible:ring-transparent my-2"
                        name='name' onChange={changeHandler}
                    />
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input type='email'
                        className=" focus-visible:ring-transparent my-2"
                        name='email' onChange={changeHandler}
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input type='password'
                        className=" focus-visible:ring-transparent my-2"
                        name='password' onChange={changeHandler}
                    />
                </div>
                <div>
                    <div className='flex flex-col gap-2'>
                        <span className='font-medium'>Role</span>
                        <div className='flex gap-4'>
                            <label>
                                <input type="radio" name="role" value="portManager" onChange={changeHandler} />
                                PortManager
                            </label>
                            <label>
                                <input type="radio" name="role" value="shipOwner" onChange={changeHandler} />
                                ShipOwner
                            </label>
                        </div>
                    </div>
                </div>
                {
                    loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin mr-2" /> Loading...
                        </Button>
                        :
                        <Button type="submit">Signup</Button>
                }
                <span className='text-center'>Already have an account? <Link to="/login">login</Link> </span>
            </form >
        </div >
    )
}

export default Signup