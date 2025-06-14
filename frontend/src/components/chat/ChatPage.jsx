// ChatPage.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { setSelectedUser } from '../redux/userSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { setMessages } from '../redux/chatSlice';
import axios from 'axios';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const { userinfo, suggestedUsers, selectedUser } = useSelector(store => store.user);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data?.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    }
  }, []);

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-full md:w-1/4 p-6 bg-white shadow-sm border-r border-gray-200 overflow-y-auto'>
        <h1 className='text-xl font-semibold mb-4'>{userinfo?.name}</h1>
        <hr className='mb-4 border-gray-200' />
        <div className='space-y-3'>
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className='flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md cursor-pointer transition'
              >
                <Avatar className='w-12 h-12'>
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium text-gray-800'>{suggestedUser?.name}</p>
                  <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'} font-medium`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Section */}
      {
        selectedUser ? (
          <main className='flex-1 flex flex-col bg-white shadow-sm'>
            {/* Chat Header */}
            <div className='flex items-center gap-4 px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10'>
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className='font-semibold text-lg'>{selectedUser?.username}</h2>
                <p className='text-sm text-gray-500'>Active now</p>
              </div>
            </div>

            {/* Messages */}
            <Messages selectedUser={selectedUser} />

            {/* Message Input */}
            <div className='flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-white'>
              <Input
                type="text"
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                className='flex-1 focus-visible:ring-gray-300'
                placeholder='Type your message...'
              />
              <Button onClick={() => sendMessageHandler(selectedUser?._id)} className='bg-blue-600 text-white hover:bg-blue-700'>
                Send
              </Button>
            </div>
          </main>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center bg-white text-center'>
            <MessageCircleCode className='w-24 h-24 text-gray-400 mb-6' />
            <h2 className='text-xl font-semibold mb-2'>Your Messages</h2>
            <p className='text-gray-500'>Select a user from the left to start chatting</p>
          </div>
        )
      }
    </div>
  )
}

export default ChatPage
