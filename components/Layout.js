import React, { useContext } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav";
import Link from 'next/link';
import { HiMenu } from 'react-icons/hi';
import Footer from "@/components/footer";
import {useState} from "react";
import Login from './login';
import Image from 'next/image'
import Logo from '@/public/im/logo.png'
import Spinner from './Spinner';
import { FaCartShopping } from "react-icons/fa6";
import { CartContext } from "@/components/context";

export default function Layout({children}) {

 const { cartProducts, addProduct } = useContext(CartContext);
 const { data: session } = useSession();
    function sidebarToggle() {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.style.display === "none") {
        sidebar.style.display = "block";
      } else {
        sidebar.style.display = "none";
      }
    }

    if (!session) {
      return (
        <div >
           <Spinner />
         <Login />
        </div>
      );
    }
  return (
 

<div className="mx-auto bg-gray-400">
          
        <header className="bg-nav  object-top">
            <div className="flex justify-between">
                <div className="p-1 mx-3 inline-flex items-center">
                <button onClick={sidebarToggle}><HiMenu color="white"/></button>

                 
                    <Image
                    className='mx-2'
  src={Logo}
    width={0}
    height={0}
    priority
    style={{ width: '40px', height: '40px' }}
    alt="logo"
  />
                </div>
                <div className="p-1 flex flex-row items-center">
                       <Link
          type="button"
          href={'/check'}
          className="shadow  focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-4"
        >
        <div className="bg-gray-100 flex justify-center items-center">
    <div className="relative">
  <div className="t-0 absolute left-3">
    <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-1">{cartProducts.length}</p>
  </div>
<FaCartShopping />
</div>
</div>
        </Link>



             

                <div className="flex bg-gray-200 gap-1 text-black rounded-lg overflow-hidden">
  {session?.user?.image ? (
    <img src={session?.user?.image} alt="" className="w-6 h-6" />
  ) : (
    <div className="rounded-full bg-blue-500 text-white w-6 h-6 m-2 flex uppercase font-bold items-center justify-center">
      {session?.user?.name ? session?.user?.name[0] : ''}
    </div>
  )}
  <span className="px-2 m-2 ">
    {session?.user?.name}
  </span>
</div>

                    <div id="ProfileDropDown" className="rounded hidden shadow-md bg-white absolute pin-t mt-12 mr-1 pin-r">
                        <ul className="list-reset">
                          <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-grey-light">My account</a></li>
                          <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-grey-light">Notifications</a></li>
                          <li><hr className="border-t mx-2 border-grey-ligght"/></li>
                          <li><a href="#" className="no-underline px-4 py-2 block text-black hover:bg-grey-light">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header> 
    <div className="h-screen flex flex-nowrap">

     <Nav />

        <div className="flex flex-1">

        <main className="bg-gray-100 flex-1 p-3 overflow-y-auto h-screen">
        {/* <div className="flex flex-col overflow-y-auto h-lvh "> */}
        <div className="flex flex-col">
        {children}


        </div>
         
        </main> 
        
        </div>

    
</div> 
<Footer /> 
    </div>
   
  )
}
