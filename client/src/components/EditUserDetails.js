import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import { FaPencilAlt} from 'react-icons/fa'
import {BiLogOut} from "react-icons/bi";
import uploadFile from '../helpers/uploadFile'
import axios from 'axios'
import taost from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setUser,logout,setOnlineUser } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../socket/socket';
import { Button } from '@chakra-ui/react'

const EditUserDetails = ({onClick,user}) => {
    const User = useSelector(state => state.user)
    const [data,setData] = useState({
        name : user?.user,
        quotes:user?.quotes,
        profile_pic : user?.profile_pic
    })
    const [isEditable,setEditable] = useState(false)
    const [isEditablequotes,setisEditablequotes]  = useState(false)
    const uploadPhotoRef = useRef()
    const inputref = useRef(null)
    const input2ref = useRef(null)
    const dispatch = useDispatch()
    const {socket} = useSocket()
    const navigate = useNavigate()
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
        
        const uploadPhoto = await uploadFile(file)

        setData((preve)=>{
        return{
            ...preve,
            profile_pic : uploadPhoto?.url
        }
        })
    }
    // updating the details
    const handleSubmit = async(e)=>{
        // e.preventDefault()
        // e.stopPropagation()
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
        if(inputref.current && isEditable){
            inputref.current.focus();
        }
    }


    const handlequotes = ()=>{
        setisEditablequotes(!isEditablequotes)
        if(input2ref.current && isEditablequotes){
            input2ref.current.focus();
        }
    }

    const handlelogout = ()=>{
        const data = User.onlineUser.filter((item) => 
            item !== User._id
        )
        if(socket){
            socket.emit('online',User._id)
        }
        dispatch(setOnlineUser(data))
        dispatch(logout())
        navigate("/login")
        localStorage.clear()
    }

  return (
    <div  className='fixed top-96  ml-2  bg-gray-700 flex rounded-lg z-50'>
        <div className=' p-4 py-6 mb-4 rounded w-full max-w-xs'>
            <div className='mb-5'>
                <div className='my-1 w-24 flex items-center cursor-pointer ' onClick={handleOpenUploadPhoto} title='Edit the Profile' >
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
                <div className='flex'>
                    <input
                        name='name'
                        id='name'
                        value={data?.name || ''}
                        onChange={handleOnChange}
                        className= 'py-1 px-2 f border-0.5 bg-transparent text-white outline-none'
                        style={{width:'15rem'}}
                        ref={inputref}
                        disabled={!isEditable}
                    />
                    <div className='ml-2 flex justify-center items-center w-10 h-10 cursor-pointer border-2 rounded-full active:bg-gray-400 active:text-blue-300' >
                        <FaPencilAlt  onClick={()=>handle()} />
                    </div>
                </div>
                <div className='flex mt-4 mb-4'>
                    <input
                        name='quotes'
                        id='name'
                        placeholder='About'
                        value={data?.quotes || ''}
                        onChange={handleOnChange}
                        className= 'py-1 px-2  border-0.5 bg-transparent text-white outline-none'
                        style={{width:'15rem'}}
                        ref={input2ref}
                        disabled={!isEditablequotes}
                    />
                    <div className='ml-2 flex justify-center items-center w-10 h-10 cursor-pointer border-2 rounded-full active:bg-gray-400 active:text-blue-300' >
                        <FaPencilAlt  onClick={()=>handlequotes()} />
                    </div>
                </div>

                <div className='flex gap-2 w-fit ml-auto '>
                    <Button onClick={onClick} colorScheme='cyan'  px-4 py-1  >Cancel</Button>
                    <Button onClick={()=>{handleSubmit()}} colorScheme='cyan' px-4 py-1 >Save</Button>
                </div>
                <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full ' onClick={handlelogout}>
                        <span className='-ml-2'>
                            <BiLogOut size={20}/>
                        </span>
                    </button>
        </div>
    </div>
  )
}

export default React.memo(EditUserDetails)
