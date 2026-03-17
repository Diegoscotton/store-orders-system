'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Banner } from '@/types'

type Props = {
  banners: Banner[]
}

export default function BannerCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [banners.length, next])

  if (banners.length === 0) return null

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl group">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full h-full shrink-0">
            {banner.link_url ? (
              <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={banner.image_url}
                  alt={banner.title || ''}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={banner.image_url}
                alt={banner.title || ''}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
