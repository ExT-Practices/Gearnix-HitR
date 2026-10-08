import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

function Home() {
  return (
    <>
      {/* 1 */}
      <div className='bg-[#29282e] w-full h-165 max-[1024px]:h-120 max-[768px]:h-50'>
        <Swiper
          loop={true}
          autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          }}
          pagination={{
          dynamicBullets: true,
          }}
          modules={[Autoplay,Pagination]}
          className="mySwiper"
        >
        <SwiperSlide>
        {/* 01 */}
        <div className='flex p-10 max-[1024px]:p-0 justify-between items-center '>
          <div className='ml-30 max-[1024px]:ml-15 max-[768px]:ml-5'>
            <h1 className='text-[42px] max-[1024px]:text-[33px] max-[768px]:text-[15px] font-semibold leading-tight text-white'>Elevate Your Experience<br/> with Top-Tier Gaming Gear</h1>
            <h2 className='text-white mt-3 max-[768px]:text-xs'>Discover the Cutting-Edge Gear That Will Revolutionize Your Gaming Journey</h2>
            <button className='mt-8 max-[768px]:mt-5 px-6 py-4 max-[768px]:px-3 max-[768px]:py-2 max-[768px]:text-sm rounded-full text-white cursor-pointer font-semibold bg-pink-500 flex itmes-center gap-3 '>Shop the Collection<FaArrowRight className='mt-1'/></button>
          </div>
          <div className='flex justify-center items-center p-10'>
            <img className='h-120 max-[1024px]:h-100 max-[768px]:h-50 max-[768px]:w-50 mr-35 max-[1024px]:mr-15 max-[768px]:mr-0' src="https://nov-gearnix.myshopify.com/cdn/shop/files/s-1-1-img_1366x.png?v=1723428269" alt="" />
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide>
        {/* 02 */}
        <div className='flex p-10 max-[1024px]:p-0 justify-between items-center '>
          <div className='ml-30 max-[1024px]:ml-15 max-[768px]:ml-5'>
            <h1 className='text-[42px] max-[1024px]:text-[33px] max-[768px]:text-[15px] font-semibold leading-tight text-white'>Elevate Your Experience<br/> with Top-Tier Gaming Gear</h1>
            <h2 className='text-white mt-3 max-[768px]:text-xs'>Discover the Cutting-Edge Gear That Will Revolutionize Your Gaming Journey</h2>
            <button className='mt-8 max-[768px]:mt-5 px-6 py-4 max-[768px]:px-3 max-[768px]:py-2 max-[768px]:text-sm rounded-full text-white cursor-pointer font-semibold bg-pink-500 flex itmes-center gap-3 '>Shop the Collection<FaArrowRight className='mt-1'/></button>
          </div>
          <div className='flex justify-center items-center p-10'>
            <img className='h-120 max-[1024px]:h-80 max-[768px]:h-50 max-[768px]:w-75 mr-35 max-[1024px]:mr-15 max-[768px]:mr-0' src="https://nov-gearnix.myshopify.com/cdn/shop/files/s-1-2-img_1366x.png?v=1723428269" alt="" />
          </div>
        </div>
        </SwiperSlide>
        <SwiperSlide>
        {/* 03 */}
        <div className='flex p-10 max-[1024px]:p-0  justify-between items-center '>
          <div className='ml-30 max-[1024px]:ml-15 max-[768px]:ml-5'>
            <h1 className='text-[42px] max-[1024px]:text-[33px] max-[768px]:text-[15px] font-semibold leading-tight text-white'>Elevate Your Experience<br/> with Top-Tier Gaming Gear</h1>
            <h2 className='text-white mt-3 max-[768px]:text-xs '>Discover the Cutting-Edge Gear That Will Revolutionize Your Gaming Journey</h2>
            <button className='mt-8 max-[768px]:mt-5 px-6 py-4 max-[768px]:px-3 max-[768px]:py-2 max-[768px]:text-sm rounded-full text-white cursor-pointer font-semibold bg-pink-500 flex itmes-center gap-3 '>Shop the Collection<FaArrowRight className='mt-1'/></button>
          </div>
          <div className='flex justify-center items-center p-10'>
            <img className='h-100 max-[1024px]:h-65 max-[768px]:h-50 mr-10 max-[1024px]:mr-5' src="https://nov-gearnix.myshopify.com/cdn/shop/files/s-1-3-img_1024x.png?v=1723428269" alt="" />
          </div>
        </div>
        </SwiperSlide>
      </Swiper>
      </div>
      {/* 2 */}
        <div className='flex p-15 max-[768px]:p-0 max-[1024px]:gap-5 justify-between items-center h-50 max-[1024px]:h-150 max-[768px]:h-200 max-[768px]:pt-20 bg-[#29282e] max-[1024px]:grid-cols-2 max-[1024px]:grid max-[768px]:grid-cols-1'>
          {/* 01 */}
          <div className='max-[1024px]:hidden max-[768px]:flex flex justify-center items-center gap-10 max-[768px]:gap-5 '>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-1_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white '>
              <h1 className='font-semibold text-xl'>Free Shipping</h1>
              <h1 className='leading-tight mt-2'>Free Shipping to Make <br/>Your Shopping <br/>Experience Seamless.</h1>
            </div>
          </div>
          <div className='max-[1024px]:flex max-[768px]:hidden hidden flex-col justify-center items-center gap-5'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-1_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white items-center text-center'>
              <h1 className='font-semibold text-xl'>Free Shipping</h1>
              <h1 className='leading-tight mt-2'>Free Shipping to Make Your Shopping Experience Seamless.</h1>
            </div>
          </div>
          {/* 02 */}
          <div className='max-[1024px]:hidden max-[768px]:flex flex justify-center items-center gap-10 max-[768px]:gap-5 max-[768px]:-mt-'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-2_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white '>
              <h1 className='font-semibold text-xl'>Return Policy</h1>
              <h1 className='leading-tight mt-2'>Flexible Returns to<br/>Ensure a Positive <br/>Shopping Experience.</h1>
            </div>
          </div>
          <div className='max-[1024px]:flex max-[768px]:hidden hidden flex-col justify-center items-center gap-5'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-2_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white items-center text-center'>
              <h1 className='font-semibold text-xl'>Return Policy</h1>
              <h1 className='leading-tight mt-2'>Flexible Returns to Ensure a Positive Shopping Experience.</h1>
            </div>
          </div>
          {/* 03 */}
          <div className='max-[1024px]:hidden max-[768px]:flex flex max-[768px]:ml-3 justify-center items-center gap-10 max-[768px]:gap-5 max-[768px]:-mt-'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-3_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white '>
              <h1 className='font-semibold text-xl'>Save Money</h1>
              <h1 className='leading-tight mt-2'>Shop Smarter and Save <br/>Big with Our Money-<br/>Saving Solutions.</h1>
            </div>
          </div>
          <div className='max-[1024px]:flex max-[768px]:hidden hidden flex-col justify-center items-center gap-5'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-3_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white items-center text-center'>
              <h1 className='font-semibold text-xl'>Save Money</h1>
              <h1 className='leading-tight mt-2'>Shop Smarter and Save Big with Our Money- Saving Solutions.</h1>
            </div>
          </div>
          {/* 04 */}
          <div className='max-[1024px]:hidden max-[768px]:flex flex max-[768px]:ml-3 justify-center items-center gap-10 max-[768px]:gap-5 max-[768px]:-mt-'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-4_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white '>
              <h1 className='font-semibold text-xl'>Support 24/7</h1>
              <h1 className='leading-tight mt-2'>Unparalleled Support, <br/>Tailored to Your Needs<br/>24 Hours a Day.</h1>
            </div>
          </div> 
          <div className='max-[1024px]:flex max-[768px]:hidden hidden flex-col justify-center items-center gap-5'>
            <div className='h-25 w-25 rounded-full justify-center items-center shadow-[0_0_20px_2px_rgba(236,72,153,0.8)] flex'>
              <img className='h-13' src="https://nov-gearnix.myshopify.com/cdn/shop/files/p-1-4_200x.png?v=1722908549" alt="" />
            </div>
            <div className='flex flex-col justify-center text-white items-center text-center'>
              <h1 className='font-semibold text-xl'>Support 24/7</h1>
              <h1 className='leading-tight mt-2'>Unparalleled Support, Tailored to Your Needs 24 Hours a Day.</h1>
            </div>
          </div>   
        </div>
    </>
  )
}

export default Home