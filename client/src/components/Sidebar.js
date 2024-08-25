import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
// import { FaUserPlus } from "react-icons/fa";
import { Await, NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from "react-icons/fi";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast'
import axios from 'axios';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { logout } from '../redux/userSlice';
import { useSocket } from '../socket/socket';
import Custom from "../css/custom.css"
const Sidebar = () => {
    const User = useSelector(state => state?.user)
    const [editUserOpen,setEditUserOpen] = useState(false)
    const [allUser,setAllUser] = useState([])
    const [search,setSearch] = useState("")
    const [searchUser,setSearchUser] = useState([])
    const [loading,setLoading] = useState(false)
    const [openSearchUser,setOpenSearchUser] = useState(false)
    const { socket} = useSocket();
    const dispatch = useDispatch()
    const navigate = useNavigate()
   
    useEffect(()=>{
        if(socket){
            socket.emit('sidebar',User?._id)
            console.log(User._id)
            socket.on('conversation',(data)=>{
    //             console.log('conversation',data)
                
    //             const conversationUserData = data.map((conversationUser,index)=>{
    //                 if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
    //                     return{
    //                         ...conversationUser,
    //                         userDetails : conversationUser?.sender
    //                     }
    //                 }
    //                 else if(conversationUser?.receiver?._id !== user?._id){
    //                     return{
    //                         ...conversationUser,
    //                         userDetails : conversationUser.receiver
    //                     }
    //                 }else{
    //                     return{
    //                         ...conversationUser,
    //                         userDetails : conversationUser.sender
    //                     }
    //                 }
    //             })

    //             setAllUser(conversationUserData)
            })
        }
    },[socket,User])
    const handleSearchUser = async()=>{
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const response = await axios.post(URL,{
                search : search
            })
            setLoading(false)

            setSearchUser(response.data.data)

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(()=>{
        handleSearchUser()
    },[search])

    const handleLogout = ()=>{
        dispatch(logout())
        navigate("/login")
        localStorage.clear()
    }
    const setclose = ()=>{
        setSearchUser([])
        // setSearch(" ")
    }
  return (
    <div  className='w-full lg:w-96 lg:h-full grid grid-cols-[50px,1fr] bg-slate-600 fixed'>
            <div className='bg-slate-400 w-15  rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-evenly'>
                
                    <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbubbleEllipses size={20} />
                    </NavLink>

                

                <div className='flex flex-col justify-between items-center'>
                    <button className='mx-auto ' title={User.name} onClick={()=>setEditUserOpen(true)}>
                        <Avatar
                            width={40}
                            height={40}
                            name={User?.name}
                            imageUrl={User?.profile_pic}
                            userId={User?._id}
                        />
                    </button>
                    <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-full' onClick={handleLogout}>
                        <span className='-ml-2'>
                            <BiLogOut size={20}/>
                        </span>
                    </button>
                </div>
            </div>

            <div className='lg:w-80 sm:w-96'>
                <div className='h-16 flex items-center'>
                    <h2 className='text-xl font-bold p-4 text-slate-800'>Chats</h2>
                </div>
                <div className='bg-slate-200 p-[0.5px]'></div>
                <div className='relative'>
                <input
                    placeholder='Search' 
                    className='w-full h-10 ml-1 my-2 p-5 rounded outline-none font-semibold relative' 
                    onChange={(e)=>setSearch(e.target.value)}
                    value={search}    
               />
               <button onClick={()=>setclose()} className='absolute top-5 right-2'>
                <IoClose/>
            </button>
                </div>
                 {/* //[calc(100vh-65px)] */}
                <div className='Custom h-[calc(100vh-65px)] overflow-y-auto overflow-hidden scrollbar'>
                     {
                        searchUser.length !==0 && !loading && (
                            searchUser.map((user,index)=>{
                                return(
                                    user._id !== User._id &&
                                    <UserSearchCard key={user._id} user={user}  />
                                )
                            })
                        )
                    }
                    {/* {
                        allUser.length === 0 && (
                            <div className='mt-12'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <FiArrowUpLeft
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with.</p>    
                            </div>
                        )
                    } */}

                    {
                        allUser.map((conv,index)=>{
                            return(
                                <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
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
                                        <div className='text-slate-500 text-xs flex items-center gap-1'>
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
                                    {
                                        Boolean(conv?.unseenMsg) && (
                                            <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                        )
                                    }
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>

            {/**edit user details*/}
            {
                editUserOpen && (
                    <EditUserDetails onClick={()=>setEditUserOpen((prev)=> !prev)} user={User}/>
                )
            }

            {/**search user */}

    </div>
  )
}

export default Sidebar