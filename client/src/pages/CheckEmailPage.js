import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckEmailPage = () => {
  const [data,setData] = useState({
    email : "",password:""
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleOnChange = (e)=>{
    const { name, value} = e.target
    setData((prev)=>{
      return{
          ...prev,
          [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    console.log(e)
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`
    
    try {
        const response = await fetch(URL,{
          method:'POST',
          body:JSON.stringify(data),
          headers:{
            'Content-Type':'application/json'
          },
          credentials:'include'
        })
        const res = await response.json();
       console.log(res)
        toast.success(res.message)
        if(res.success){
          dispatch(setToken(res?.token))
          localStorage.setItem('token',res?.token);
          
          setData({
            email:"",password : ""
          })
          navigate('/')
        }
    } catch (error) {
        console.log(error)
        toast.error(error?.res?.message)
    }
  }


  return (
    <div className='mt-5 mx-1' >
        <div className='h-96 w-full max-w-md border-2 border-blue-900 rounded-[3.25rem] overflow-hidden p-4 mx-auto'>

            <div className='w-fit mx-auto mb-2'>
                <PiUserCircle
                  size={80}
                />
            </div>
          <h3 className='font-semibold'>Welcome to Chat app!</h3>
          <form className='grid gap-4 mt-3 ' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-1'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Email' 
                  className='bg-slate-100 px-2 py-1 border-2  bg-transparent'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  autoComplete='off'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Password' 
                  className='bg-slate-100 px-2 py-1 border-2  bg-transparent'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  autoComplete='off'
                />
              </div>
              <button
               className='bg-blue-500 text-lg  px-4 py-1 hover:bg-blue-300 hover:text-green-700 rounded-full mt-2 font-bold text-black leading-relaxed tracking-wide'>
                Let's Start
              </button>
          </form>
          <div className='flex justify-evenly mt-10'>
          <div className=''><Link to={"/forgot-password"} className='hover:text-red-500 font-semibold'>Forgot password</Link></div>
          <div className=' text-center'>New User ?<Link to={"/register"} className='hover:text-green-500 font-semibold'>Register</Link></div>
          </div>
        </div>
    </div>
  )
}

export default CheckEmailPage