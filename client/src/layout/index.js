import React from 'react'
import logo from '../assets/chatwave.jpg'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md '>
            <img 
              src={logo}
              alt='logo'
              width={50}
              height={20}
              className='grayscale'
            />
        </header>

        { children }
    </>
  )
}

export default AuthLayouts;