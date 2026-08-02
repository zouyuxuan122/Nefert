"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Album } from '../data/albums';

export default function HomeAlbumPoster({ albums }: { albums: Album[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || albums.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % albums.length), 4000);
    return () => clearInterval(timer);
  }, [paused, albums.length]);

  if (!albums.length) return null;
  const album = albums[index % albums.length];

  return (
    <Link
      href="/photowall"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] relative group min-h-[200px] sm:min-h-[220px] flex-shrink-0 block"
    >
      <img
        src={album.cover}
        alt={album.title}
        className="w-full h-full absolute inset-0 object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-90"
      />
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 transition-colors duration-500"></div>
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 underline decoration-pink-400">{album.title}</h3>
        <p className="text-white/90 text-sm sm:text-lg line-clamp-1">{album.description}</p>
      </div>
      <div className="absolute top-3 right-4 flex gap-1.5">
        {albums.map((a, i) => (
          <span
            key={a.id}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIndex(i); }}
            className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </Link>
  );
}
