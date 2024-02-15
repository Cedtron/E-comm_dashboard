import React from 'react';
import Image from 'next/image'
import Service from '@/public/im/Service.gif'
import { FaWhatsapp } from 'react-icons/fa';
import { RiExternalLinkLine } from 'react-icons/ri';


export default function Support() {
 
  const whatsappNumber = "+256772728459"; // Replace this with your WhatsApp number
  const message = "Hello! I'm impressed by your services and would love to learn more";

  return (
    <div className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <div className="max-w-xl m-4 p-10 bg-white rounded shadow-xl">
              <div className="m-4 place-content-center">
                <Image
                  src={Service}
                  width={300}
                  height={300}
                  alt="Picture of the author"
                />
              </div>
              <div className="text-center">
                <div className="mt-4">
                <p className="text-lg text-gray-800 mb-4">Welcome to our support page! We're here to assist you with any inquiries or concerns you may have.</p>
                <a href={`whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`} className="inline-block text-3xl text-green-500 mr-2">
                    <FaWhatsapp />
                  </a>
                  <span className="text-lg">0772728459</span>
                </div>
                <div className="mt-2">
                  <RiExternalLinkLine className="inline-block text-3xl text-blue-500 mr-2" />
                  <a href="https://cedo-plum.vercel.app" target="_blank" rel="noopener noreferrer" className="text-lg">Cedo developer</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
