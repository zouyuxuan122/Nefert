"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Loader2, FileText, MessageCircle, Lightbulb, ChevronLeft, ChevronRight, Layers, ChevronDown, ShieldAlert, AlertTriangle, Crosshair, Activity, Cpu, Camera, Users, Grid, X, LockKeyhole, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';

import LabComments from '../../components/LabComments';
import { siteConfig } from '../../siteConfig';

import { albums } from '../../data/albums';
import { friendsData } from '../../data/friends';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ==========================================
// 🌟 0. 终末地/罗德岛 干员信物徽章组件 (OperatorToken)
// ==========================================
const OperatorToken = ({ badge, locked = false }: any) => {
  const tierStyles: Record<number, string> = {
    1: 'bg-[#f4f4f5] border-[#a1a1aa] text-[#52525b] shadow-[0_0_8px_#f4f4f544]',
    2: 'bg-[#dcfce7] border-[#4ade80] text-[#166534] shadow-[0_0_10px_#4ade8066]',
    3: 'bg-[#e0f2fe] border-[#38bdf8] text-[#075985] shadow-[0_0_12px_#38bdf888]',
    4: 'bg-[#f3e8ff] border-[#c084fc] text-[#5b21b6] shadow-[0_0_15px_#c084fcaa]',
    5: 'bg-[#fef3c7] border-[#fbbf24] text-[#92400e] shadow-[0_0_20px_#fbbf24aa]',
    6: 'bg-[#ffedd5] border-[#f97316] text-[#9a3412] shadow-[0_0_25px_#f97316bb] animate-[hex-shine_3s_infinite_linear]',
    7: 'bg-[#fee2e2] border-[#ef4444] text-[#7f1d1d] shadow-[0_0_30px_#ef4444cc] animate-[hex-shine_2s_infinite_linear]',
    8: 'bg-[#ccfbf1] border-[#06b6d4] text-[#083344] shadow-[0_0_35px_#06b6d4dd] animate-[hex-shine_1.5s_infinite_linear]',
    9: 'bg-[#18181b] border-[#fbbf24] text-[#fbbf24] shadow-[0_0_40px_#fbbf24ee] animate-[hex-shine_1s_infinite_linear]',
    10: 'bg-[linear-gradient(45deg,#f59e0b,#ef4444,#06b6d4,#f59e0b)] bg-[length:300%] animate-[rainbow_2s_linear_infinite] border-[#ffffff] text-[#ffffff] shadow-[0_0_30px_#f59e0b]',
  };

  const bgStyle = tierStyles[badge.colorTier] || tierStyles[1];
  const Icon = badge.icon;

  return (
    <div className="relative group cursor-pointer flex justify-center z-10 hover:z-50">
      <div
        className={`w-[56px] h-[56px] flex items-center justify-center ${bgStyle} border-[2px] transition-all duration-300 ${locked ? 'bg-slate-800 border-slate-700 text-slate-600 grayscale opacity-60' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}
        style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%)' }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.05)_2px,rgba(0,0,0,0.05)_4px)] pointer-events-none" />
        <Icon size={22} className={`drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${locked ? 'opacity-30' : 'opacity-100'}`} />
        {locked && <LockKeyhole size={18} className="absolute text-slate-400 opacity-80" />}
      </div>

      <div className="absolute top-[115%] left-1/2 -translate-x-1/2 px-4 py-2.5 bg-[#1e1e1e]/95 backdrop-blur-md border border-[#444] rounded-sm text-[11px] font-mono font-bold text-slate-200 tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center min-w-[150px]">
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e1e1e] border-t border-l border-[#444] rotate-45" />
        <span className="text-amber-500/90 text-[9px] mb-1 uppercase border-b border-[#333] w-full text-center tracking-[0.2em] pb-1">SUBJECT: {badge.typeLabel}</span>
        <span className="text-sm font-black mt-1 mb-1 tracking-wider text-white">{badge.title} {locked ? '(LOCKED)' : ''}</span>
        <span className="text-slate-400 text-[9px] mt-1 bg-black/50 px-2 py-0.5 rounded-sm border border-[#333] uppercase">COND: {badge.condition}</span>
      </div>
    </div>
  );
};

// ==========================================
// 🌟 1. 日期格式清洗器
// ==========================================
const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('T')) return dateStr.replace('T', ' ').substring(0, 19);
  return dateStr;
};

// ==========================================
// 🌟 2. 特效组件
// ==========================================
const BlinkingPoints = ({ geometry, color, size, opacity }: any) => {
  const materialRef = useRef<any>();
  useMemo(() => {
    if (!geometry.hasAttribute('aPhase')) {
      const count = geometry.attributes.position.count;
      const phases = new Float32Array(count);
      for(let i=0; i<count; i++) phases[i] = Math.random() * Math.PI * 2;
      geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    }
  }, [geometry]);
  useFrame((state) => {
    if (materialRef.current?.userData?.shader) {
      materialRef.current.userData.shader.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <points geometry={geometry}>
      <pointsMaterial
        ref={materialRef} color={color} size={size} sizeAttenuation transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = { value: 0 };
          materialRef.current.userData.shader = shader;
          shader.vertexShader = `attribute float aPhase;\nvarying float vPhase;\n` + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace(`#include <begin_vertex>`, `#include <begin_vertex>\nvPhase = aPhase;`);
          shader.fragmentShader = `uniform float uTime;\nvarying float vPhase;\n` + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `float blink = (sin(uTime * 4.0 + vPhase) + 1.0) * 0.5; vec4 diffuseColor = vec4( diffuse, opacity * (blink * 0.7 + 0.3) );`
          );
        }}
      />
    </points>
  );
};

// ==========================================
// 🌟 3. 统一向左弹出的层叠数据卡片
// ==========================================
const StackedTacticalHUD = ({ records, color, categoryName, isImageStyle, router }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const stackRotations = useMemo(() => [-6, 4, -2], []);

  if (!records || records.length === 0) return null;

  const handleItemClick = (r: any) => {
    if (r.type === 'post') router.push(`/posts/${r.slug || r.id}`);
    else if (r.type === 'chatter') router.push(`/chatter/${r.slug || r.id}`);
    else if (r.type === 'moment') router.push(`/moments`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 10, scale: 0.9 }}
      className="absolute right-12 top-1/2 -translate-y-1/2 w-[320px] pointer-events-auto z-[999]"
    >
      <div className="relative p-1.5 bg-[#0a0a0a]/70 backdrop-blur-xl border border-[#333] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden" style={{ borderRight: `4px solid ${color}` }}>
        <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-[#333] bg-black/40 rounded-t-xl" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <Layers size={16} style={{ color }} />
            <span className="text-xs font-black tracking-widest text-slate-200 uppercase">{categoryName} ARCHIVE</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            {records.length} FILES
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
          </div>
        </div>

        <div className="relative px-3 pb-3 mt-2">
          {isExpanded ? (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className={`flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pb-1 ${isImageStyle ? 'max-h-[480px]' : 'max-h-[350px]'}`}>
              {records.map((r: any) => (
                isImageStyle ? (
                  <div key={r.id} onClick={() => handleItemClick(r)} className="relative w-full aspect-video shrink-0 overflow-hidden shadow-md group cursor-pointer border border-[#333] bg-[#222] rounded-xl">
                    <img src={r.image} alt={r.title} className="absolute inset-0 w-full h-full object-cover blur-[2px] group-hover:blur-0 transition-all duration-500 scale-110 opacity-70 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-colors duration-500" />
                    <div className="absolute right-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: color }} />
                    <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                      <span className="text-[10px] text-amber-500 font-mono drop-shadow-md mb-1">{formatDisplayDate(r.date)}</span>
                      <h4 className="text-sm font-bold text-white drop-shadow-lg line-clamp-2 leading-snug">{r.title}</h4>
                    </div>
                  </div>
                ) : (
                  <div key={r.id} onClick={() => handleItemClick(r)} className="relative w-full shrink-0 p-4 bg-[#222] border-l-2 hover:bg-[#2a2a2a] cursor-pointer shadow-md transition-colors text-left flex flex-col gap-2 rounded-xl" style={{ borderColor: color }}>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {r.type === 'message' && r.author ? `ID: ${r.author} // ` : ''}
                      {formatDisplayDate(r.date)}
                    </div>
                    <div className="text-xs font-bold text-slate-200 leading-relaxed whitespace-pre-wrap line-clamp-3">
                      {(r.type === 'moment' || r.type === 'message') ? (r.content || r.title) : r.title}
                    </div>
                  </div>
                )
              ))}
            </motion.div>
          ) : (
            <div className={`relative mt-2 ${isImageStyle ? 'h-[190px]' : 'h-32'}`}>
              {records.slice(0, 3).map((r: any, i: number) => (
                <motion.div
                  key={r.id}
                  className={`absolute inset-x-0 shadow-xl cursor-pointer bg-[#222] border-l-2 overflow-hidden rounded-xl ${isImageStyle ? 'aspect-video border-y border-r border-[#333]' : 'p-4 flex flex-col h-24 border-y border-r border-[#333]'}`}
                  style={{ top: i * 10, zIndex: 30 - i, rotate: stackRotations[i] || 0, borderLeftColor: color }}
                  onClick={() => setIsExpanded(true)}
                  whileHover={{ y: -5, rotate: 0 }}
                >
                  {isImageStyle ? (
                    <>
                      <img src={r.image} className="absolute inset-0 w-full h-full object-cover blur-[2px] opacity-50" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="relative z-10 p-4 h-full flex flex-col justify-end text-left">
                         <div className="text-[10px] text-amber-500 font-mono drop-shadow-md mb-1">{formatDisplayDate(r.date)}</div>
                         <div className="text-sm font-bold text-white line-clamp-2 drop-shadow-lg leading-snug">{r.title}</div>
                      </div>
                    </>
                  ) : (
                    <>
                       <div className="text-[10px] text-slate-400 font-mono text-right mb-1">
                          {r.type === 'message' && r.author ? `ID: ${r.author} // ` : ''}
                          {formatDisplayDate(r.date)}
                       </div>
                       <div className="text-xs font-bold text-slate-200 line-clamp-2 text-right leading-relaxed">
                         {(r.type === 'moment' || r.type === 'message') ? (r.content || r.title) : r.title}
                       </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 🌟 4. 巨型雷达荧光信标
// ==========================================
const TacticalPoint = ({ position, color, isActive, records, categoryName, isImageStyle, router }: any) => {
  return (
    <group position={position}>
      <Html center zIndexRange={isActive ? [9999, 9000] : [100, 0]}>
        <div className="relative flex items-center justify-center pointer-events-none">
          <div className="absolute w-8 h-8 border border-white/20 rotate-45" />
          <div className="w-3 h-3 shadow-[0_0_15px_currentColor] transition-all duration-500 rotate-45"
               style={{ backgroundColor: color, color: color, opacity: isActive ? 1 : 0.6, transform: isActive ? 'scale(1.5) rotate(45deg)' : 'scale(1) rotate(45deg)' }} />
          {isActive && (
            <>
               <div className="absolute w-12 h-12 border border-dashed rotate-45 animate-[spin_4s_linear_infinite] opacity-50" style={{ borderColor: color }} />
            </>
          )}
          <AnimatePresence>
            {isActive && <StackedTacticalHUD records={records} color={color} categoryName={categoryName} isImageStyle={isImageStyle} router={router} />}
          </AnimatePresence>
        </div>
      </Html>
    </group>
  );
};

// ==========================================
// 🌟 5. 解析二进制点云并注入发光粒子特效
// ==========================================
const DijiangParticleModel = () => {
  const [pointGeometry, setPointGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 如果你改了 bin 文件的名字，请在这里修改请求路径，例如： fetch('/12345.bin')
    fetch('/spaceship.bin')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch spaceship.bin");
        return res.arrayBuffer();
      })
      .then(buffer => {
        if (!isMounted) return;

        const raw = new Float32Array(buffer);
        const count = raw.length / 3;

        let mx = 0, my = 0, mz = 0;
        for(let i = 0; i < raw.length; i += 3) {
          mx += raw[i];
          my += raw[i+1];
          mz += raw[i+2];
        }
        mx /= count; my /= count; mz /= count;

        let maxD = 0;
        for(let i = 0; i < raw.length; i += 3) {
          raw[i] -= mx;
          raw[i+1] -= my;
          raw[i+2] -= mz;
          const d = Math.sqrt(raw[i]**2 + raw[i+1]**2 + raw[i+2]**2);
          if(d > maxD) maxD = d;
        }

        const sc = 5 / maxD;
        for(let i = 0; i < raw.length; i++) {
          raw[i] *= sc;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(raw, 3));
        setPointGeometry(geo);
      })
      .catch(err => {
        console.error("Error loading point cloud model:", err);
      });

    return () => { isMounted = false; };
  }, []);

  if (!pointGeometry) return null;

  return (
    <group>
      {/* 🌟 颜色已经改回了黄色：#eab308 */}
      <BlinkingPoints geometry={pointGeometry} color="#eab308" size={0.035} opacity={0.7} />
    </group>
  );
};

const HologramShip = ({ activeCategory, currentRecords, router }: any) => {
  return (
    <Float speed={2} rotationIntensity={0.05} floatIntensity={0.5}>
      {/* 👇 调整这里的 scale 和 position 来控制整体大小和位置 👇 */}
      <group scale={1} position={[1.2, 0.8, 1]}>

        {/* 👇 调整这里的 rotation 控制模型的旋转角度 (X, Y, Z轴，弧度制) 👇 */}
        <group rotation={[Math.PI / 0.9, -0.2, 3.0]}>

          <DijiangParticleModel />

          <TacticalPoint position={[-1.0, -0.5, 1.5]} color="#0ea5e9" categoryName="PRTS_DB"
                         isActive={activeCategory === 'post'} records={currentRecords.filter((r:any) => r.type === 'post')} isImageStyle={true} router={router} />
          <TacticalPoint position={[-1.5, -2, 1.5]} color="#eab308" categoryName="LOGS"
                         isActive={activeCategory === 'chatter'} records={currentRecords.filter((r:any) => r.type === 'chatter')} isImageStyle={true} router={router} />
          <TacticalPoint position={[-2.3, 0, 1.5]} color="#10b981" categoryName="BEACON"
                         isActive={activeCategory === 'moment'} records={currentRecords.filter((r:any) => r.type === 'moment')} isImageStyle={false} router={router} />
          <TacticalPoint position={[-2.3, -0.5, 1.5]} color="#f1f5f9" categoryName="RECEPTION"
                         isActive={activeCategory === 'message'} records={currentRecords.filter((r:any) => r.type === 'message')} isImageStyle={false} router={router} />
        </group>
      </group>
    </Float>
  );
};

// ==========================================
// 🌟 6. 核心页面渲染
// ==========================================
export default function DijiangModel({ posts = [], chatters = [], moments = [] }: any) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sysTip, setSysTip] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const [realWishes, setRealWishes] = useState<any[]>([]);

  // RPG 数据结算
  const rpgStats = useMemo(() => {
    if (siteConfig?.enableLevelSystem !== true) return null;

    const totalPhotos = (albums || []).reduce((acc: number, curr: any) => acc + (curr.photos?.length || 0), 0);
    const totalFriends = (friendsData || []).length;

    const parseDateStr = (dateVal: any) => {
      try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return null;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      } catch (e) { return null; }
    };

    const todayString = parseDateStr(new Date());
    let tp = 0, tc = 0, tm = 0;
    const uniqueDays = new Set();

    const processItem = (item: any, type: string) => {
      if (item.date) {
        const ds = parseDateStr(item.date);
        if (ds) {
          uniqueDays.add(ds);
          if (ds === todayString) {
            if (type === 'p') tp++;
            if (type === 'c') tc++;
            if (type === 'm') tm++;
          }
        }
      }
    };

    posts.forEach((i: any) => processItem(i, 'p'));
    chatters.forEach((i: any) => processItem(i, 'c'));
    moments.forEach((i: any) => processItem(i, 'm'));

    const postsExp = posts.length * 50;
    const chattersExp = chatters.length * 20;
    const momentsExp = moments.length * 10;
    const contentExp = postsExp + chattersExp + momentsExp;
    const checkInDays = uniqueDays.size;
    const checkInExp = checkInDays * 100;
    const totalExp = contentExp + checkInExp;

    const isCheckedInToday = todayString ? uniqueDays.has(todayString) : false;
    const todayExp = (tp * 50) + (tc * 20) + (tm * 10) + (isCheckedInToday ? 100 : 0);

    const getExpNeededForLevel = (lvl: number) => {
      if (lvl <= 1) return 150;
      return 150 + Math.floor((2000 * (lvl - 1)) / ((lvl - 1) + 10));
    };

    let level = 1;
    let remainingExp = totalExp;
    let expNeededForNextLevel = getExpNeededForLevel(level);

    while (remainingExp >= expNeededForNextLevel) {
      remainingExp -= expNeededForNextLevel;
      level++;
      expNeededForNextLevel = getExpNeededForLevel(level);
    }
    const progressPercent = ((remainingExp / expNeededForNextLevel) * 100).toFixed(1);

    const allCatalogBadges: any[] = [];
    const ownedIds = new Set();

    const levelConfig = [
      { num: 1, tier: 1, title: '预备干员' }, { num: 2, tier: 2, title: '正式干员' },
      { num: 3, tier: 3, title: '精英干员' }, { num: 5, tier: 4, title: '资深干员' },
      { num: 10, tier: 5, title: '高级资深' }, { num: 15, tier: 6, title: '战术指挥' },
      { num: 20, tier: 7, title: '协议主管' }, { num: 30, tier: 8, title: '终末枢纽' },
      { num: 40, tier: 9, title: '塔卫二领航' }, { num: 50, tier: 10, title: '罗德岛之眼' }
    ];
    levelConfig.forEach(conf => {
      const id = `lvl-${conf.num}`;
      allCatalogBadges.push({ id, title: conf.title, typeLabel: `PRTS授权 Lv.${conf.num}`, condition: `权限等级达到 Lv.${conf.num}`, icon: Shield, colorTier: conf.tier, group: 'level' });
      if (level >= conf.num) ownedIds.add(id);
    });

    const postChatterConfig = [
      { num: 10, tier: 2, title: '浅层勘测' }, { num: 50, tier: 3, title: '战术总结' },
      { num: 100, tier: 4, title: '机密档案' }, { num: 150, tier: 5, title: '源石解析' },
      { num: 200, tier: 6, title: '协议核心' }, { num: 250, tier: 7, title: '灾兽洞察' },
      { num: 300, tier: 8, title: '遗迹启示' }, { num: 400, tier: 9, title: '终末真理' },
      { num: 450, tier: 9, title: '塔卫二全书' }, { num: 500, tier: 10, title: '普瑞赛斯之忆' }
    ];
    postChatterConfig.forEach(conf => {
      const idPost = `post-${conf.num}`;
      allCatalogBadges.push({ id: idPost, title: conf.title, typeLabel: '情报卷宗', condition: `累计解密 ${conf.num} 份卷宗`, icon: Cpu, colorTier: conf.tier, group: 'post' });
      if (posts.length >= conf.num) ownedIds.add(idPost);

      const idChatter = `chatter-${conf.num}`;
      allCatalogBadges.push({ id: idChatter, title: conf.title, typeLabel: '终端通讯', condition: `累计截获 ${conf.num} 条频段`, icon: Activity, colorTier: conf.tier, group: 'chatter' });
      if (chatters.length >= conf.num) ownedIds.add(idChatter);
    });

    const momentConfig = [
      { num: 10, tier: 2, title: '初设信标' }, { num: 50, tier: 3, title: '节点点亮' },
      { num: 100, tier: 4, title: '百区网格' }, { num: 200, tier: 5, title: '探地雷达' },
      { num: 300, tier: 6, title: '广域侦察' }, { num: 400, tier: 7, title: '全息地貌' },
      { num: 500, tier: 8, title: '天灾预警' }, { num: 600, tier: 9, title: '裂境监视' },
      { num: 700, tier: 9, title: '苍穹之眼' }, { num: 800, tier: 10, title: '绝对坐标' }
    ];
    momentConfig.forEach(conf => {
      const id = `moment-${conf.num}`;
      allCatalogBadges.push({ id, title: conf.title, typeLabel: '观测信标', condition: `累计部署 ${conf.num} 处信标`, icon: Crosshair, colorTier: conf.tier, group: 'moment' });
      if (moments.length >= conf.num) ownedIds.add(id);
    });

    const photoConfig = [
      { num: 10, tier: 3, title: '镜头校准' },
      { num: 50, tier: 6, title: '战地纪实' },
      { num: 100, tier: 10, title: '泰拉全景' }
    ];
    photoConfig.forEach(conf => {
      const id = `photo-${conf.num}`;
      allCatalogBadges.push({ id, title: conf.title, typeLabel: '视觉勘测', condition: `完成 ${conf.num} 处地形勘测`, icon: Camera, colorTier: conf.tier, group: 'photo' });
      if (totalPhotos >= conf.num) ownedIds.add(id);
    });

    const friendConfig = [
      { num: 10, tier: 3, title: '临时干员' },
      { num: 20, tier: 6, title: '战术分队' },
      { num: 50, tier: 10, title: '跨界同盟' }
    ];
    friendConfig.forEach(conf => {
      const id = `friend-${conf.num}`;
      allCatalogBadges.push({ id, title: conf.title, typeLabel: '协同协议', condition: `缔结 ${conf.num} 份干员协议`, icon: Users, colorTier: conf.tier, group: 'friend' });
      if (totalFriends >= conf.num) ownedIds.add(id);
    });

    const ownedBadges = allCatalogBadges.filter(b => ownedIds.has(b.id));

    return {
      level, remainingExp, expNeededForNextLevel, progressPercent, totalExp,
      isCheckedInToday, todayExp, postsExp, chattersExp, momentsExp, checkInDays, checkInExp,
      todayPosts: tp, todayChatters: tc, todayMoments: tm,
      ownedBadges, allCatalogBadges, ownedIds
    };
  }, [posts, chatters, moments]);

  const availableMonths = useMemo(() => {
    const allItems = [...posts, ...chatters, ...moments];
    const monthsSet = new Set(allItems.map(item => item.date?.substring(0, 7)).filter(Boolean));
    const sorted = Array.from(monthsSet).sort();
    return sorted.length > 0 ? sorted : [new Date().toISOString().substring(0, 7)];
  }, [posts, chatters, moments]);

  const [monthIndex, setMonthIndex] = useState(availableMonths.length - 1);
  const currentMonthStr = mounted ? (availableMonths[monthIndex] || new Date().toISOString().substring(0, 7)) : '2026-05';

  const [year, month] = currentMonthStr.split('-');
  const formattedMonth = `RECORD.Y${year.substring(2)}M${parseInt(month)}`;

  const [activeCategory, setActiveCategory] = useState<'post' | 'chatter' | 'moment' | 'message' | null>(null);

  useEffect(() => {
    if (!mounted) return;
    let isMounted = true;
    const fetchGitalkComments = async () => {
      try {
        const { owner, repo } = siteConfig.gitalkConfig;
        const targetLabel = `workshop-${currentMonthStr}`;
        const issueRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=${targetLabel}`);
        const issues = await issueRes.json();

        if (issues && issues.length > 0) {
          const commentsRes = await fetch(issues[0].comments_url);
          const comments = await commentsRes.json();
          if (isMounted && Array.isArray(comments)) {
            const fetchedWishes = comments.map((c: any) => ({
              id: c.id.toString(), content: c.body, title: c.body, author: c.user.login, type: 'message', date: c.created_at,
            }));
            setRealWishes(fetchedWishes);
            return;
          }
        }
        if (isMounted) setRealWishes([]);
      } catch (err) {
        if (isMounted) setRealWishes([]);
      }
    };
    fetchGitalkComments();
    return () => { isMounted = false; };
  }, [currentMonthStr, mounted]);

  const currentMonthRecords = useMemo(() => {
    const formatted = [...posts, ...chatters, ...moments].map(r => ({
      id: r.id || r.slug, slug: r.slug, type: r.type, title: r.title, date: r.date,
      image: r.cover || r.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
      content: r.content
    })).filter(r => r.date.startsWith(currentMonthStr));
    return [...formatted, ...realWishes];
  }, [currentMonthStr, posts, chatters, moments, realWishes]);

  const countPost = currentMonthRecords.filter(r => r.type === 'post').length;
  const countChatter = currentMonthRecords.filter(r => r.type === 'chatter').length;
  const countMoment = currentMonthRecords.filter(r => r.type === 'moment').length;
  const countMessage = currentMonthRecords.filter(r => r.type === 'message').length;

  const handleCategoryClick = (cat: 'post' | 'chatter' | 'moment' | 'message', count: number) => {
    if (count === 0) {
      setSysTip(`[ SYSTEM ALERT ] 该区域暂无数据归档`);
      setActiveCategory(null);
      setTimeout(() => setSysTip(null), 3000);
      return;
    }
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  if (!mounted) return <div className="min-h-[80vh] flex items-center justify-center text-slate-500 font-mono tracking-widest bg-transparent">CONNECTING TO PRTS...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center relative bg-transparent"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rainbow { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        @keyframes hex-shine { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.5); border-radius: 0px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234, 179, 8, 0.8); }
      `}} />

      {/* ========================================== */}
      {/* 🌟 罗德岛人事中心：干员档案板 (Operator Profile) */}
      {/* ========================================== */}
      {rpgStats && (
        <div className="w-full max-w-6xl mb-8 px-4 z-30 flex flex-col gap-4 relative mt-2">

          <div className="bg-[#1e1e1e] px-6 py-5 border-l-[4px] border-[#eab308] border-y border-r border-[#333] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-visible group z-30">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none" />

            <div className="flex items-center gap-4 z-10 w-full md:w-auto">
              <div className="relative flex items-center justify-center w-16 h-16 bg-[#111] border-[1.5px] border-[#eab308] transform rotate-45">
                <div className="-rotate-45 flex flex-col items-center mt-1">
                  <span className="text-[#eab308] text-[9px] font-black tracking-widest leading-none">LVL</span>
                  <span className="text-white text-xl font-black font-mono tracking-tighter leading-none">{rpgStats.level}</span>
                </div>
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-white font-black text-xl tracking-widest flex items-center gap-2 drop-shadow-md">
                  OPERATOR PROFILE
                </span>
                <span className="text-slate-400 text-[10px] font-mono tracking-[0.3em] mt-0.5 uppercase bg-black/50 w-max px-2 py-0.5 border border-[#333]">PRTS LINK ESTABLISHED</span>
              </div>
            </div>

            <div className="flex-1 w-full md:max-w-lg flex flex-col z-10">
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-[#eab308] text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-1.5"><Activity size={12}/> CLEARANCE EXP</span>
                <span className="text-white text-xs font-mono font-bold tracking-wider drop-shadow-md">
                  {rpgStats.remainingExp} <span className="text-slate-500 font-normal">/ {rpgStats.expNeededForNextLevel}</span>
                </span>
              </div>
              <div className="w-full h-3 bg-[#111] overflow-hidden border border-[#333] relative" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${rpgStats.progressPercent}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-[#eab308] relative z-0"
                >
                  <div className="absolute inset-0 bg-white/20 animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,0,0,0.5)_20px,rgba(0,0,0,0.5)_22px)]" />
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-6 z-20 md:border-l border-[#333] md:pl-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0 relative group/tooltip cursor-crosshair">
              <div className="flex flex-col items-center flex-1 md:flex-none">
                <span className="text-slate-400 text-[9px] font-bold tracking-[0.2em] mb-1">TODAY'S UPLINK</span>
                <span className="text-[#eab308] font-mono text-sm font-black">+{rpgStats.todayExp} EXP</span>
              </div>
              <div className="flex flex-col items-center flex-1 md:flex-none">
                <span className="text-slate-400 text-[9px] font-bold tracking-[0.2em] mb-1.5">PRTS SYNC</span>
                {rpgStats.isCheckedInToday ? (
                  <span className="text-[#10b981] text-[10px] font-black tracking-widest border border-[#10b981] px-2 py-0.5 bg-[#10b981]/10">ONLINE</span>
                ) : (
                  <span className="text-red-500 text-[10px] font-black tracking-widest border border-red-500 px-2 py-0.5 bg-red-500/10">OFFLINE</span>
                )}
              </div>

              <div className="absolute top-full right-1/2 translate-x-1/2 md:-translate-x-0 md:right-0 mt-3 w-52 bg-[#1e1e1e]/95 backdrop-blur-md border border-[#444] shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50 p-3 pointer-events-none">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-10 w-3 h-3 bg-[#1e1e1e] border-t border-l border-[#444] rotate-45" />
                <h4 className="text-[#eab308] text-[10px] font-black text-center mb-2 tracking-[0.2em] border-b border-[#444] pb-1 uppercase">Transmission Log</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  {rpgStats.todayPosts > 0 && <div className="flex justify-between text-slate-200"><span>情报卷宗 <span className="text-[10px] text-slate-500">x{rpgStats.todayPosts}</span></span><span className="text-[#eab308]">+{rpgStats.todayPosts * 50}</span></div>}
                  {rpgStats.todayChatters > 0 && <div className="flex justify-between text-slate-200"><span>终端通讯 <span className="text-[10px] text-slate-500">x{rpgStats.todayChatters}</span></span><span className="text-[#eab308]">+{rpgStats.todayChatters * 20}</span></div>}
                  {rpgStats.todayMoments > 0 && <div className="flex justify-between text-slate-200"><span>观测信标 <span className="text-[10px] text-slate-500">x{rpgStats.todayMoments}</span></span><span className="text-[#eab308]">+{rpgStats.todayMoments * 10}</span></div>}
                  {rpgStats.isCheckedInToday && <div className="flex justify-between text-slate-200"><span>系统初次同步</span><span className="text-[#eab308]">+100</span></div>}
                  {rpgStats.todayExp === 0 && <div className="text-center text-slate-600 italic text-[10px] py-1">NO DATA UPLOADED TODAY</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e1e1e]/60 backdrop-blur-md px-6 py-5 border border-[#333] relative z-10">
            <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
              <h3 className="text-slate-300 font-black tracking-[0.2em] text-sm uppercase flex items-center gap-2">
                <Cpu size={18} className="text-[#eab308]" /> CERTIFICATE GALLERY
              </h3>
              <button
                onClick={() => setShowCatalog(true)}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-200 bg-[#333]/50 hover:bg-[#eab308]/20 hover:text-[#eab308] hover:border-[#eab308] px-3 py-1.5 border border-[#444] transition-colors uppercase tracking-widest"
              >
                <Grid size={12} /> ALL RECORDS
              </button>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-6 justify-start py-2 min-h-[70px]">
              {rpgStats.ownedBadges.length > 0 ? (
                rpgStats.ownedBadges.map((badge, idx) => <OperatorToken key={idx} badge={badge} />)
              ) : (
                <p className="text-slate-600 text-[10px] font-mono tracking-widest w-full text-center py-4 uppercase border border-dashed border-[#333] bg-[#111]">Database empty. Awaiting deployment.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 🌟 全图鉴 Modal 面板 (破除层级遮挡，移至根节点最上方) */}
      {/* ========================================== */}
      <AnimatePresence>
        {showCatalog && rpgStats && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCatalog(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#171717] border border-[#444] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#eab308]/50 bg-[#111] relative">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] pointer-events-none" />
                <h2 className="text-[#eab308] font-black tracking-widest flex items-center gap-2 text-lg uppercase"><Grid size={20} /> PRTS Master Database</h2>
                <button onClick={() => setShowCatalog(false)} className="text-slate-500 hover:text-white transition-colors z-10"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-32">

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-px bg-[#eab308]" />
                  <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2"><Shield size={14} className="text-[#eab308]"/> 权限认证 (AUTH LEVEL)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#eab308]/50 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
                  {rpgStats.allCatalogBadges.filter(b => b.group === 'level').map(b => (
                    <OperatorToken key={b.id} badge={b} locked={!rpgStats.ownedIds.has(b.id)} />
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-16 mb-8">
                  <div className="w-12 h-px bg-[#0ea5e9]" />
                  <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2"><Cpu size={14} className="text-[#0ea5e9]"/> 情报卷宗 (INTEL FILES)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#0ea5e9]/50 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
                  {rpgStats.allCatalogBadges.filter(b => b.group === 'post').map(b => (
                    <OperatorToken key={b.id} badge={b} locked={!rpgStats.ownedIds.has(b.id)} />
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-16 mb-8">
                  <div className="w-12 h-px bg-[#f59e0b]" />
                  <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2"><Activity size={14} className="text-[#f59e0b]"/> 终端通讯 (TERMINAL LOGS)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#f59e0b]/50 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
                  {rpgStats.allCatalogBadges.filter(b => b.group === 'chatter').map(b => (
                    <OperatorToken key={b.id} badge={b} locked={!rpgStats.ownedIds.has(b.id)} />
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-16 mb-8">
                  <div className="w-12 h-px bg-[#10b981]" />
                  <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2"><Crosshair size={14} className="text-[#10b981]"/> 观测信标 (OBSERVATION BEACONS)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#10b981]/50 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
                  {rpgStats.allCatalogBadges.filter(b => b.group === 'moment').map(b => (
                    <OperatorToken key={b.id} badge={b} locked={!rpgStats.ownedIds.has(b.id)} />
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-16 mb-8">
                  <div className="w-12 h-px bg-white/50" />
                  <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2"><Camera size={14} /> 视觉勘测 (VISUAL RECON)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/50 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
                  {rpgStats.allCatalogBadges.filter(b => b.group === 'photo').map(b => (
                    <OperatorToken key={b.id} badge={b} locked={!rpgStats.ownedIds.has(b.id)} />
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-16 mb-8">
                  <div className="w-12 h-px bg-indigo-400" />
                  <span className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-2"><Users size={14} className="text-indigo-400"/> 协同协议 (COMM PROTOCOLS)</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-indigo-400/50 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-10 justify-center">
                  {rpgStats.allCatalogBadges.filter(b => b.group === 'friend').map(b => (
                    <OperatorToken key={b.id} badge={b} locked={!rpgStats.ownedIds.has(b.id)} />
                  ))}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 中心舰船区域 (调整为 h-[75vh] 提升纵向空间) */}
      <div className="w-full h-[75vh] min-h-[750px] relative pointer-events-none mt-4 z-40">

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#eab308]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 blur-[120px] rounded-full" />

        <div className="absolute top-0 left-4 md:left-10 z-10 border-l-[3px] border-[#eab308] pl-4">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-widest uppercase mb-1 flex items-center gap-3">
             END-01
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs tracking-[0.2em] font-mono">
            CLASS: INTERSTELLAR CRUISER<br/>
            AFFILIATION: ENDFIELD INDUSTRIES
          </p>
        </div>

        <div className="absolute bottom-2 left-4 md:left-10 z-30 flex flex-col gap-2 pointer-events-auto">
          <div className="relative">
            <AnimatePresence>
              {sysTip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute bottom-full mb-3 left-0 bg-red-500/10 border border-red-500/40 text-red-500 text-[11px] px-4 py-2 rounded-sm backdrop-blur-md font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] whitespace-nowrap"
                >
                  <AlertTriangle size={14} className="animate-pulse" /> {sysTip}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase mb-1 mt-2">SYSTEM OVERRIDE</div>

          <button onClick={() => handleCategoryClick('post', countPost)} className={`flex items-center gap-4 w-60 p-2 border transition-all duration-300 backdrop-blur-md shadow-sm ${activeCategory === 'post' ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white' : 'bg-[#1e1e1e]/80 border-[#333] hover:bg-[#2a2a2a] text-slate-300'}`}>
            <div className={`p-2 ${activeCategory === 'post' ? 'bg-white/20' : 'bg-[#111] border border-[#333] text-[#0ea5e9]'}`}><FileText size={16} /></div>
            <div className="text-left flex-1"><div className="text-sm font-bold tracking-wider">PRTS_DB</div><div className={`text-[9px] font-mono ${activeCategory === 'post' ? 'text-white/80' : 'text-slate-500'}`}>情报卷宗</div></div>
          </button>

          <button onClick={() => handleCategoryClick('chatter', countChatter)} className={`flex items-center gap-4 w-60 p-2 border transition-all duration-300 backdrop-blur-md shadow-sm ${activeCategory === 'chatter' ? 'bg-[#eab308] border-[#eab308] text-[#111]' : 'bg-[#1e1e1e]/80 border-[#333] hover:bg-[#2a2a2a] text-slate-300'}`}>
            <div className={`p-2 ${activeCategory === 'chatter' ? 'bg-black/20' : 'bg-[#111] border border-[#333] text-[#eab308]'}`}><MessageCircle size={16} /></div>
            <div className="text-left flex-1"><div className="text-sm font-bold tracking-wider">LOGS</div><div className={`text-[9px] font-mono ${activeCategory === 'chatter' ? 'text-black/60' : 'text-slate-500'}`}>终端通讯</div></div>
          </button>

          <button onClick={() => handleCategoryClick('moment', countMoment)} className={`flex items-center gap-4 w-60 p-2 border transition-all duration-300 backdrop-blur-md shadow-sm ${activeCategory === 'moment' ? 'bg-[#10b981] border-[#10b981] text-[#111]' : 'bg-[#1e1e1e]/80 border-[#333] hover:bg-[#2a2a2a] text-slate-300'}`}>
            <div className={`p-2 ${activeCategory === 'moment' ? 'bg-black/20' : 'bg-[#111] border border-[#333] text-[#10b981]'}`}><Lightbulb size={16} /></div>
            <div className="text-left flex-1"><div className="text-sm font-bold tracking-wider">BEACON</div><div className={`text-[9px] font-mono ${activeCategory === 'moment' ? 'text-black/60' : 'text-slate-500'}`}>观测信标</div></div>
          </button>

          <button onClick={() => handleCategoryClick('message', countMessage)} className={`flex items-center gap-4 w-60 p-2 border transition-all duration-300 backdrop-blur-md shadow-sm ${activeCategory === 'message' ? 'bg-[#f1f5f9] border-[#f1f5f9] text-[#111]' : 'bg-[#1e1e1e]/80 border-[#333] hover:bg-[#2a2a2a] text-slate-300'}`}>
            <div className={`p-2 ${activeCategory === 'message' ? 'bg-black/20' : 'bg-[#111] border border-[#333] text-[#f1f5f9]'}`}><ShieldAlert size={16} /></div>
            <div className="text-left flex-1"><div className="text-sm font-bold tracking-wider">RECEPTION</div><div className={`text-[9px] font-mono ${activeCategory === 'message' ? 'text-black/60' : 'text-slate-500'}`}>访客申请</div></div>
          </button>
        </div>

        <div className="absolute bottom-6 right-4 md:right-10 z-30 pointer-events-auto flex flex-col items-end gap-3">
          <div className="w-56 p-4 bg-[#1e1e1e]/80 backdrop-blur-xl border border-[#333] shadow-lg pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}>
            <div className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase mb-2 border-b border-[#333] pb-1.5 text-right">
              DATA SUMMARY
            </div>
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="wait">
                <motion.div key={currentMonthStr} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-1.5 h-1.5 bg-[#0ea5e9]"></span> INTEL</span>
                    <span className="font-bold text-[#0ea5e9] text-sm">{countPost}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-1.5 h-1.5 bg-[#eab308]"></span> LOGS</span>
                    <span className="font-bold text-[#eab308] text-sm">{countChatter}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-1.5 h-1.5 bg-[#10b981]"></span> BEACON</span>
                    <span className="font-bold text-[#10b981] text-sm">{countMoment}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold"><span className="w-1.5 h-1.5 bg-[#f1f5f9]"></span> MSG</span>
                    <span className="font-bold text-[#f1f5f9] text-sm">{countMessage}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full bg-[#1e1e1e]/90 backdrop-blur-xl px-5 py-3 border border-[#333] shadow-lg text-slate-200">
            <button onClick={() => { if(monthIndex > 0) setMonthIndex(monthIndex - 1); setActiveCategory(null); }} disabled={monthIndex === 0} className="p-1 hover:bg-[#333] transition-colors disabled:opacity-20 disabled:cursor-not-allowed border border-transparent hover:border-[#444]">
              <ChevronLeft size={20} className="text-slate-400" />
            </button>
            <div className="flex flex-col items-center justify-center flex-1 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.div key={formattedMonth} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="flex flex-col items-center">
                  <span className="text-xs font-black tracking-widest text-slate-800 dark:text-white">{formattedMonth}</span>
                  <span className="text-[9px] font-mono text-[#eab308]">TIMELINE</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <button onClick={() => { if(monthIndex < availableMonths.length - 1) setMonthIndex(monthIndex + 1); setActiveCategory(null); }} disabled={monthIndex === availableMonths.length - 1} className="p-1 hover:bg-[#333] transition-colors disabled:opacity-20 disabled:cursor-not-allowed border border-transparent hover:border-[#444]">
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="absolute inset-0 z-[100] pointer-events-none">
          <Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
              <Loader2 size={40} className="text-[#eab308] animate-spin mb-4" />
              <p className="text-[#eab308] font-black tracking-[0.2em] uppercase text-xs animate-pulse">Establishing Link...</p>
            </div>
          }>
            <Canvas camera={{ position: [0, 1.5, 8], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: 'none' }}>
              <HologramShip activeCategory={activeCategory} currentRecords={currentMonthRecords} router={router} />
            </Canvas>
          </Suspense>
        </div>
      </div>

      {/* 🌟 底座：留言板 */}
      <div className="w-full max-w-4xl mx-auto mt-10 mb-16 px-4 relative z-0">
         <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2 font-serif text-center uppercase tracking-[0.2em] border-b border-slate-300 dark:border-[#333] pb-4 flex flex-col items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono">ENDFIELD RECEPTION CENTER</span>
            「 {formattedMonth} 的通讯接收枢纽 」
         </h2>
         <LabComments key={`gitalk-${currentMonthStr}`} pageId={`workshop-${currentMonthStr}`} />
      </div>

    </motion.div>
  );
}