import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

interface HeroSlide {
  id: string;
  imageUrl: string;
}

interface HeroSliderProps {
  siteConfig?: {
    heroTitle?: string | null;
    heroSubtitle?: string | null;
  } | null;
  slides?: HeroSlide[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'fallback-1',
    imageUrl:
      'https://images.unsplash.com/photo-1565552629477-ff145957d544?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'fallback-2',
    imageUrl:
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1920&auto=format&fit=crop',
  },
  {
    id: 'fallback-3',
    imageUrl:
      'https://images.unsplash.com/photo-1580418827493-f2b22c438544?q=80&w=1920&auto=format&fit=crop',
  },
];

export function HeroSlider({ siteConfig, slides }: HeroSliderProps) {
  const effectiveSlides = useMemo<HeroSlide[]>(() => {
    if (slides && slides.length > 0) {
      return slides;
    }
    return FALLBACK_SLIDES;
  }, [slides]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (effectiveSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % effectiveSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [effectiveSlides.length]);

  if (effectiveSlides.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[600px] max-h-[800px] w-full overflow-hidden bg-gray-900">
      {/* Background Slides */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={effectiveSlides[currentSlide]?.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${effectiveSlides[currentSlide]?.imageUrl})`,
            }}
          />
          {/* Overlay: Darken image for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/20 to-gray-900/30"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content (Absolute) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4 pt-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="inline-block py-1.5 px-5 rounded-full bg-white/10 text-white text-sm font-medium mb-8 border border-white/20 backdrop-blur-md shadow-lg">
              ✨ Mitra Perjalanan Ibadah Terbaik
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white tracking-tight leading-[1.1] drop-shadow-lg">
              {siteConfig?.heroTitle || 'Wujudkan Ibadah Impian Anda'}
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-gray-100 leading-relaxed max-w-3xl mx-auto drop-shadow-md font-light">
              {siteConfig?.heroSubtitle ||
                'Layanan Umroh & Haji Terpercaya dengan Fasilitas Terbaik dan Pembimbing Berpengalaman'}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                to="/contact"
                className="group relative bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-900/30 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Konsultasi Gratis</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link
                to="/services"
                className="group px-10 py-4 rounded-full font-semibold text-lg text-white border border-white/40 hover:bg-white hover:text-blue-900 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1"
              >
                Lihat Paket
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {effectiveSlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === index 
                ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                : "bg-white/30 w-2 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

