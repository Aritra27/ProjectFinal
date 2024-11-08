import React from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';

const S_profile = () => {
  const user = {
    _id: "66fd08425459ec9ccc17c7c5",
    name: "Test",
    email: "test@gmail.com",
    role: "portManager",
    ports: ["Port 1"], // Example port data
    createdAt: "2024-10-02T08:45:54.314+00:00",
    updatedAt: "2024-10-06T20:50:00.463+00:00"
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-1/3">
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
        <div className="mb-4">
          <strong>ID:</strong> <span>{user._id}</span>
        </div>
        <div className="mb-4">
          <strong>Name:</strong> <span>{user.name}</span>
        </div>
        <div className="mb-4">
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div className="mb-4">
          <strong>Role:</strong> <span>{user.role}</span>
        </div>
        <div className="mb-4">
          <strong>Ports:</strong>
          <ul className="list-disc ml-5">
            {user.ports.map((port, index) => (
              <li key={index}>{port}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <strong>Created At:</strong> <span>{new Date(user.createdAt).toLocaleString()}</span>
        </div>
        <div className="mb-4">
          <strong>Updated At:</strong> <span>{new Date(user.updatedAt).toLocaleString()}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600">Edit</Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <div className="flex items-center">
              <span className='font-medium'> name</span>
              <Input type="text" className='mx-4 focus-visible:ring-transparent' />
            </div>
            <div className="flex items-center">
              <span className='font-medium'>Email</span>
              <Input type='email'
                className=" focus-visible:ring-transparent mx-4" 
                name='email'
              />
            </div>
            <Button className='bg-green-600 ' >Save</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default S_profile