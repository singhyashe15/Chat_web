import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/chatwave.jpg'
import { useSocket} from "../socket/socket"
const Home = () => {
  // const login = useSelector(state => state.login)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const socketConnection = useSocket();
  const fetchUserDetails = async()=>{
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user`
    try {
        const res = await fetch(URL,{
          method:"POST",
          credentials:"include",
          headers:{
            "content-type":"application/json"
          }
        })
        let response = await res.json()
        dispatch(setUser(response?.data))

        const data = JSON.stringify(response?.data)
        localStorage.setItem('user',data)
        dispatch(setUser(response?.data))
        const user = JSON.parse(localStorage.getItem('user'))
      
        if(response.data?.logout){
            dispatch(logout())
            navigate("/login")
        }
    } catch (error) {
        console.log("error",error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])


  const basePath = location.pathname === '/'
  return (
      <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen '>
        <section className={`bg-white  ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"} ml-20 ` } >
            <Outlet/> 
        </section>

        <div className={`justify-center items-center flex-col gap-2  ${basePath ? "lg:flex" : "hidden" }`}>
            <div>
              <img
                src={logo} //logo
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send messages</p>
        </div>
    </div>
    
  )
}

export default Home