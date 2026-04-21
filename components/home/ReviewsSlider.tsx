'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { reviews, averageRating, totalReviews } from '@/lib/data/reviews';

export default function ReviewsSlider() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoplay]);

  const prev = () => {
    setAutoplay(false);
    setCurrent((p) => (p - 1 + reviews.length) % reviews.length);
  };

  const next = () => {
    setAutoplay(false);
    setCurrent((p) => (p + 1) % reviews.length);
  };

  const review = reviews[current];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-brand-violet-50 to-brand-green-50 dark:from-brand-violet-900/20 dark:to-brand-green-900/10">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ils nous font confiance
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-amber-200 text-amber-200'}`}
                />
              ))}
            </div>
            <span className="font-bold text-xl text-foreground">{averageRating}/5</span>
            <span className="text-muted-foreground">({totalReviews} avis)</span>
          </div>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
              className="bg-card rounded-3xl p-8 sm:p-10 shadow-xl border border-border relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-brand-violet-100 dark:text-brand-violet-900" />

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-lg text-foreground leading-relaxed mb-6 font-medium">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-11 h-11 rounded-full gradient-violet flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{review.name}</div>
                  <div className="text-sm text-muted-foreground">{review.service} · {review.date}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-card border border-border hover:bg-brand-violet-50 dark:hover:bg-brand-violet-900/30 hover:border-brand-violet-200 text-muted-foreground hover:text-brand-violet-500 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoplay(false); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-brand-violet-500 w-6' : 'bg-border w-2 hover:bg-brand-violet-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-card border border-border hover:bg-brand-violet-50 dark:hover:bg-brand-violet-900/30 hover:border-brand-violet-200 text-muted-foreground hover:text-brand-violet-500 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
