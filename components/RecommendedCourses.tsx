"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { recommendedCourses } from '../data/recommendedCourses';

export default function RecommendedCourses() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || recommendedCourses.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % recommendedCourses.length), 4000);
    return () => clearInterval(timer);
  }, [paused]);

  if (!recommendedCourses.length) return null;
  const course = recommendedCourses[index % recommendedCourses.length];

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <GraduationCap className="text-indigo-500 w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">推荐课程</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">如果你也有学习的意愿，这里收录了我认为对自己有所启发的课程</p>
        </div>
      </div>

      <div className="w-full">
        {/* 🌟 课程大卡片（占满整行） */}
        <Link
          href={`/posts/${course.slug}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] relative group min-h-[240px] sm:min-h-[280px] md:min-h-[320px] block"
        >
          <img
            src={course.cover}
            alt={course.title}
            className="w-full h-full absolute inset-0 object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-105 opacity-90"
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 transition-colors duration-500"></div>
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 underline decoration-pink-400">{course.title}</h3>
            <p className="text-white/90 text-sm sm:text-lg line-clamp-1">{course.difficulty} · {course.category}</p>
          </div>
          <div className="absolute top-3 right-4 flex gap-1.5">
            {recommendedCourses.map((c, i) => (
              <span
                key={c.slug}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
