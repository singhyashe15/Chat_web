import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import toast from 'react-hot-toast';
import { Button } from '@chakra-ui/react';
const RegisterPage = () => {
  const [data,setData] = useState({
    name : "",
    email : "",
    password : "",
    profile_pic : ""
  })
  const [uploadPhoto,setUploadPhoto] = useState("")
  const navigate = useNavigate()

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)
    console.log(uploadPhoto)
    setUploadPhoto(file)

    setData((preve)=>{
      return{
        ...preve,
        profile_pic : uploadPhoto?.url
      }
    })
  }
  const handleClearUploadPhoto = (e)=>{
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    if(data.name.length == 0 || data.email.length == 0 || data.password.length == 0){
      toast.error("Fill all the details")
      throw Error("Fill the details")
    }
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
    console.log(URL)
    try {
        const response = await fetch(URL,{
          method:'POST',
          body:JSON.stringify(data),
          headers:{
            'Content-Type':'application/json'
          }
        })
   
        const res =  await response.json()

        toast.success(res.message)

        if(res.success){
            setData({
              name : "",
              email : "",
              password : "",
              profile_pic : ""
            })
            console.log("enetered")
            navigate('/verifyemail')

        }
    } catch (error) {
        toast.error(error?.res?.data?.message)
        console.log(error)
    }
   
  }


  return (
    <div className='mt-20  h-auto flex flex-col lg:flex-row justify-evenly items-center ' >
        <div className='bg-white w-full max-w-md  rounded-[4.25rem] overflow-hidden p-4 m-8 border-2 border-blue-900'>
          <h3 className='text-center font-bold italic text-lg'>Welcome to Chatify </h3>
          <form className='grid gap-4 mt-5' >
              <div className='flex flex-col gap-1 mt-5'>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Full Name' 
                  className='bg-slate-100 px-2 py-1 border-2 rounded-full bg-transparent'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  autoComplete='off'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Email Address' 
                  className='bg-slate-100 px-2 py-1 border-2 rounded-full bg-transparent'
                  value={data.email}
                  onChange={handleOnChange}
                  autoComplete='off'
                  required
                />
              </div>

              <div className='flex flex-col gap-1 '>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Password' 
                  className='bg-slate-100 px-2 py-1 border-2 rounded-full bg-transparent'
                  value={data.password}
                  onChange={handleOnChange}
                  autoComplete='off'
                  required
                />
              </div>

                <div className='flex flex-col gap-1' >
                  <div className='h-14 bg-transparent flex justify-center items-center border rounded-full hover:border-blue-700 cursor-pointer'>
                      <input
                          type='file'
                          id='profile_pic'
                          name='profile_pic'
                          className=' px-2 py-1 '
                          onChange={handleUploadPhoto}
                      />
                  </div>
              </div>


              <Button colorScheme='cyan' px-4 py-1 mt-2 onClick={handleSubmit} >
                Register Here
              </Button>

          </form>
          <p className='my-3 text-center'>Already have account ? <Link to={"/login"} className='hover:text-green-700 font-semibold'>LOGIN</Link></p>
        </div>
    </div>
  )
}

export default RegisterPage
