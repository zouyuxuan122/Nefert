"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// ==========================================
// 🌟 黍姐姐的专属语音库
// ==========================================
const SHU_QUOTES = [
  "好好吃饭，好好休息。剩下的，交给我。",
  "这片大地的丰收，可不能只靠祈求。",
  "你看起来好像又瘦了？快过来，我做了点好吃的。",
  "不要挑食，每一粒粮食都来之不易哦。",
  "天有不测风云，所以才要提前备好粮草。",
  "春天播种，秋天收获，万物皆有其时。",
  "慢点走，别急。地里的庄稼，也要一点点长呢。"
];

// ==========================================
// 🌟 干员休息处主组件 (全新 PRTS 通讯气泡版)
// ==========================================
export default function OperatorRecreation() {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- 鼠标视差系统 ---
  const mouseX = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const bgTranslateX = useTransform(smoothMouseX, [0, 0.1666, 0.8333, 1], ["8.333%", "0%", "0%", "-8.333%"]);

  // --- 语音气泡系统 ---
  const [currentQuote, setCurrentQuote] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const triggerRandomTalk = () => {
      const randomQuote = SHU_QUOTES[Math.floor(Math.random() * SHU_QUOTES.length)];
      setCurrentQuote(randomQuote);
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 4500); // 停留时间
    };

    const initialTimeout = setTimeout(triggerRandomTalk, 3000);
    const talkInterval = setInterval(() => {
      setTimeout(triggerRandomTalk, Math.random() * 3000);
    }, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(talkInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mouseX.set(x);
  };

  const handleMouseLeave = () => mouseX.set(0.5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full flex flex-col items-center z-10"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border-4 border-slate-200/50 dark:border-slate-700/50 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* 背景层 */}
        <motion.div
          style={{ x: bgTranslateX }}
          className="absolute top-0 left-[-10%] w-[120%] h-[80%] z-0 pointer-events-none"
        >
          <img src="/recreation-bg.png" alt="Background" className="w-full h-full object-cover object-top" />
        </motion.div>

        {/* 氛围遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-[5] pointer-events-none" />

        {/* 前景层 */}
        <div className="absolute inset-0 z-[10] flex items-end justify-center pointer-events-none">
          <img src="/recreation-fg.png" alt="Foreground" className="w-auto h-full object-contain object-bottom" />
        </div>

        {/* === 🌟 核心分层架构：移动控制层 === */}
        <motion.div
          className="absolute z-[30] w-64 h-64 pointer-events-none flex flex-col items-center justify-center"
          animate={{
            left: ["10%", "75%", "75%", "10%", "10%"]
          }}
          transition={{
            duration: 40,
            times: [0, 0.48, 0.5, 0.98, 1],
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ bottom: "12%" }}
        >
          {/* 🌟 全新硬核科技风语音气泡 */}
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                // 🌟 位置下移：改为了 bottom-[75%]
                className="absolute bottom-[50%] mb-2 left-1/2 -translate-x-1/2 min-w-[200px] max-w-[260px] z-50 pointer-events-none"
              >
                <div className="relative bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 p-3 shadow-[0_0_20px_rgba(0,0,0,0.6)] overflow-hidden">

                  {/* 顶部渐变科技装饰条 */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e0af68] to-transparent opacity-80" />

                  {/* 左侧身份高亮标识线 */}
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-[#e0af68]" />

                  {/* 右下角战术角标 */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[2px] border-r-[2px] border-zinc-500/50" />

                  {/* 干员通讯铭牌 */}
                  <div className="flex items-center gap-2 mb-1.5 opacity-90">
                    <span className="text-[10px] font-mono font-bold text-[#e0af68] bg-[#e0af68]/15 px-1.5 py-0.5 border border-[#e0af68]/30">
                      SHU
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 tracking-widest">
                      COMMUNICATION
                    </span>
                  </div>

                  {/* 语音正文 */}
                  <p className="text-[13px] text-zinc-100 font-medium tracking-wider leading-relaxed drop-shadow-md">
                    {currentQuote}
                  </p>

                  {/* 对话框下方的科技感指示小尖角 */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-zinc-900/90" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* === 🌟 翻转控制层 === */}
          <motion.div
            className="w-full h-full relative"
            animate={{
              scaleX: [1, 1, -1, -1, 1]
            }}
            transition={{
              duration: 40,
              times: [0, 0.48, 0.5, 0.98, 1],
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* 主体 GIF */}
            <img
              src="/spine/shu/Shu.gif"
              alt="Shu Walking"
              style={{ filter: "drop-shadow(0 0 1px black) drop-shadow(0 0 1px black) drop-shadow(0 0 1px black)" }}
              className="relative z-10 w-full h-full object-contain pointer-events-none"
            />
          </motion.div>

          {/* 贴地阴影 */}
          <div className="absolute bottom-[-3%] left-1/2 -translate-x-1/2 w-18 h-2 bg-black/50 blur-[3px] rounded-[100%] z-0" />
        </motion.div>

        {/* 屏幕扫描线特效 */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] z-[40]" />
      </div>

      <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-b-full shadow-lg opacity-50 blur-[1px]" />
    </motion.div>
  );
}