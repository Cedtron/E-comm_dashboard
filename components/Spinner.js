import React, { useState, useEffect } from 'react';
import {BounceLoader} from "react-spinners";
import Image from 'next/image'
import Logo from '@/public/im/logo.png'

export default function Spinner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-blue-500 ${loading ? '' : 'hidden'}`}>
    <Image
  src={Logo}
    width={200}
    height={200}
    alt="logo"
  />
    <h3 className="loader-text text-white antialiased font-bold">Baala</h3>
     <div className="my-8 loader"></div>
      <footer className="text-white mt-8 text-sm">&copy; {new Date().getFullYear()} All rights reserved</footer>
    </div>
  );
}