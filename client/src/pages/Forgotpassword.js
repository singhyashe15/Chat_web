import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Input , Button, Text } from '@chakra-ui/react';
import toast from 'react-hot-toast';

const Forgotpassword = () => {
  const [email,setemail] = useState("")
  const [isVerify,setverify] = useState(false)
  const [password,setpassword] = useState("")
  const [Confirmpassword,setconfirmpassword] = useState("")
  const  navigate = useNavigate()

  const checkVerified = async()=>{
    
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/verify`
    try {
      let res  = await fetch(url,{
        method:"POST",
        body:email,
        headers:{
          'Content-type':'text/plain'
        }
      })
  
      res = await res.json();
      if(res.success){
        setverify(true);
        toast.success("User Verified")
      }
    } catch (error) {
      toast.error("Check Your Email")
    }
  }

  const Submit = async ()=>{
    if(password !== Confirmpassword) {
      toast.error("Both the fields must have same password")
    }
    else{
      const url = `${process.env.REACT_APP_BACKEND_URL}/api/reset-password`
      try {
        let res = await fetch(url,{
          method:'POST',
          body:JSON.stringify({'email':email,'password':password}),
          headers:{
            'Content-type':'application/json'
          }
        })
  
        res = await res.json()
        if(res.success){
          toast.success("Password Changed")
          setpassword("")
          setconfirmpassword("")
          navigate('/login')
        }
      } catch (error) {
        toast.error("Error")
      }
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh"   width="100vw">   
      <Box width={['90%', '70%', '50%']}  p={8} bg="slate.500" color="white" border="2px solid" borderColor="blue.400"  borderRadius="lg"  boxShadow="md"  textAlign="center">
        { !isVerify &&
        <Box>
          <Text fontSize="xl" color="black" fontWeight={700} >Reset password</Text>
          <Input placeholder='Enter Your Email' color="black" value={email}  onChange={(e)=>setemail(e.target.value)} required />
          <Button colorScheme='blue'marginTop={4} onClick={()=>checkVerified()} >Verify</Button>
        </Box>
        }
        { isVerify &&
          <Box>
            <Input placeholder='Enter New Password' color="black"  marginY={8} onChange={(e)=>setpassword(e.target.value)} />
            <Input placeholder='Confirm Password'  color="black"  marginBottom={4} onChange={(e)=>setconfirmpassword(e.target.value)} />
            <Button colorScheme='blue' onClick={()=>Submit()} >Submit</Button>
          </Box>
        }
      </Box>
    </Box>
  )
}

export default Forgotpassword