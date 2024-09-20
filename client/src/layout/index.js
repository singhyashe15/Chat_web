import React from 'react'
import logo from '../assets/chatlogo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md '>
            <img 
              src={logo}
              alt='logo'
              width={50}
              height={20}
              className=''
            />
        </header>

        { children }
    </>
  )
}

export default AuthLayouts;