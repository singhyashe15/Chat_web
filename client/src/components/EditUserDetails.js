import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import { FaPencilAlt ,FaUser} from 'react-icons/fa'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import taost from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'


const EditUserDetails = ({onClick,user}) => {
    const [data,setData] = useState({
        name : user?.user,
        profile_pic : user?.profile_pic
    })
    const [isEditable,setEditable] = useState(false)
    const uploadPhotoRef = useRef()
    const inputref = useRef(null)
    const dispatch = useDispatch()

    useEffect(()=>{
        setData((preve)=>{
            return{
                ...preve,
                ...user
            }
        })
    },[user])

    const handleOnChange = (e)=>{
        const { name, value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleOpenUploadPhoto = (e)=>{
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }
    const handleUploadPhoto = async(e)=>{
        const file = e.target.files[0]
        console.log(file)
        const uploadPhoto = await uploadFile(file)

        setData((preve)=>{
        return{
            ...preve,
            profile_pic : uploadPhoto?.url
        }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        e.stopPropagation()
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`

            const response = await axios({
                method : 'post',
                url : URL,
                data : data,
                withCredentials : true
            })

            console.log('response',response)
            taost.success(response?.data?.message)
            
            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClick()
            }
         
        } catch (error) {
            console.log(error)
            taost.error()
        }

    }

    const handle = ()=>{
        setEditable(!isEditable)
        console.log("edit" + isEditable)
        if(inputref.current && isEditable){
            inputref.current.focus()
        }
    }
  return (
    <div style={{width:'30rem'}} className='fixed top-30 bottom-5 left-14 bg-gray-700 flex justify-start z-10 rounded-lg'>
        <div style={{width:'8rem'}}>
           <div style={{marginTop: '13.5rem'}} className='mt-10 ml-2 mb-2 flex bg-slate-400 rounded-lg cursor-pointer hover:bg-slate-300'>
           <div className='flex justify-center items-center ml-4 '>
           <FaUser/>
           </div>
           <div className='text-lg ml-2'>
           Profile
           </div>
           </div>
        </div>
        <div className=' p-4 py-6 m-1 rounded w-full max-w-xs'>
            <div className='mb-5'>
                <div className='my-1 w-24 flex items-center cursor-pointer ' onClick={handleOpenUploadPhoto} >
                        <Avatar 
                            width={80}
                            height={80}
                            imageUrl={data?.profile_pic}
                            name={data?.name}
                        />
                </div>
                <input
                    type='file'
                    onChange={handleUploadPhoto}
                    className='hidden'
                    ref={uploadPhotoRef}
                />
            </div>
            {/* <form className='grid gap-3 mt-3' onSubmit={handleSubmit}> */}
                <div className='flex'>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={data?.name}
                        onChange={handleOnChange}
                        className= 'py-1 px-2 focus:outline-primary border-0.5 bg-transparent text-white'
                        style={{width:'15rem'}}
                        ref={inputref}
                        disabled={!isEditable}
                    />
                    <div className='ml-2 flex justify-center items-center w-10 h-10 cursor-pointer border-2 rounded-full active:bg-gray-400 active:text-blue-300' >
                    <FaPencilAlt  onClick={handle} />
                    </div>
                </div>

                    <div className='my-1 flex items-center gap-4'>
                    <p className='text-lg  text-white'>Email Id</p>
                       <span className='text-white text-lg' > {data?.email} </span>
                    </div>

                <div className='flex gap-2 w-fit ml-auto '>
                    <button onClick={onClick} className='border-primary border text-white px-4 py-1 rounded hover:bg-slate-400 hover:text-black'>Cancel</button>
                    <button onClick={()=>{handleSubmit()}} className='border-primary text-white bg-primary  border px-4 py-1 rounded hover:bg-slate-400 hover:text-black'>Save</button>
                </div>
            {/* </form> */}
        </div>
    </div>
  )
}

export default React.memo(EditUserDetails)