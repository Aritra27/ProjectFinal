import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserinfo } from './redux/userSlice'

const Login = () => {
    const [user,setUser] =useState({
        email:'',
        password:''
    })
    const [loading,setLoading]= useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(user)
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/api/v1/user/login",user,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true
            })
            if(res.data.success){
                if(res.data.user.role === "shipOwner") navigate("/shiphome")
                else if(res.data.user.role === "portManager") navigate("/porthome")
                dispatch(setUserinfo(res.data.user))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        finally{
            setLoading(false);
        }
    }
    const handleChange= (e)=>{
       setUser({ ...user,[e.target.name]:e.target.value})
    }
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form  onSubmit={handleSubmit} className='shadow-lg  flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>CargoConnect</h1>
                    <p className='text-sm text-center'>Login to get into all the application features </p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input type='email'
                        className=" focus-visible:ring-transparent my-2" onChange={handleChange}
                        name='email'
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input type='password'
                        className=" focus-visible:ring-transparent my-2"
                        name='password'  onChange={handleChange}
                    />
                </div>
                {
                    loading?
                    <Button><Loader2 className='animate-spin mr-2'/> Loading...</Button>:<Button type="submit">Login</Button>
                }

                <span className='text-center'>Don't have an account? <Link to="/signup">register</Link> </span>
            </form>
        </div>
    )
}

export default Login