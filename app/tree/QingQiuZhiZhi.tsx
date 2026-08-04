"use client";

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ChevronRight, ChevronDown, User, CalendarDays, ExternalLink, GraduationCap, Trees } from 'lucide-react';

// 分类主题色（用于树节点与卡片装饰）
const categoryThemes: Record<string, { bg: string; text: string; ring: string; grad: string }> = {
  'Python': { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-400/40', grad: 'from-sky-500/20 via-cyan-500/10 to-transparent' },
  '前端基础': { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-400/40', grad: 'from-rose-500/20 via-orange-500/10 to-transparent' },
  'JavaScript': { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-400/40', grad: 'from-amber-500/20 via-yellow-500/10 to-transparent' },
  'TypeScript': { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-400/40', grad: 'from-blue-500/20 via-indigo-500/10 to-transparent' },
  '前端框架': { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-400/40', grad: 'from-cyan-500/20 via-sky-500/10 to-transparent' },
  'Electron': { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', ring: 'ring-slate-400/40', grad: 'from-slate-500/20 via-zinc-500/10 to-transparent' },
  '后端': { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-400/40', grad: 'from-emerald-500/20 via-teal-500/10 to-transparent' },
  '数据库': { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', ring: 'ring-teal-400/40', grad: 'from-teal-500/20 via-emerald-500/10 to-transparent' },
  '工具链': { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-400/40', grad: 'from-violet-500/20 via-purple-500/10 to-transparent' },
  '编程基础': { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-400/40', grad: 'from-indigo-500/20 via-blue-500/10 to-transparent' },
  '算法': { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-400/40', grad: 'from-purple-500/20 via-fuchsia-500/10 to-transparent' },
  '软件工程': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-600 dark:text-fuchsia-400', ring: 'ring-fuchsia-400/40', grad: 'from-fuchsia-500/20 via-pink-500/10 to-transparent' },
  'AI 与数据': { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', ring: 'ring-pink-400/40', grad: 'from-pink-500/20 via-rose-500/10 to-transparent' },
  '设计与创意': { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-400/40', grad: 'from-orange-500/20 via-amber-500/10 to-transparent' },
  '办公技能': { bg: 'bg-lime-500/10', text: 'text-lime-600 dark:text-lime-400', ring: 'ring-lime-400/40', grad: 'from-lime-500/20 via-green-500/10 to-transparent' },
};

const defaultTheme = { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-400/40', grad: 'from-indigo-500/20 via-purple-500/10 to-transparent' };

export default function QingQiuZhiZhi({ posts = [] }: any) {
  // 🌟 只保留课程文章（带 category 元数据的）
  const coursePosts = useMemo(
    () => posts.filter((p: any) => p.category && p.type === 'post'),
    [posts]
  );

  // 🌟 构建树：分类 -> 子类 -> 课程列表
  const tree = useMemo(() => {
    const map: Record<string, Record<string, any[]>> = {};
    coursePosts.forEach((p: any) => {
      const cat = p.category || '其他';
      const sub = p.sub || '综合';
      if (!map[cat]) map[cat] = {};
      if (!map[cat][sub]) map[cat][sub] = [];
      map[cat][sub].push(p);
    });
    // 按分类内课程数量排序，子类保持出现顺序
    const sortedCats = Object.keys(map).sort((a, b) => {
      const ca = Object.values(map[a]).reduce((s: number, arr: any) => s + arr.length, 0);
      const cb = Object.values(map[b]).reduce((s: number, arr: any) => s + arr.length, 0);
      return cb - ca;
    });
    return sortedCats.map(cat => ({
      name: cat,
      count: Object.values(map[cat]).reduce((s: number, arr: any) => s + arr.length, 0),
      subs: Object.entries(map[cat]).map(([subName, list]) => ({
        name: subName,
        list: (list as any[]).sort((a, b) => (a.date > b.date ? 1 : -1)),
      })),
    }));
  }, [coursePosts]);

  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const toggleCat = (name: string) => {
    setExpandedCats(prev => ({ ...prev, [name]: !prev[name] }));
    setActiveCat(activeCat === name ? null : name);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 顶部总览 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm mb-4">
          <Trees size={16} className="text-indigo-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            已修习 <span className="text-indigo-600 dark:text-indigo-400">{coursePosts.length}</span> 门课程 ·{' '}
            <span className="text-indigo-600 dark:text-indigo-400">{tree.length}</span> 大领域
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic">
          秋收冬藏，学海无涯。每一门课程都是一枚金黄的果实，挂在清秋的枝头。
        </p>
      </div>

      {/* 领域树 */}
      <div className="flex flex-col gap-5">
        {tree.map((cat, catIdx) => {
          const theme = categoryThemes[cat.name] || defaultTheme;
          const isExpanded = expandedCats[cat.name] ?? (catIdx === 0);
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: catIdx * 0.05 }}
              className="relative"
            >
              {/* 树形连接线 */}
              {catIdx < tree.length - 1 && (
                <div className="absolute left-6 top-full h-5 w-px bg-gradient-to-b from-indigo-400/40 to-transparent hidden md:block" />
              )}

              {/* 分类节点 */}
              <button
                onClick={() => toggleCat(cat.name)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/50 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm hover:shadow-md transition-all group ${isExpanded ? 'ring-2 ' + theme.ring : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.bg} ${theme.text} shrink-0 transition-transform group-hover:scale-110`}>
                  <GraduationCap size={18} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 dark:text-white tracking-wide">{cat.name}</span>
                    <span className={`text-[10px] font-bold ${theme.text} px-2 py-0.5 rounded-full ${theme.bg}`}>
                      {cat.count} 门
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 flex items-center gap-1 flex-wrap">
                    {cat.subs.map(s => (
                      <span key={s.name} className="mr-1">✦ {s.name} <span className="opacity-60">× {s.list.length}</span></span>
                    ))}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown size={18} className="text-slate-400 shrink-0 transition-transform" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400 shrink-0 transition-transform" />
                )}
              </button>

              {/* 子类与课程卡片 */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="relative mt-2 ml-6 md:ml-12 pl-5 md:pl-8 border-l-2 border-dashed border-indigo-300/50 dark:border-indigo-500/20 py-3 flex flex-col gap-6">
                      {/* 渐变氛围背景 */}
                      <div className={`absolute -left-2 top-0 bottom-0 w-24 pointer-events-none bg-gradient-to-r ${theme.grad} opacity-40 blur-xl`} />

                      {cat.subs.map(sub => (
                        <div key={sub.name}>
                          {/* 子类节点 */}
                          <div className="flex items-center gap-2 mb-3 relative">
                            <span className={`w-2.5 h-2.5 rounded-full ${theme.bg} ring-2 ${theme.ring} shrink-0`} />
                            <span className={`font-bold text-sm ${theme.text}`}>{sub.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({sub.list.length})</span>
                          </div>

                          {/* 课程卡片流 */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                            {sub.list.map((course: any, i: number) => (
                              <motion.div
                                key={course.slug}
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
                                className="group relative"
                              >
                                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                  {/* 封面（仿归档样式） */}
                                  <Link href={`/posts/${course.slug}`} className="block relative h-16 md:h-24 overflow-hidden">
                                    <img
                                      src={course.cover}
                                      alt={course.title}
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <span className="absolute bottom-1.5 left-2 text-white/90 text-[9px] md:text-[10px] font-mono font-bold bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <CalendarDays size={9} /> {course.completedAt}
                                    </span>
                                  </Link>

                                  {/* 信息区 */}
                                  <div className="p-2 md:p-3 flex flex-col flex-1">
                                    <Link href={`/posts/${course.slug}`} className="group/link">
                                      <h4 className="text-[11px] md:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors">
                                        {course.title}
                                      </h4>
                                    </Link>
                                    <div className="mt-auto pt-1.5 md:pt-2 flex flex-col gap-1">
                                      <span className="flex items-center gap-1 text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                                        <User size={9} className="shrink-0" /> {course.author}
                                      </span>
                                      {course.link && (
                                        <a
                                          href={course.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-indigo-500 dark:text-indigo-400 hover:underline w-max"
                                          onClick={e => e.stopPropagation()}
                                        >
                                          <ExternalLink size={9} /> 原课程
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div className="mt-14 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <BookOpen size={14} className="text-indigo-500" />
          点击分类节点展开课程树 · 点击卡片阅读课程笔记
        </div>
      </div>
    </div>
  );
}
