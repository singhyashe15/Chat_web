import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user}) => 
{
  return (
    <Link to={"/"+user?._id}  className='h-16 flex items-center gap-3 m-2 p-2 lg:p-4  hover:bg-slate-700 rounded cursor-pointer'>
        <div>
            <Avatar
                width={45}
                height={45}
                name={user?.name}
                userId={user?._id}
                imageUrl={user?.profile_pic}
            />
        </div>
        <div>
            <div className='font-semibold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
        </div>
    </Link>
  )
}

export default UserSearchCard