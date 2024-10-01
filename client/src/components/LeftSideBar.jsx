
import React from 'react'
import { MdHomeFilled } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiSearch, CiBookmark } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/config';
import { toast } from 'react-toastify';
import { getOtherUsers, getProfile, getUser } from '../redux/userSlice';

const LeftSideBar = () => {

  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`)
      dispatch(getUser(null))
      dispatch(getOtherUsers(null))
      dispatch(getProfile(null))
      navigate("/login")
      toast.success(res.data.message)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div 
    // className='flex flex-col justify-between h-screen p-4  md:w-64 w-20 sticky md:top-0 md:left-0 md:z-10'
    className='flex flex-col justify-between h-screen p-4 w-20 md:w-64 sticky top-0 z-10'
    >
      <div className='flex flex-col items-center md:items-start'>
        <div className='mb-4'>
          <Link to={"/"}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-18jsvk2 r-16y2uox r-8kz0gk h-8 w-8 md:h-10 md:w-10">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </Link>
        </div>

        <nav className='space-y-4'>
          <Link to={"/"} className='flex items-center justify-center md:justify-start px-2 py-3 hover:bg-gray-200 rounded-full'>
            <MdHomeFilled size={"28px"} className='md:mr-2' />
            <span className='hidden md:inline-block font-semibold text-lg'>Home</span>
          </Link>
          <Link to={"/explore"} className='flex items-center justify-center md:justify-start px-2 py-3 hover:bg-gray-200 rounded-full'>
            <CiSearch size={"28px"} className='md:mr-2' />
            <span className='hidden md:inline-block font-semibold text-lg'>Explore</span>
          </Link>
          <Link to={"/notifications"} className='flex items-center justify-center md:justify-start px-2 py-3 hover:bg-gray-200 rounded-full'>
            <IoIosNotificationsOutline size={"28px"} className='md:mr-2' />
            <span className='hidden md:inline-block font-semibold text-lg'>Notifications</span>
          </Link>
          <Link to={"/bookmarks"} className='flex items-center justify-center md:justify-start px-2 py-3 hover:bg-gray-200 rounded-full'>
            <CiBookmark size={"28px"} className='md:mr-2' />
            <span className='hidden md:inline-block font-semibold text-lg'>Bookmarks</span>
          </Link>
          <Link to={`/profile/${user?._id}`} className='flex items-center justify-center md:justify-start px-2 py-3 hover:bg-gray-200 rounded-full'>
            <FaRegUser size={"28px"} className='md:mr-2' />
            <span className='hidden md:inline-block font-semibold text-lg'>Profile</span>
          </Link>
          <div onClick={handleLogout} className='flex items-center justify-center md:justify-start px-2 py-3 hover:bg-gray-200 rounded-full'>
             <div>
               <AiOutlineLogout size={"32px"} />
             </div>
             <h1 className='hidden md:ml-2 md:font-bold md:text-xl lg:ml-2 lg:font-bold lg:text-xl lg:block md:block'>Logout</h1>
          </div>
        </nav>

        <button className='hidden md:block bg-[#1D9BF0] text-white font-bold px-4 py-2 mt-6 rounded-full'>
          Post
        </button>
      </div>


      <Link
          to={`/profile/${user?._id}`}
          className='bg-slate-300  gap-2 items-start transition-all duration-300 py-2 px-4 rounded-full hidden md:flex'
        >
          <div className='avatar'>
            <div className='w-8 rounded-full'>
              <img src={user?.profileImg} alt="profile" className='w-10 h-10 rounded-full' />
            </div>
          </div>
          <div className='flex justify-between flex-1'>
            <div>
              <p className='bg-slate-300 text-gray font-bold text-sm w-20 truncate'>{user?.name}</p>
              <p className='text-slate-500 text-sm'>@{user?.userName}</p>
            </div>
            <AiOutlineLogout
              className='cursor-pointer'
              onClick={handleLogout}
              size={"32px"}
            />
          </div>
        </Link>
      

      
    </div>
  );
}

export default LeftSideBar;




