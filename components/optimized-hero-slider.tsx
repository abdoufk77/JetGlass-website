'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface SliderImage {
  id: number
  src: string
  alt: string
  title: string
  subtitle: string
}

const defaultImages: SliderImage[] = [
  {
    id: 1,
    src: '/images/slider-1.jpg',
    alt: 'Verrerie moderne',
    title: 'Votre spécialiste en verrerie',
    subtitle: 'Depuis plus de 20 ans, JetGlass vous accompagne dans tous vos projets'
  },
  {
    id: 2,
    src: '/images/slider-2.jpg',
    alt: 'Installation vitrée',
    title: 'Solutions sur mesure',
    subtitle: 'Des créations uniques adaptées à vos besoins spécifiques'
  },
  {
    id: 3,
    src: '/images/slider-3.jpg',
    alt: 'Façade en verre',
    title: 'Expertise et qualité',
    subtitle: 'Un savoir-faire d\'exception pour des résultats durables'
  }
]

const SlideContent = memo(({ image, isActive }: { image: SliderImage; isActive: boolean }) => (
  <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
    isActive ? 'opacity-100' : 'opacity-0'
  }`}>
    <div className="relative h-full w-full">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        priority={image.id === 1}
        quality={85}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            {image.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto animate-fade-in-delay">
            {image.subtitle}
          </p>
          <div className="flex justify-center animate-fade-in-delay-2">
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/devis" prefetch={true}>
                Demander un devis
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
))

SlideContent.displayName = 'SlideContent'

interface OptimizedHeroSliderProps {
  images?: SliderImage[]
  autoPlayInterval?: number
}

export default function OptimizedHeroSlider({ 
  images = defaultImages, 
  autoPlayInterval = 5000 
}: OptimizedHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
  }, [images.length])

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), [])
  const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), [])

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1 || !isLoaded) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length, autoPlayInterval, isLoaded])

  if (images.length === 0) return null

  return (
    <section 
      className="relative h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-full">
        {images.map((image, index) => (
          <SlideContent
            key={image.id}
            image={image}
            isActive={index === currentIndex}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Image précédente"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Image suivante"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>

          {isAutoPlaying && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: `${((currentIndex + 1) / images.length) * 100}%`
                }}
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}
