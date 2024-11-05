import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/config";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuLoader } from "react-icons/lu";
import {useDispatch,useSelector} from "react-redux";
import { getUser } from "../redux/userSlice";
import XSvg from "../components/X";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const {refresh} = useSelector((state)=>state.tweet)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {

      // register 
      try {
        setLoading(true)
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          { name, password, userName, email },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          setIsLogin(false);
          setLoading(false)
          toast.success(res?.data?.message);
        }
        
        console.log(res);
      } catch (err) {
        toast.error(err.res?.data?.message);
      }
    } else {

      // login 

      try {
        setLoading(true)
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          { password, email },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (res?.data?.success) {
          setLoading(false)
          dispatch(getUser(res?.data?.user))
          navigate("/");
          toast.success(res?.data?.message);
        }
        console.log(res);
      } catch (err) {
        toast.error(err.res?.data?.message);
      }
    }
  };

  useEffect(()=>{
    handleSubmit()
    
  },[refresh])

  return (
    <div>
      <section className="bg-slate-200">
        
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      
      <div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-black' />
			</div>

      <main className="flex-1 flex flex-col justify-center items-center">
        <div className="max-w-xl lg:max-w-3xl">
          <a className="block text-blue-600" href="#">
            <span className="sr-only">Home</span>
            <img
              className="h-8 sm:h-10"
              src="https://1000logos.net/wp-content/uploads/2017/02/Twitter-Logosu.png"
              alt="twitter-logo-small"
            />
          </a>

          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Welcome to Twitter
          </h1>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Happening Now !!
          </h1>

          <p className="mt-4 leading-relaxed text-gray-500">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>

          {isLogin ? (
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Confirmation
                </label>
                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our
                  <a href="#" className="text-gray-700 underline">
                    {" "}
                    terms and conditions{" "}
                  </a>
                  and
                  <a href="#" className="text-gray-700 underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  {loading ? <LuLoader className="animate-spin" /> : "Create an account"}
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <a
                    href="#"
                    onClick={() => setIsLogin(false)}
                    className="text-gray-700 underline"
                  >
                    Log in
                  </a>
                  .
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full outline-blue-500 border border-gray-800 px-3 py-1 rounded-full my-1 font-semibold shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our
                  <a href="#" className="text-gray-700 underline">
                    {" "}
                    terms and conditions{" "}
                  </a>
                  and
                  <a href="#" className="text-gray-700 underline">
                    privacy policy
                  </a>
                  .
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  {loading ? <LuLoader className="animate-spin" /> : "Login"}
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Do not have an account?
                  <a
                    href="#"
                    onClick={() => setIsLogin(true)}
                    className="text-gray-700 underline"
                  >
                    Sign in
                  </a>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
      </section>
      
      
      
    </div>
  );
};

export default Login;


{/* <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							// onChange={handleInputChange}
							// value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								// onChange={handleInputChange}
								// value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								// onChange={handleInputChange}
								// value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							// onChange={handleInputChange}
							// value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						Sign Up
					</button>
					{/* {isError && <p className='text-red-500'>{error.message}</p>} */}
			// 	</form>
			// 	<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
			// 		<p className='text-white text-lg'>Already have an account?</p>
			// 		<Link to='/login'>
			// 			<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
			// 		</Link>
			// 	</div>
			// </div>
		  // </div> 
