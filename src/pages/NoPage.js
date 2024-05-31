import React from 'react'
import img from '../assets/404.png'

function NoPage() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-yellow-50'> 
      <img src={img} alt="page not found" width="400px"/>
    </div>
  )
}

export default NoPage