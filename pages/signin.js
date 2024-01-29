import React from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();

const router = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  async function onRegister(data) {
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }
  
    try {
      // Make an API request to register the user
      const response = await axios.post('/api/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        passhint: data.passhint,
      });
  
      if (response.status === 201) {
        router.push('/');
        enqueueSnackbar('User registered successfully👍', { variant: 'success' });
      } else {
        // Handle registration failure
        enqueueSnackbar('Registration failed⚠️', { variant: 'error' });
      }
    } catch (error) {
      // Handle any network or server error
      //console.error('Registration error ⚠️:', error);
      enqueueSnackbar('Registration error⚠️', { variant: 'error' });
    }
  }

  // Function to handle Google Sign-In
  async function signIn() {
    try {
      // Sign in the user with Google
      await signIn('google', { callbackUrl: '/' }); // Replace 'google' with your NextAuth.js provider name if needed
    } catch (error) {
    
      //console.error('Google Sign-In error:', error);

 enqueueSnackbar(error, { variant: 'Google Sign-In error⚠️' });

    }
  }

  return (
    <div className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <div className="max-w-xl m-4 p-10 bg-white rounded shadow-xl">
              <form onSubmit={handleSubmit(onRegister)}>
                <p className="text-gray-800 text-center text-lg font-bold">Register</p>
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600" htmlFor="name">Name</label>
                    <input
                      className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.name ? 'border-red-500' : ''}`}
                      id="name"
                      {...register('name', { required: true })}
                      type="text"
                      placeholder="Your Name"
                      aria-label="name"
                    />
                    {errors.name && <span className="text-red-500">Name is required</span>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600" htmlFor="email">Email</label>
                    <input
                      className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.email ? 'border-red-500' : ''}`}
                      id="email"
                      {...register('email', { required: true })}
                      type="email"
                      placeholder="Your Email"
                      aria-label="email"
                    />
                    {errors.email && <span className="text-red-500">Email is required</span>}
                  </div>
                  <div className="mb-4">
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
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      id="confirmPassword"
                      {...register('confirmPassword', {
                        required: true,
                        validate: (value) => value === getValues('password') || 'Passwords do not match',
                      })}
                      type="password"
                      placeholder="*******"
                      aria-label="confirmPassword"
                    />
                    {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600" htmlFor="passhint">Passhint</label>
                    <input
                      className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.passhint ? 'border-red-500' : ''}`}
                      id="passhint"
                      {...register('passhint', { required: true })}
                      type="passhint"
                      placeholder="Your Passhint"
                      aria-label="passhint"
                    />
                    {errors.passhint && <span className="text-red-500">Passhint is required</span>}
                  </div>


                </div>
                <div className="mt-4">
                  <button className="px-4 py-1 text-white font-light tracking-wider bg-blue-500 rounded w-full" type="submit">Register</button>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">Already registered? <a className="text-blue-500 hover:underline" href="#">Login here</a></p>
              </form>
              {/* <button onClick={ signIn} className="bg-blue-500 p-2 px-4 rounded-lg text-white">Register with Google</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
