import React from 'react'

function Error({errors}) {
  return (
    <div className='flex flex-col items-center justify-center align-middle'>
        <p className='align-middle flex-wrap'>
            {errors}
        </p>
    </div>
  )
}

export default Error