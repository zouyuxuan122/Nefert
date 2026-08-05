"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function formatFictionDate(date: string) {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return date;
  return `${Number(m[2])}月${Number(m[3])}日上传`;
}

export interface FictionItem {
  slug: string;
  title: string;
  date: string;
  cover: string;
  tags: string[];
  motto: string;
  excerpt: string;
}

export default function HomeFictionPoster({ fictions }: { fictions: FictionItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || fictions.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % fictions.length), 4000);
    return () => clearInterval(timer);
  }, [paused, fictions.length]);

  if (!fictions.length) return null;
  const fiction = fictions[index % fictions.length];

  return (
    <section className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-widest transition-colors duration-700">
          <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
          小说集
        </h2>
        <Link href="/chatter?tab=fiction" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:opacity-70 transition-opacity">
          全部小说 →
        </Link>
      </div>

      <Link
        href={`/fiction/${fiction.slug}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] relative group min-h-[200px] sm:min-h-[220px] block"
      >
        <img
          src={fiction.cover}
          alt={fiction.title}
          className="w-full h-full absolute inset-0 object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-105 opacity-90"
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 transition-colors duration-500"></div>

        <div className="absolute top-3 left-4 flex items-center gap-1.5">
          <span className="text-[10px] font-black text-white bg-pink-500/80 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-wider">小说</span>
          {fiction.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-bold text-pink-100 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full tracking-wide">#{tag}</span>
          ))}
        </div>

        <div className="absolute top-3 right-4 flex gap-1.5">
          {fictions.map((f, i) => (
            <span
              key={f.slug}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6">
          {fiction.motto && (
            <p className="text-white/75 italic text-xs sm:text-sm font-medium leading-snug mb-1 sm:mb-2 drop-shadow-md">
              —— {fiction.motto}
            </p>
          )}
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 underline decoration-pink-400">{fiction.title}</h3>
          <p className="text-white/90 text-sm sm:text-lg line-clamp-1">{fiction.excerpt}</p>
          <p className="text-white/60 text-xs sm:text-sm mt-1.5 font-medium">{formatFictionDate(fiction.date)}</p>
        </div>
      </Link>
    </section>
  );
}
