import React from 'react';
import { Navigate } from 'react-router-dom';

const Routers = ({children}) =>{
  const token = localStorage.getItem('token')
  if(!token){
    console.log(token)
    return <Navigate to="/login" replace/>
  }
  return children
};

export default Routers;