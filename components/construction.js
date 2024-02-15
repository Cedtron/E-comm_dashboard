import Image from 'next/image'
import Dev from '@/public/im/development.gif'

export default function Construct() {

  
    return (
        <div className="h-lvh font-sans absolute w-c z-10  bg-cover const">
        <div className="container mx-auto flex flex-1 justify-center items-center">
          <div className="w-full max-w-lg center mt-6">
            
                  <Image
                    src={Dev}
                    width={400}
                    height={400}
                    alt="development"
                  />
               <div className="text-2xl ">System Under Development</div>
          </div>
        </div>
      </div>
    );
  }