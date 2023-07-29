import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav";
import { HiMenu } from 'react-icons/hi';
import Footer from "@/components/footer";
import {useState} from "react";

export default function Layout({children}) {

    const [showNav,setShowNav] = useState(false);
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
        <div className="bg-white w-screen h-screen flex items-center">
          <div className="text-center w-full">
            <button onClick={() => signIn('google')} className="bg-black p-2 px-4 rounded-lg text-white">Login with Google</button>
          </div>
        </div>
      );
    }
  return (
 

<div className="mx-auto bg-gray-400">
          
        <header className="bg-nav">
            <div className="flex justify-between">
                <div className="p-1 mx-3 inline-flex items-center">
                <button onClick={sidebarToggle}><HiMenu/></button>
                    <h1 className="text-white p-2">Logo</h1>
                </div>
                <div className="p-1 flex flex-row items-center">
               

                    <div className="flex bg-gray-200 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
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
    <div className="min-h-screen flex flex-nowrap">

     <Nav />

        <div className="flex flex-1">

        <main className="bg-gray-100 flex-1 p-3 overflow-hidden">
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
