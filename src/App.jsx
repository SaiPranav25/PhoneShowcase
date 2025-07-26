import { useState } from 'react'

import './index.css'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import Model from './components/Model'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
const App=()=> {


  return (
    <main className='bg-black text-white'>
      <Navbar/>
      <Hero/>
      <Model/>
      <Features />
      <HowItWorks />
      <Footer />

    </main>
  )
}

export default App
