import {useState,useEffect} from "react";
import toast from 'react-hot-toast';
import {  useParams } from 'react-router-dom'
import useConversation from "../zustand/zustand";

const GetMessage = ()=>{
  const[Loading,setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation();
  const params = useParams()
  useEffect(()=>{

    const getmsg = async()=>{
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/${params.userId}`
      setLoading(true)
      try{
        const res= await fetch(url)
        const data = await res.json();
        if(data.error) throw new Error(data.error)

          setMessages(data)
      }catch(err){
        toast.error(err.message)
      }finally{
        setLoading(false)
      }
     
	}
  if (selectedConversation?._id) GetMessage();
}, [selectedConversation?._id, setMessages]);

  return {messages,Loading}
}

export default GetMessage