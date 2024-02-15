import Image from 'next/image'
import Dev from '@/public/im/development.gif'

export default function Construct() {

  
    return (
        <div className="h-screen font-sans w-fit z-20 fixed bg-cover const">
        <div className="container mx-auto h-full flex flex-1 justify-center items-center">
          <div className="w-full max-w-lg mx-auto">
            
                  <Image
                    src={Dev}
                    width={300}
                    height={300}
                    alt="development"
                  />
               <div className="text-2xl text-center">System Under Development</div>
          </div>
        </div>
      </div>
    );
  }