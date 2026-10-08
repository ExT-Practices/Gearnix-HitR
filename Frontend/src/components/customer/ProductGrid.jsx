import React from "react";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const ProductGrid = ({ products, isSlider = false }) => {
  if (!products || !products.length) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-semibold text-gray-800">
          No products found
        </h3>

        <p className="mt-2 text-gray-500">
          Try another search or category.
        </p>
      </div>
    );
  }

  if (isSlider && products.length > 4) {
    return (
      <div className="relative px-2">
        <Swiper
          modules={[Autoplay, Pagination ]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="!pb-10"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto flex pb-2 mt-5">
              <div className="w-full h-full">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
