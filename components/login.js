import { signIn } from "next-auth/react";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';


export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isButtonClicked, setButtonClicked] = useState(false);

  async function onLogin(data) {
    const res = await signIn("credentials", {
      email: data.emali,
      password: data.password,
      redirect: true,
      callbackUrl: "/",
    }); 

    setButtonClicked(true);
 
  }

  return (
    <div className="h-screen font-sans login bg-cover">
     
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <div className="max-w-xl m-4 p-10 bg-white rounded shadow-xl">
              <form onSubmit={handleSubmit(onLogin)}>
                <p className="text-gray-800 text-center text-lg font-bold">Login</p>
                <div className="">
                  <label className="block text-sm text-gray-600" htmlFor="emali">Email</label>
                  <input
                    className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.emali ? 'border-red-500' : ''}`}
                    id="emali"
                    {...register('emali', { required: true })}
                    type="text"
                    placeholder="Email"
                    aria-label="emali"
                  />
                  {errors.emali && <span className="text-red-500">emali is required</span>}
                </div>
                <div className="mt-2">
                  <label className="block text-sm text-gray-600" htmlFor="password">Password</label>
                  <input
                    className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.password ? 'border-red-500' : ''}`}
                    id="password"
                    {...register('password', { required: true })}
                    type="password"
                    placeholder="*******"
                    aria-label="password"
                  />
                  {errors.password && <span className="text-red-500">Password is required</span>}
                </div>
                <div className="mt-4 items-center justify-between">
                  
                <button
                    className={`px-4 py-1 text-white font-light tracking-wider bg-blue-500 rounded w-full`}
                    type="submit"
                    disabled={isButtonClicked}
                  >
                    {isButtonClicked ? 'Logging in...' : 'Login'}
                  </button>

                  <a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/forgot">
                    Forgot Password?
                  </a>
                </div>
                <a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/signin">
                  Not registered?
                </a>
                
              </form><a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/support">
                  Support
                </a>
              {/* <button onClick={() => signIn('google')} className="bg-black p-2 px-4 rounded-lg text-white">Login with Google</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
