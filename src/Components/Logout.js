import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Logout.scss'

function Logout() {
    const navigate=useNavigate()
    const handleLogout=()=>{
        let logout=window.confirm('Confirm logout')
        if(logout){
            localStorage.removeItem('token')
            navigate('/')
        }
    }
  return (
    <div>
    <button onClick={handleLogout} className='logout-button'>Logout</button>
    </div>
  )
}

export default Logout
