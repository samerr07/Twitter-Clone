import React, { useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Avatar from "react-avatar";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from "../hooks/useGetProfile";
import useGetLikedTweets from "../hooks/useGetLikedTweets";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/config";
import { getRefresh } from "../redux/tweetSllice";
import { followingUpdate } from "../redux/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tweet from "./Tweet";
import EditProfileModal from "./EditProfileModal";
import useUpdateUser from "../hooks/useUpdateUser";
import useUpdateImage from "../hooks/useUpdateImage";

const Profile = () => {
  const [feedType, setFeedType] = useState("posts");
  const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
  const { user, profile } = useSelector((state) => state.user);
  const { tweets, likedTweets } = useSelector((state) => state.tweet);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { id } = useParams();
  // useGetProfile(user?._id)
  useGetProfile(id);
  useGetLikedTweets(id);
  const dispatch = useDispatch();

  const updateImage = useUpdateImage()
  const {loading} = useUpdateImage()

  

  const followAndUnfollowHandler = async () => {
    if (user?.following?.includes(id)) {
      //unfollow
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/unfollow/${id}`,
          { id: user?._id },
          {
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(followingUpdate(id));
          dispatch(getRefresh());
          toast.success(res?.data?.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      //follow
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/follow/${id}`,
          { id: user?._id },
          {
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(followingUpdate(id));
          dispatch(getRefresh());
          toast.success(res?.data?.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

 const handleImageEdit = ()=>{
    console.log({coverImg,profileImg})
    updateImage({ coverImg, profileImg });
    
    setProfileImg(null);
    setCoverImg(null);
  }

  
  //Find the total Posts

  const myTweets = tweets?.filter((tweet)=>tweet.userId === id)



 

  return (
    <div 
    className='w-full md:w-[75%] lg:w-[50%] mx-auto border-l border-r border-gray-200'
    >
      <div className="flex items-center py-2">
        <Link
          to={"/"}
          className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
        >
          <IoMdArrowBack size="24px" />
        </Link>
        <div className="ml-2">
          <h1 className="font-bold text-lg">{profile?.name}</h1>
          <p className="text-gray-500 text-sm">{myTweets?.length} Posts</p>
        </div>
      </div>

      <div className="relative group/cover">
        <img src={profile?.coverImg || "https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360"} 
        className='h-52 w-full object-cover'
        />
       
        <div
          className="z-10 absolute top-2 right-2 rounded-full p-2 bg-white bg-opacity-75 cursor-pointer  group-hover/cover:opacity-100 transition duration-200"
          onClick={() => coverImgRef.current.click()}
        >
          <MdEdit className="w-5 h-5 text-red" />
        </div>
        {/* )} */}

        <input
          type="file"
          hidden
          accept="image/*"
          ref={coverImgRef}
          onChange={(e) => handleImgChange(e, "coverImg")}
        />
        <input
          type="file"
          hidden
          accept="image/*"
          ref={profileImgRef}
          onChange={(e) => handleImgChange(e, "profileImg")}
        />
        <div className="absolute border-4 border-white ml-2 top-32 rounded-full">
          <Avatar
            src={profile?.profileImg || "https://pbs.twimg.com/profile_images/1723552529500274688/-uEfReSn_400x400.jpg"}
            size="120"
            round={true}
          />
          <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100  cursor-pointer">
            {/* {isMyProfile && ( */}
            <MdEdit
              className="w-4 h-4 text-black"
              onClick={() => profileImgRef.current.click()}
            />
            {/* )} */}
          </div>
        </div>
      </div>

      <div className="text-right m-4">
        {profile?._id === user?._id ? (
          // <button onClick={()=>setShow(true)} className="px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400">
          //   Edit Profile
          // </button>
          <EditProfileModal/>
        ) : (
          <button
            onClick={followAndUnfollowHandler}
            className="px-4 py-1 bg-black text-white rounded-full hover:bg-gray-800"
          >
            {user?.following?.includes(id) ? "Following" : "Follow"}
          </button>
        )}
        
        {(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={handleImageEdit}
									>
										{/* {loading ? "Updating..." : "Update"} */}
                    Update
									</button>
								)}
      </div>

      <div className="m-4">
        <h1 className="font-bold text-2xl">{profile?.name}</h1>
        <p className="text-gray-500 text-sm">@{profile?.userName}</p>
      </div>

      <div className="m-2 text-sm">
        <p>
          {
            profile?.bio || `🌐 Exploring the web's endless possibilities with MERN Stack 🚀 |
            Problem solver by day, coder by night 🌙 | Coffee lover ☕ | Join me
            on this coding journey!`
          }
        </p>
      </div>
      <div className="flex gap-2 ml-4">
        <div className="flex gap-1 items-center">
          <span className="font-bold text-xs">{profile?.following.length}</span>
          <span className="text-slate-500 text-xs">Following</span>
        </div>
        <div className="flex gap-1 items-center">
          <span className="font-bold text-xs">{profile?.followers.length}</span>
          <span className="text-slate-500 text-xs">Followers</span>
        </div>
      </div>

      <div className="flex w-full border-b border-gray-700 mt-4">
        <div
          className={`${
            feedType === "posts"
              ? "border-b-4 border-blue-600"
              : "border-b-4 border-transparent"
          } cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}
          onClick={() => setFeedType("posts")}
        >
          Posts
        </div>
        <div
          className={`${
            feedType === "likes"
              ? "border-b-4 border-blue-600"
              : "border-b-4 border-transparent"
          } cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}
          onClick={() => setFeedType("likes")}
        >
          Likes
        </div>
      </div>
      {feedType === "posts"
        ? tweets?.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        : user?._id == id &&
          likedTweets?.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)}
    </div>
  );
};

export default Profile;



