import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'

function HomePage() {
    const {user,logout} = useContext(AuthContext);

  return (
    <div>
        <h1>HomePage</h1>
        <p>Welcome, {user?.fullName}</p>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default HomePage