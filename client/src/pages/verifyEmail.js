import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyEmail = ()=>{

  const [code,setcode] = useState(["","","","",""])
  const inputref = useRef([])
  const navigate = useNavigate()
  
  const handlechange = (value,i) =>{
    const newcode = [...code]
    if(value.length > 1){
      const passcode = value.slice(0,5).split("")
      for(let k = 0; k < 5;k++){
        newcode[k] = passcode[k] || ""
      }
      setcode(newcode)
      const lastfilled = newcode.findLastIndex((digit)=> digit !== "")
      const focusIndex = lastfilled < 4 ? lastfilled +1 : 0
      inputref.current[focusIndex].focus()
    }else{
      newcode[i] = value
      setcode(newcode)
      if(value && i < 4){
        inputref.current[i+1].focus()
      }
    }
  }

  const handlekey = (i,e)=>{
    if(e.key === "Backspace" && !code[i] && i > 0)
      inputref.current[i-1].focus()
  }

  const handlesubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    console.log("get")
    const getcode = code.join("")
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/verifyemail`

    try {
      let res = await fetch(url,{
        method:'POST',
        body:getcode,
        headers:{
          'Content-type':'text/plain'
        }
      })
  
      res = await res.json()
      toast.success(res.message) 
      if(res.success){
        navigate('/login')
      }
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div className=" h-auto mt-20 flex items-center justify-center  " >
       <div className="max-w-md w-full bg-slate-500 rounded-lg">
          <p className="m-8 text-center italic text-xl font-semibold">Verify Your Email</p>
          <p className="mt-8 text-center  text-md ">Enter the 6-digit Code sent to your registered email</p>
          <form onSubmit={handlesubmit} >
          <div className="flex items-center justify-center">
          {
            code.map((digit,index)=>{
              return(
                <input
                key={index}
                ref={(el) => (inputref.current[index] = el)}
                maxLength='5'
                value={digit}
                onChange={(e) => handlechange(e.target.value,index)}
                onKeyDown={(e)=> handlekey(index,e)}
                className="w-12 h-12 rounded-lg text-center text-2xl font-semibold m-4 outline-none"
              />
              )
            })
          }
          </div>
          <div className="w-full">
            <button  style={{'width':'-webkit-fill-available'}}
                    className="m-4 px-16 py-4 rounded-lg font-semibold text-lg bg-green-500 hover:bg-green-300"
                    // onClick={()=>submit()} 
                    >
                    Verify Email
            </button>
          </div>
          </form>

          
       </div>
    </div>
  )
}

export default VerifyEmail;