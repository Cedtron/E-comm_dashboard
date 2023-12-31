import React from 'react';
import { useForm } from 'react-hook-form';

export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();

  async function onRegister(data) {
    // Implement your user registration logic here
    // Make sure to compare 'data.password' and 'data.confirmPassword'
    if (data.password === data.confirmPassword) {
      // Passwords match, proceed with registration
      // For example, you can make an API request to create a new user

      // If registration is successful, you can redirect the user or show a success message
      // if (response.success) {
      //   // Redirect or show a success message
      // } else {
      //   // Handle registration error
      // }
    } else {
      // Passwords don't match, handle the error
      // For example, display an error message
      console.log('Passwords do not match');
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
                <div className="">
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
                <div className="mt-2">
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
                <div className="mt-2">
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
                <div className="mt-4 items-center justify-between">
                  <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded w-full" type="submit">Register</button>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">Already registered? <a className="text-blue-500 hover:underline" href="#">Login here</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
