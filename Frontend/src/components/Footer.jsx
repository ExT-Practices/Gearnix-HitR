import React from 'react'
import { FaFacebook, FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <footer className='h-full p-10 max-[1024px]:p-5 w-full bg-[#171719]'>
      <div className='p-15 max-[1024px]:p-0 grid grid-cols-5 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1  max-[1024px]:gap-10 text-white'>
        <div>
          <h1 className='text-xl font-bold'>Contact us</h1>
          <h2 className='mt-3'>2357 Gordon Street, CA</h2>
          <h3 className='mt-1'>+ (909) - 478-2742</h3>
          <h4 className='mt-1'>GearnixStore@Vinova.com</h4>
          <h5 className='mt-1'>@VinovaGear</h5>
        </div>
        <div>
          <h1 className='text-xl font-bold'>Let us help</h1>
          <ul className='mt-4 gap-3 flex flex-col'>
            <li><a className='hover:text-pink-500 duration-300' href="">Track My Order</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Cancel My Order</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Return My Order</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Search</a></li>
          </ul>
        </div>
        <div>
          <h1 className='text-xl font-bold'>Our policies</h1>
          <ul className='mt-4 gap-3 flex flex-col'>
            <li><a className='hover:text-pink-500 duration-300' href="">Shipping & Delivery</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Shipping & Delivery</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Terms & Conditions</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h1 className='text-xl font-bold'>My Account</h1>
          <ul className='mt-4 gap-3 flex flex-col'>
            <li><a className='hover:text-pink-500 duration-300' href="">Store Location</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Order History</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Wish List</a></li>
            <li><a className='hover:text-pink-500 duration-300' href="">Gift Cards</a></li>
          </ul>
        </div>
        <div>
          <h1 className='text-xl font-bold'>Newsletters</h1>
          <form className='mt-3' action=""><input type="text" placeholder="Enter your email" className='bg-zinc-50 min-w-0 h-15 rounded-full outline-none border-none pl-3 p-2 text-black' />
            <button className="w-20 h-12 mt-1.5 -translate-x-22 text-sm absolute rounded-full bg-pink-500 text-white font-semibold text-lg hover:opacity-90 transition duration-200">Submit</button>
          </form>
          <h1 className='text-xl font-bold mt-3'>Payments</h1>
          <img className='w-50 mt-5' src="https://nov-gearnix.myshopify.com/cdn/shop/files/payment_420x.png?v=1723168147" alt="" />
        </div>
      </div>
      <div className='pl-15 max-[1024px]:pl-0 max-[1024px]:pr-0 p-5 pr-15'>
        <hr className='w-full  text-zinc-300'/>
      </div>
      <div className='justify-center flex flex-col items-center'>
        <img className='w-40 h-6 mt-5' src="https://nov-gearnix.myshopify.com/cdn/shop/files/Logo_white.png?v=1722670258&width=300" alt="" />
        <h2 className='mt-10 text-white max-[425px]:text-center'>Copyright © 2024 Vinovathemes. All Rights Reserved.</h2>
        <div className='flex mt-10 gap-3'>
          <div className='w-10 h-10 rounded-full bg-pink-500 justify-center flex items-center hover:cursor-pointer'><FaFacebookF className='text-white'/></div>
          <div className='w-10 h-10 rounded-full bg-pink-500 justify-center flex items-center hover:cursor-pointer'><FaInstagram className='text-white'/></div>
          <div className='w-10 h-10 rounded-full bg-pink-500 justify-center flex items-center hover:cursor-pointer'><FaTwitter className='text-white'/></div>
          <div className='w-10 h-10 rounded-full bg-pink-500 justify-center flex items-center hover:cursor-pointer'><FaTiktok className='text-white'/></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer