import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import chatLogo from '../assets/chatlogo.png'
import toast from 'react-hot-toast';

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
        const response = await fetch(URL,{
          method:'POST',
          body:JSON.stringify(data),
          headers:{
            'Content-Type':'application/json'
          }
        })
   
        const res =  await response.json()
        console.log("response",res)

        toast.success(res.message)

        if(res.success){
            setData({
              name : "",
              email : "",
              password : "",
              profile_pic : ""
            })
            console.log("enetered")
            navigate('/login')

        }
    } catch (error) {
        toast.error(error?.res?.data?.message)
        console.log(error)
    }
   
  }


  return (
    <div className='mt-20  h-auto flex flex-col lg:flex-row justify-evenly items-center ' >
      <div>
          <img
            src={chatLogo} //logo
            width={100}
            alt='logo'
            className='w-40 sm:w-48 md:w-64 lg:w-80 '
            />
      </div>
        <div className='bg-white w-full max-w-md  rounded-[4.25rem] overflow-hidden p-4 m-8 border-2 border-blue-900'>
          <h3 className='text-center font-bold italic text-lg'>Welcome to Chat Wave</h3>

          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-1'>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Full Name' 
                  className='bg-slate-100 px-2 py-1 border-2 rounded-full'
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
                  className='bg-slate-100 px-2 py-1 border-2 rounded-full'
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
                  className='bg-slate-100 px-2 py-1 border-2 rounded-full '
                  value={data.password}
                  onChange={handleOnChange}
                  autoComplete='off'
                  required
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='profile_pic'>Photo :

                  <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                      <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                        {
                          uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
                        }
                      </p>
                      {
                        uploadPhoto?.name && (
                          <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                            <IoClose/>
                          </button>
                        )
                      }
                      
                  </div>
                
                </label>
                
                <input
                  type='file'
                  id='profile_pic'
                  name='profile_pic'
                  className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                  onChange={handleUploadPhoto}
                />
              </div>


              <button
               className='bg-slate-500 text-lg  px-4 py-1  rounded mt-2 font-bold text-black leading-relaxed tracking-wide hover:bg-violet-500'
              >
                Register
              </button>

          </form>

          <p className='my-3 text-center'>Already have account ? <Link to={"/login"} className='hover:text-green-700 font-semibold'>Login</Link></p>
        </div>
    </div>
  )
}

export default RegisterPage