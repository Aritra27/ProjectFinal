import React from 'react'
import useGetSuggestedUser from '../hooks/useGetSuggestedUser'


const S_Home = () => {
  useGetSuggestedUser();
  return (
    <div className='flex'>
      <div className='flex-1 ml-[16%] p-4'>
        Shome
      </div>
    </div>
  )
}

export default S_Home