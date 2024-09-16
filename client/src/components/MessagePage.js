import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaPaperclip } from "react-icons/fa";
import { FaImage,FaVideo,FaAngleLeft  } from "react-icons/fa6";
import { FaTrash } from 'react-icons/fa';
import uploadFile from '../helpers/uploadFile';
import { IoClose} from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import moment from 'moment'
import { useSocket } from '../socket/socket';
import toast from 'react-hot-toast';

const MessagePage = () => {
  const params = useParams()
  const { socket} = useSocket();
  const user = useSelector(state => state?.user)
  const [del,setdelete] = useState(false)
  const [currentmsg,setcurrentmsg] = useState("");
  const [index,setindex] = useState(0)
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
  const divRefs = useRef([]);
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
        
        socket.emit('receiver-id',params.userId)

        socket.on('receiver-data',(data)=>{
          setDataUser(data)
        })

        socket.emit('seen',params.userId) 
        
        socket.on('new-msg',(data)=>{
          setAllMessage(data)
        })

      }
  },[socket,params.userId,user])

  const handleOnChange = (e)=>{
    const {value} = e.target
    setMessage(prev => {
      return{
        ...prev,
        text : value
      }
    })
  }

  const handleSendMessage =async (e)=>{
    e.preventDefault()
    
    if(message.text || message.imageUrl || message.videoUrl){
      if(socket){
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

  const deletemsg = async()=>{
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/deletemsg`
    let res = await fetch(url,{
      method:"POST",
      body:JSON.stringify({texts:currentmsg}),
      headers:{
        'content-type':'application/json'
      }
    })
    res = await res.json();
    socket.emit('receiver-id',params.userId)
    toast.success(res.message)
    if(res.success){
      setdelete(prev => !prev)
    }
  }

  const deleteme = ()=>{
    console.log("INdex" + index)
    if (divRefs.current[index]) {
      divRefs.current[index].remove(); // Remove the specific div from the DOM
    }
    toast.success("Deleted for me successfully")
    setdelete(prev => !prev)
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
                    <div 
                      key={index} 
                      ref={(el) => (divRefs.current[index] = el)}
                      className={`m-2 flex flex-row ${user._id === msg?.msgUserId  && "ml-auto"}`}>
                           <div className={`flex justify-center items-center mr-3 text-slate-600 ${user._id !== msg?.msgUserId  && "hidden"}`}>
                            <button onClick={()=>{setdelete(prev => !prev);setcurrentmsg(msg.text);setindex(index)}}>
                              <FaTrash size={15} className='hover:text-orange-400' />
                            </button>
                          </div>
                          <div className={`p-2 py-1 rounded-tr-xl rounded-bl-xl w-fit max-w-[280px] md:max-w-sm lg:max-w-md  ${user._id === msg?.msgUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                            {/* for image */}
                            {
                                msg?.imageUrl && 
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                    alt='pic'
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
                          <div className={`flex justify-center items-center ml-3 text-slate-600 ${user._id === msg?.msgUserId  && "hidden"}`}>
                            <button onClick={()=>{setdelete(prev => !prev);setcurrentmsg(msg.text);setindex(index)}}>
                              <FaTrash size={15} className='hover:text-orange-400'/>
                            </button>
                          </div>
                          </div>                  
                        )
                      })
                    }
                  </div>


                  {/**upload Image display */}
                  {
                    message.imageUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='bg-gray-500 p-3 rounded-lg'>
                            <img
                              src={message.imageUrl}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                            <div className='flex justify-evenly'>
                              <button className='p-1 py-1 bg-green-400 text-blue-400 rounded-lg text-center hover:text-red-600' onClick={handleClearUploadImage}>
                                  <FaTrash size={18}/>
                              </button>
                              <button className= 'p-2 bg-green-400 text-blue-400 rounded-lg text-center  hover:text-blue-600 '  onClick={handleSendMessage}>
                                  <IoMdSend size={28}/>
                              </button>
                            </div>
                        </div>
                      </div>
                    )
                  }

                  {/**upload video display */}
                  {
                    message.videoUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>

                        <div className='bg-gray-500 p-3'>
                            <video 
                              src={message.videoUrl} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                             <div className='flex justify-evenly'>
                              <button className='p-1 py-1 bg-green-400 text-blue-400 rounded-lg text-center hover:bg-red-600' onClick={handleClearUploadImage}>
                                  <IoClose size={28}/>
                              </button>
                              <button className= 'p-2 bg-green-400 text-blue-400 rounded-lg text-center  hover:text-blue-600 '  onClick={handleSendMessage}>
                                  <IoMdSend size={28}/>
                              </button>
                            </div>
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
                  {
                    del && <div className='w-full h-full sticky bottom-0  bg-slate-700 bg-opacity-30 flex  justify-center overflow-hidden  '>
                    <div className='flex flex-col justify-center items-center bg-slate-600 my-60 px-4 rounded-xl'>
                      <div>
                        <p>Delete message?</p>
                        </div>
                        
                        <div className='flex flex-row justify-evenly w-full m-4'>
                          <div className='hover:bg-slate-400 rounded-xl '>
                            <button className='text-green-400 font-semibold p-4 ' onClick={()=>{setdelete(prev => !prev)}} >Cancel</button>
                          </div>
                          <div className='hover:bg-slate-400 rounded-xl'>
                        <button className='text-green-400 font-semibold p-4' onClick={()=>{deleteme()}}>Delete for me Only</button>
                        </div>
                          <div className='hover:bg-slate-400 rounded-xl'>
                            <button className='text-green-400 font-semibold p-4' onClick={()=>{deletemsg()}}>
                              Delete for everyone
                            </button>
                          </div>
                        </div>
                    </div>
                    </div>
                          }
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