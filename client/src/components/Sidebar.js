import React, { useEffect, useRef, useState,useCallback } from 'react'
import { NavLink} from 'react-router-dom';
import Avatar from './Avatar'
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from "react-icons/fi";
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaImage,FaVideo  } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useSocket } from '../socket/socket';
import ChatLogo from '../assets/chatlogo.png'
import moment from 'moment'

const Sidebar = () => {
    const User = useSelector(state => state?.user)
    const [editUserOpen,setEditUserOpen] = useState(false)
    const [allUser,setAllUser] = useState([])
    const [search,setSearch] = useState("")
    const [searchUser,setSearchUser] = useState([])
   
    const { socket} = useSocket();
    const inputref = useRef()
   
    useEffect(()=>{
        if(socket){
            socket.emit('sidebar',User?._id)
            socket.on('conversation',(data)=>{
                const conversationUserData = data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== User?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.receiver
                        }
                    }
                    else{
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.sender
                        }
                    }
                })

                setAllUser(conversationUserData)
            })
        }
    },[socket,User])

    const handleSearchUser = useCallback(async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            const response = await axios.post(URL, { search });
            setSearchUser(response.data.data);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }, [search]);
    
    useEffect(() => {
        handleSearchUser();
    }, [search, handleSearchUser]);

   
    const setclose = ()=>{
        setSearch("")
        setSearchUser([])
    }

    useEffect(()=>{
        setSearch("")
        setSearchUser([])
    },[])
  return (
    <div  className='w-full lg:w-96 px-4  bg-slate-600 fixed'>
            <div className='lg:w-80 sm:w-96'>
                <div className='flex justify-between'>
                <div className='flex '>
                <div className='h-16 w-16 flex items-center'>
                        <img 
                            src={ChatLogo}
                            width={100}
                            height={100}
                            alt='logo'
                        />
                    </div>
                    <div className='h-16 flex items-center'>
                        <h2 className='text-xl font-bold p-4 text-slate-800'>Chat Wave</h2>
                    </div>
                </div>
                    <div className='h-12 w-12 mt-4 bg-slate-800 rounded-full flex items-center justify-center'>
                        {/* <FaRegEdit size={20} className='text-white hover:text-black '/> */}
                        <button className='' title={User.name} onClick={()=>setEditUserOpen(prev => !prev)}>
                            <Avatar
                                width={40}
                                height={40}
                                name={User?.name}
                                imageUrl={User?.profile_pic}
                                userId={User?._id}
                            />
                        </button>
                    </div>
                </div>
                <div className='relative'>
                <input
                    placeholder='Search' 
                    className='w-full h-10 ml-1 my-2 p-5 rounded-full outline-none font-semibold relative' 
                    onChange={(e)=>setSearch(e.target.value)}
                    value={search}
                    ref={inputref}   
               />
               <button onClick={()=>setclose()} className='absolute top-5 right-2'>
                <IoClose className='hover:text-violet-700' />
            </button>
                </div>
                 
                <div className='chat-box h-[calc(100vh-65px)] overflow-y-auto overflow-hidden scrollbar'>
                    { 
                        searchUser.length !== 0  &&(
                            searchUser.map((user,index)=>{
                                
                                return(
                                    user._id !== User._id &&
                                    <UserSearchCard key={user._id} user={user}  />
                                )
                            })
                        )
                    }
                    {
                        allUser.length === 0  && (
                            <div className='mt-12'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <FiArrowUpLeft
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with.</p>    
                            </div>
                        )
                    }

                    {
                      searchUser.length === 0 && allUser.map((conv,index)=>{
                       
                            return(
                                <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 m-2 py-3 px-2 border border-transparent hover:border-primary rounded-full hover:bg-slate-500 cursor-pointer'>
                                    <div>
                                        <Avatar
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}
                                            width={40}
                                            height={40}
                                        />    
                                    </div>
                                    <div>
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                        <div className='text-white text-xs flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaImage/></span>
                                                            {!conv?.lastMsg?.text && <span>Image</span>  } 
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaVideo/></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    <div className='ml-auto flex flex-col'>
                                        <div className='font-semibold'>
                                            {moment(conv?.lastMsg?.createdAt).format('hh:mm')}
                                        </div>
                                        <div className='flex justify-center items-center'>
                                        {
                                            Boolean(conv?.unseenMsg) && (
                                                <p className='text-xs w-6 h-6 text-center  p-1 bg-green-400 text-black font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                            )
                                        }
                                        </div>
                                    </div>
                                </NavLink>
                            )
                        })
                    }
 
                </div>   
            </div>  
    </div>
  )
}

export default Sidebar
