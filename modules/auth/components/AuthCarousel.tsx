"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = ["/banners/banner-01.jpeg"];

export default function AuthCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt="Banner"
          fill
          priority
          quality={100}
          sizes="100vw"
          className={`
            object-cover object-center
            transition-all duration-[2000ms] ease-out
            ${i === index ? "opacity-100 scale-105" : "opacity-0 scale-100"}
          `}
        />
      ))}

      {/* overlay cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

      {/* leve escurecimento global */}
      <div className="absolute inset-0 bg-black/30" />

      {/* texto opcional */}
      <div className="absolute bottom-10 left-10 max-w-md text-white z-10">
        <h2 className="text-3xl font-semibold leading-tight">
          Descubra, organize e acompanhe seus filmes
        </h2>
        <p className="mt-2 text-sm text-zinc-300">
          Uma experiência simples e poderosa para cinéfilos
        </p>
      </div>

    </div>
  );
}