import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPaperclip } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose} from "react-icons/io5";

import { IoMdSend } from "react-icons/io";
import moment from 'moment'
import { useSocket } from '../socket/socket';
import Custom  from "../css/custom.css"

const MessagePage = () => {
  const params = useParams()
  const { socket} = useSocket();
  const user = useSelector(state => state?.user)
  // const { messages, setMessages, selectedConversation } = useConversation();

  const [dataUser,setDataUser] = useState({
    name : "",
    email : "",
    profile_pic : "",
    online : false,
    _id : ""
  })
  const [upload,setUpload] = useState(false)
  const [message,setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
  })

  const [allMessage,setAllMessage] = useState([])
  const currentMessage = useRef(null)
  // const {Message,loading} = getMessage()
  useEffect(()=>{
      if(currentMessage.current){
          currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
      }
  },[allMessage])

  const handleUploadImageVideoOpen = ()=>{
    setUpload(preve => !preve)
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    // setLoading(true)
    const uploadPhoto = await uploadFile(file)
    // setLoading(false)
    setUpload(false)

    setMessage(preve => {
      return{
        ...preve,
        imageUrl : uploadPhoto.url
      }
    })
  }
  const handleClearUploadImage = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        imageUrl : ""
      }
    })
  }

  const handleUploadVideo = async(e)=>{
    const file = e.target.files[0]

    // setLoading(true)
    const uploadPhoto = await uploadFile(file)
    // setLoading(false)
    setUpload(false)

    setMessage(preve => {
      return{
        ...preve,
        videoUrl : uploadPhoto.url
      }
    })
  }
  const handleClearUploadVideo = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        videoUrl : ""
      }
    })
  }

  useEffect(()=>{
      if(socket){
        console.log("Entered")
        console.log("id" + params.userId)
        socket.emit('receiver-id',params.userId)

        socket.on('receiver-data',(data)=>{
          console.log("d" + data)
          setDataUser(data)
        })

        socket.emit('seen',params.userId) 
        
        socket.on('new-msg',(data)=>{
          setAllMessage(data)
          console.log(data)
        })
      }else{
        console.log(socket)
        console.log(params.userId)
      }
      
  },[socket,params.userId,user])

  const handleOnChange = (e)=>{
    const {name,value}= e.target
    setMessage(prev => {
      return{
        ...prev,
        text : value
      }
    })
  }

  const handleSendMessage =async (e)=>{
    e.preventDefault()
    
    // const URL = `${process.env.REACT_APP_BACKEND_URL}/api/message/${params.userId}`
    if(message.text || message.imageUrl || message.videoUrl){
      if(socket){
        console.log("Enter")
        socket.emit('new message',{
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : ""
        })
      }
    }
  }
  

//style={{ backgroundImage : `url(${wallpaper})`}}
  return (<>
      
      <div className='bg-no-repeat bg-cover'>
          <header className='sticky top-0 h-16 bg-slate-600 flex justify-between items-center px-4'>
              <div className='flex items-center gap-4'>
                  <Link to={"/"} className='lg-hidden'>
                      <FaAngleLeft size={25}/>
                  </Link>
                  <div>
                      <Avatar
                        userId = {dataUser?._id}
                        name = {dataUser?.name}
                        imageUrl = {dataUser?.profile_pic}
                        width = {50}
                        height= {50}
                      />
                  </div>
                  <div>
                     <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                     <p className='-my-2 text-sm'>
                      {
                        dataUser?.online ? <span className='text-slate-500 font-sans text-lg'>online</span> : 
                        <span className='text-slate-500 font-sans text-lg'>Offline</span>
                      }
                     </p>
                  </div>
              </div>
              <div >
                    <button className='cursor-pointer hover:text-blue-500'>
                      <HiDotsVertical/>
                    </button>
              </div>
          </header>

          {/***show all message */}
          <section  className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-400 bg-opacity-50'>
                  {/**all message show here */}
                  <div className='flex flex-col gap-2 py-2 mx-2 ' ref={currentMessage}>
                    {
                      allMessage.map((msg,index)=>{
                        return(
                          <div key={index} className={`m-2 p-2 py-1  rounded-tr-xl rounded-bl-xl w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                            {/* for image */}
                              {
                                msg?.imageUrl && 
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                              }
                              {/* for video  */}
                              {
                                msg?.videoUrl && 
                                  <video
                                    src={msg.videoUrl}
                                    className='w-full h-full object-scale-down'
                                    controls
                                  />
                              }

                            <p className='px-2'>{msg.text}</p>
                            <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                            
                            
                          </div>
                        )
                      })
                    }
                  </div>


                  {/**upload Image display */}
                  {
                    message.imageUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <img
                              src={message.imageUrl}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                      </div>
                    )
                  }

                  {/**upload video display */}
                  {
                    message.videoUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <video 
                              src={message.videoUrl} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                        </div>
                      </div>
                    )
                  }

                  {/* {
                    loading && (
                      <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                        <Loading/>
                      </div>
                    )
                  } */}
          </section>

          {/**send message */}
          <section className='h-16 bg-slate-400 bg-opacity-50 flex items-center px-4'>
              <div className='relative '>
                  <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center mb-3 mr-1 w-11 h-11 rounded-full hover:bg-green-400  active:text-blue-500'>
                    <FaPaperclip size={20}/>
                  </button>
                  {/**video and image */}
                  {
                    upload && (
                      <div className='bg-slate-400 shadow rounded-xl absolute bottom-16 w-16 p-2'>
                      <form>
                          <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 rounded-lg  hover:bg-green-200 cursor-pointer'>
                              <div className='text-purple-500'>
                                  <FaImage size={18}/>
                              </div>
                          </label>
                          <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 rounded-lg hover:bg-green-200 cursor-pointer'>
                              <div className='text-purple-500'>
                                  <FaVideo size={18}/>
                              </div>
                          </label>
                          <input 
                            type='file'
                            id='uploadImage'
                            onChange={handleUploadImage}
                            className='hidden'
                          />
                          <input 
                            type='file'
                            id='uploadVideo'
                            onChange={handleUploadVideo}
                            className='hidden'
                          />
                      </form>
                      </div>
                    )
                  }
                  
              </div>
              {/**input box */}
              <form className='h-full w-full flex gap-2 ' onSubmit={handleSendMessage}>
                  <input
                    type='text'
                    placeholder='Type messages here...'
                    className='mb-1 mt-1 py-1 pl-5 pr-2 rounded-3xl outline-none w-full h-12 text-white bg-gray-600'
                    value={message.text}
                    onChange={handleOnChange}
                  />
                  <button className='text-blue-400  hover:text-blue-600 mb-3'>
                      <IoMdSend size={28}/>
                  </button>
              </form>
          </section>
    </div>
    
  </>
  )
}

export default MessagePage