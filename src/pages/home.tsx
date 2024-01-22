import Image from 'next/image'
import { Inter } from 'next/font/google'
import SideBar from '@/components/sidebar'
import MainTab from '@/components/mainTab'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  return (
    <>
    <div className='w-screen h-screen px-32 py-10 overflow-hidden flex flex-col items-center justify-center'>
      <div className='w-full h-full flex justify-between'>
         {/* Sidebar */}
          <div className='h-full w-[25%] rounded-md bg-gray-100 flex flex-col items-center justify-between p-4 border border-gray-700'>
            <SideBar setSelectedItem={setSelectedItem} />
          </div>

          {/* tab and chat section */}
          <div className='h-full w-[70%] bg-gray-100 rounded-md flex flex-col items-center justify-between p-2'>
            <MainTab selectedItem={selectedItem}/>
          </div> 
      </div>
    </div>   
    </>
  )
}
