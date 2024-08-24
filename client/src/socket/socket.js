import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import {setOnlineUser } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
const SocketContext = createContext();

export const useSocket = () => {
 return  useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    // const user = JSON.parse(localStorage.getItem('user'))
    const dispatch = useDispatch()
    // const [messages, setMessages] = useState([]);
    const Url = `${process.env.REACT_APP_BACKEND_URL}`
    useEffect(() => {
      
        const socket = io(Url,{
          reconnection:true,
          reconnectionAttempts:Infinity,
          reconnectionDelay:1000,
          reconnectionDelayMax:2000,
          timeout:20000,
          auth : {
            token: localStorage.getItem('token')
          }
        })
        setSocket(socket);
        console.log(socket)
        socket?.on('onlineUser',(data)=>{
          dispatch(setOnlineUser(data))
        })
        return () => {
          socket.disconnect(); // Cleanup on unmount
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket}}>
            {children}
        </SocketContext.Provider>
    );
};
