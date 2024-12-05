import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserinfo } from '../redux/userSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const P_profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userinfo } = useSelector(store => store.user)
  const [userdetails, setUserdetails] = useState({
    name: userinfo?.name,
    email: userinfo?.email
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const onSubmitHandaler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const res = await axios.post("http://localhost:8000/api/v1/user/editProfile", userdetails, {
        headers: {
          "Content-Type": "application/json"
        }, withCredentials: true
      })

      if (res.data.success) {
        const updatedData = {
          ...userinfo,
          name: res.data.user?.name,
          email: res.data.user?.email
        }
        dispatch(setUserinfo(updatedData))
        toast.success(res.data?.message)
        navigate("")
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally{
      setIsLoading(false)
      setIsOpen(false)
    }
  }
  const onChangeHandler = (e) => {
    setUserdetails({ ...userdetails, [e.target.name]: e.target.value })
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-1/3">
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
        <div className="mb-4">
          <strong>ID:</strong> <span>{userinfo._id}</span>
        </div>
        <div className="mb-4">
          <strong>Name:</strong> <span>{userinfo.name}</span>
        </div>
        <div className="mb-4">
          <strong>Email:</strong> <span>{userinfo.email}</span>
        </div>
        <div className="mb-4">
          <strong>Role:</strong> <span>{userinfo.role}</span>
        </div>
        <Dialog  open={isOpen} onOpenChange={(open) => setIsOpen(open)} >
          <DialogTrigger asChild>
            <Button className="bg-red-600" onClick={() => setIsOpen(true)} >Edit</Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <form onSubmit={onSubmitHandaler}>
              <div className="flex items-center">
                <span className='font-medium'> name</span>
                <Input value={userdetails?.name} type="text" className='mx-4 focus-visible:ring-transparent' name='name' onChange={onChangeHandler} />
              </div>
              <div className="flex items-center">
                <span className='font-medium'>Email</span>
                <Input value={userdetails?.email} type='email'
                  className=" focus-visible:ring-transparent mx-4"
                  name='email'
                  onChange={onChangeHandler}
                />
              </div>
              <Button className='bg-green-600 ' type="submit" >{
                isLoading ? <><Loader2  className="mr-2 animate-spin"/>loading</> : <p>save</p>
              }</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default P_profile