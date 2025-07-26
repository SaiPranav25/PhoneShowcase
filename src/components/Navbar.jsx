import React, { useState } from 'react'
import { appleImg, bagImg, searchImg } from '../utils'
import { navLists } from '../constants';
import { MessageCircle } from 'lucide-react';
import Chatbot from './Chatbot';

const Navbar = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <header className='w-full py-5 sm:px-10 px-5 flex items-center justify-between'>
          <nav className='flex w-full screen-max-width'>
              <img src={appleImg} alt="Apple" height={18} width={14}/>
              <div className='flex flex-1 justify-center max-sm:hidden'>
                  {navLists.map((nav)=>(
                      <div key={nav} className='text-sm px-5 cursor-pointer text-gray hover:text-white transition-all' >
                          {nav}
                      </div>
                  ))}
              </div>
              <div className='flex items-baseline gap-5 max-sm:justify-end max-sm:flex-1'>
                  <img src={searchImg} alt="Search" height={18} width={18}/>
                  <img src={bagImg} alt="Bag" height={18} width={18}/>
              </div>
          </nav>
      </header>

      {/* AI Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 group bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask AI Assistant
        </div>
      </button>

      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </>
  )
}

export default Navbar