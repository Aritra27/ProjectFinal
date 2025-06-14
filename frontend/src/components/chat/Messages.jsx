// Messages.jsx
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import useGetAllMessage from '../hooks/useGetAllMessage'
import useGetRTM from '../hooks/useGetRtm'

const Messages = ({ selectedUser }) => {
  useGetRTM();  
  useGetAllMessage();
  const { messages } = useSelector(store => store.chat);
  const { userinfo } = useSelector(store => store.user);

  return (
    <div className='overflow-y-auto flex-1 px-6 py-4 bg-gray-50 space-y-4'>
      {/* Profile Header */}
      <div className='flex justify-center mb-4'>
        <div className='flex flex-col items-center'>
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={selectedUser?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className='text-md font-medium text-gray-700'>{selectedUser?.name}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 text-sm mt-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className='flex flex-col gap-3'>
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === userinfo?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`p-3 rounded-xl max-w-sm break-words shadow-sm ${
              msg.senderId === userinfo?._id
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Messages
