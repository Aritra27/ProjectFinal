import React from 'react'
import useGetSuggestedUser from '../hooks/useGetSuggestedUser'

const P_Home = () => {
  useGetSuggestedUser();
  return (
    <div className='flex'>
      <div className='flex-1 ml-[16%] p-4'>
        Home
      </div>
    </div>
  )
}

export default P_Home