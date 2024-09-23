import React, { useEffect,useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout,setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/chatlogo.png'
import { useSocket } from '../socket/socket';
const Home = () => {
  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const socket = useSocket()
  const fetchUserDetails = useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user`
    try {
        const res = await fetch(URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        });
        let response = await res.json();
        dispatch(setUser(response?.data));

        const data = JSON.stringify(response?.data);
        localStorage.setItem('user', data);

        if (response.data?.logout) {
            dispatch(logout());
            navigate("/login");
        }
    } catch (error) {
        console.log("error", error);
    }
}, [dispatch, navigate]);

useEffect(() => {
    fetchUserDetails();
}, [fetchUserDetails]);


  const basePath = location.pathname === '/'
  return (
      <div className='grid lg:grid-cols-[382px,1fr] h-screen max-h-screen '>
        <section className={`bg-white  ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"} `}>
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
            <p className='text-xl italic font-semibold mt-2 text-slate-500'>Hello {user?.name} 😎 start the conversations</p>
        </div>
    </div>
    
  )
}

export default Home