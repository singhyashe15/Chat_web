import React, { useEffect } from 'react';
import { Box, Spinner,Text,HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

export default function AuthEmail(){
  const navigate = useNavigate() 
  const dispatch = useDispatch()
  useEffect(()=>{
    const fetchToken = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/token`, {
        credentials: "include",
      });
      const { token } = await response.json();
      
      if (token) {
        dispatch(setToken(token))
        localStorage.setItem('token',token);
        navigate("/");
      }
    };
    fetchToken();
  },[])
  return(
    <Box display="flex" flexDirection="column"  justifyContent="center" alignItems="center" height="100vh"   width="100vw">
        <Box width={['90%', '70%', '30%']}  bg="green.200" color="white" border="2px solid" p="4" borderColor="blue.400" borderRadius="lg"   textAlign="center">
            <HStack>
              <Spinner color="teal.500" size="lg" />
              <Text fontStyle="italic" fontFamily="cursive" fontSize="lg">Authenticating</Text>
            </HStack>
        </Box>
    </Box>
  )
}
