
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";
import { CiBookmark } from "react-icons/ci";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { TWEET_API_END_POINT, USER_API_END_POINT } from "../utils/config";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from "../redux/tweetSllice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { timeSince, formatPostDate } from "../utils/config";

const Tweet = ({ tweet }) => {
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.user);
  const { isActive, refresh } = useSelector((state) => state.tweet);
  const dispatch = useDispatch();

  const handleLikeAndDislike = async (id) => {
    try {
      const res = await axios.put(
        `${TWEET_API_END_POINT}/likeTweet/${id}`,
        { id: user?._id },
        {
          withCredentials: true,
        }
      );

      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTweet = async (id) => {
    try {
      const res = await axios.delete(
        `${TWEET_API_END_POINT}/deleteTweet/${id}`,
        {
          withCredentials: true,
        }
      );

      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (id) => {
    try {
      const res = await axios.post(
        `${TWEET_API_END_POINT}/comment/${id}`,
        { comment, id: user?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(getRefresh());
        toast.success(res.data.message);
        setComment("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
  };

  const handleBookmark = async (idx) => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/bookmarks/${idx}`,
        {
          id: user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(getRefresh());
        toast.success(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <div className="border-b border-gray-200 hover:bg-slate-200 cursor-pointer">
      <div className="flex flex-col md:flex-row p-4 md:p-6">
        <Avatar
          src={tweet?.userDetails[0]?.profileImg}
          size="40"
          round={true}
          className="flex-shrink-0"
        />
        <div className="ml-2 w-full">
          <div className="flex items-center">
            <h1 className="font-bold text-base md:text-lg">{tweet?.userDetails[0]?.name}</h1>
            <p className="text-gray-500 ml-1 text-sm md:text-base">{`@${
              tweet?.userDetails[0]?.userName
            } . ${formatPostDate(tweet?.createdAt)}`}</p>
          </div>
          <div className="mt-2 text-base md:text-lg">
            <p>{tweet.description}</p>
            {tweet.img && (
              <img
                src={tweet.img}
                className="w-full h-auto max-h-80 object-cover rounded-lg border border-gray-700 mt-2"
                alt=""
              />
            )}
          </div>

          <div className="flex flex-wrap md:flex-nowrap justify-between my-3 text-sm md:text-base">
            <div className="flex items-center">
              <div
                className="p-2 hover:bg-green-200 rounded-full cursor-pointer"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + tweet._id)
                    .showModal()
                }
              >
                <FaRegComment size={24} />
              </div>
              <dialog
                id={`comments_modal${tweet._id}`}
                className="modal border-none outline-none w-11/12 md:w-2/3 lg:w-1/2"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {tweet?.comments?.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {tweet?.comments?.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <Avatar
                              src={comment?.userDetail?.profileImg}
                              size="40"
                              round={true}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment?.userDetail?.name}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment?.userDetail?.userName}
                            </span>
                          </div>
                          <div className="text-sm">{comment.comment}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="btn btn-primary rounded-full btn-sm text-white px-4"
                      onClick={() => handleComment(tweet._id)}
                    >
                      Post
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <p className="ml-2">{tweet?.comments?.length}</p>
            </div>
            <div className="flex items-center">
              <div
                onClick={() => handleLikeAndDislike(tweet?._id)}
                className="p-2 hover:bg-pink-200 rounded-full cursor-pointer"
              >
                <FaRegHeart
                  className={`${
                    tweet?.like?.length > 0 ? "text-pink-500" : ""
                  }`}
                  size={24}
                />
              </div>
              <p className="text-pink-600 ml-2">{tweet?.like?.length}</p>
            </div>
            <div className="flex items-center">
              <div
                onClick={() => handleBookmark(tweet?._id)}
                className="p-2 hover:bg-yellow-200 rounded-full cursor-pointer"
              >
                <CiBookmark size={24} />
              </div>
              
            </div>
            {user?._id === tweet?.userId && (
              <div className="flex items-center">
                <div
                  onClick={() => handleDeleteTweet(tweet?._id)}
                  className="p-2 hover:bg-red-500 rounded-full cursor-pointer"
                >
                  <MdOutlineDeleteOutline size={24} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;

