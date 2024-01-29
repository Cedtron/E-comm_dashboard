import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

export default function Register() {
  const { handleSubmit, register, formState: { errors }, getValues } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleCheckEmail = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/forgot', { action: 'check-email', email: data.email });

      if (response.data.exists) {
        setStep(2);
      } else {
        enqueueSnackbar('Email not found ⚠️', { variant: 'error' });
      }
    } catch (error) {
      //console.error('Error checking email:', error);
      enqueueSnackbar('Error checking email: ⚠️', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/forgot', {
        action: 'confirm-code',
        email: getValues('email'),
        code: data.code,
      });

      if (response.data.correct) {
        setStep(3);
      } else {
        enqueueSnackbar('Incorrect confirmation code ⚠️', { variant: 'error' });
      }
    } catch (error) {
      //console.error('Error confirming code:', error);
      enqueueSnackbar('Error confirming code: ⚠️', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/forgot', {
        action: 'update-password',
        name: data.name,
        email: data.email,
        code: data.confirmationCode, 
        password: data.password,
      });

      if (response.data.success) {
        enqueueSnackbar('Password updated successful👍', { variant: 'success' });
        router.push('/');
      } else {
        enqueueSnackbar('Registration failed ⚠️', { variant: 'error' });
      }
    } catch (error) {
      //console.error('Error registering user:', error);
      enqueueSnackbar('Error registering user: ⚠️', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <div className="max-w-xl m-4 p-10 bg-white rounded shadow-xl">
              {step === 1 && (
                <form onSubmit={handleSubmit(handleCheckEmail)}>
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
                  <div className="mt-4 items-center justify-between">
                    <button
                      className={`px-4 py-1 text-white font-light tracking-wider bg-blue-500 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Checking Email...' : 'Check Email'}
                    </button>
                  </div>
                
                  <a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/">
                    Log in
                  </a>
                
                </form>
              )}
              {step === 2 && (
                <form onSubmit={handleSubmit(handleConfirmCode)}>
                    <div className="mt-2">
                    <label className="block text-sm text-gray-600" htmlFor="code">Confirmation Code</label>
                    <input
                      className={`w-full px-5 py-1 text-gray-700 bg-gray-200 rounded ${errors.code ? 'border-red-500' : ''}`}
                      id="code"
                      {...register('code', { required: true })}
                      type="text"
                      placeholder="Enter Confirmation Code"
                      aria-label="code"
                    />
                    {errors.code && <span className="text-red-500">Confirmation Code is required</span>}
                  </div>
                  <div className="mt-4 items-center justify-between">
                    <button
                      className={`px-4 py-1 text-white font-light tracking-wider bg-blue-500 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Submitting Code...' : 'Submit Code'}
                    </button>
                  </div>
                  <a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/">
                    Log in
                  </a>
                
                </form>
              )}
              {step === 3 && (
                <form onSubmit={handleSubmit(handleRegister)}>
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
                    <button
                      className={`px-4 py-1 text-white font-light tracking-wider bg-blue-500 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                
                  <a className="inline-block right-0 align-baseline font-bold text-sm text-500 text-gray-700 hover:text-blue-600" href="/">
                    Log in
                  </a>
                
                </form>
              )}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}