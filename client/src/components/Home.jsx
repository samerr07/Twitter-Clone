import React, { useEffect } from 'react'
import LeftSideBar from './LeftSideBar'
import RightSideBar from './RightSideBar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useOtherUser from '../hooks/useOtherUser'
import useGetAllTweets from '../hooks/useGetAllTweets'
import useGetFollowingTweets from '../hooks/useGetFollowingTweet'

const Home = () => {

  const {user, otherUsers} = useSelector((state)=>state.user)
  const navigate = useNavigate()

  useDispatch(useOtherUser(user?._id))
  useDispatch(useGetAllTweets(user?._id))
  useDispatch(useGetFollowingTweets(user?._id))
  
  //if user is not login

  useEffect(()=>{
    if(!user){
      navigate("/login")
    }
  },[])

  return (
    <div className='flex justify-between w-[80%] mx-auto  '>
      {/* <LeftSideBar />
      <Feed/>
      <RightSideBar/> */}
{/* <input type="checkbox" value="synthwave" className="toggle theme-controller" /> */}
      <LeftSideBar />
      <Outlet/>
      <RightSideBar className="hidden md:hidden lg:block" otherUsers={otherUsers}/>
    </div>

  )
}

export default Home




