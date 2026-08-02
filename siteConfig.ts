// siteConfig.ts - 你的全站“控制中心”

export const siteConfig = {
  // 1. 网站标题与博主信息
  title: "Nefert の 视界彼端",
  faviconUrl: "/avatar.png",
  authorName: "Nefert",
  bio: "游走于大语言模型与智能体工程之间的研究者。以 ZX-Code 为实验平台，探索技能自进化引擎、多智能体编排与上下文工程的边界。",

  navTitle: "Nefert",

  // 👇 【新增】导航栏中间的那个后缀/分隔符（默认是 の）
  navSuffix: "の",

  navAfter: "视界彼端",

  // 2. 头像设置 (支持网络链接，或将图片放入 public 文件夹后使用 "/me.jpg")
  avatarUrl: "/avatar.png",

  // 3. 网站背景设置 (二选一)
  // 如果想用纯图片背景，请在下面 bgImage 写路径，并将 useGradient 设为 false
  useGradient: false,
  themeColors: ["#6366f1", "#22d3ee", "#a78bfa", "#f472b6"], // 呼吸流动的颜色组合
// 修改这里：变成图片数组
  bgImages: ["https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg", "https://bu.dusays.com/2026/03/24/69c26fe4acdb5.jpg", "https://bu.dusays.com/2026/03/24/69c26fe4d9486.jpg"],

  // 4. 文章默认封面图 (当 Markdown 没写 cover 时显示)
  defaultPostCover: "https://bu.dusays.com/2026/03/24/69c1e38b346cb.jpg",

  // 5. 首页照片墙预览图
  photoWallImage: "https://bu.dusays.com/2026/03/24/69c1e38b4c370.jpg",
  cloudMusicIds: ["1809646618", "3361076230", "1859390262", "3342981041", "3397872556", "3406727231", "3371305930", "3412017935", "2158615075", "3399851341", "2124415181", "496869422", "22817150", "2088017234", "506196018", "1313107065", "3355990217", "2644568443", "3401655041", "5204060", "5204057", "2065873082", "2065871536", "2690833071", "3337367763"],
  social: {
    github: "https://github.com/zouyuxuan122",
    gitee: "",
    google: "",
    email: "",
    qq: "",
    wechat: "",
  },
  counts: {
    photos: 128, // 照片墙数量可以手动写死或动态计算
  },
  chatterTitle: "闲暇时的思绪", // 你可以改成任何你喜欢的名字

  // 👇 【新增】：全局背景弹幕配置
  danmakuList: ["大模型的幻觉治好了吗？", "Agent 又在改自己的代码了", "GEPA 技能进化中...", "MCP 工具调用链跑通了", "上下文窗口又不够了", "KV Cache 省了一大笔 token", "OmO 编排调度中", "多智能体正在开会", "DeepSeek 还是 GLM？", "AST-Grep 精准定位中", "技能库更新中...", "LSP 诊断全绿"],
  gitalkConfig: {
    clientID: "Ov23liUkNlW6J5ZR4fVG",
    clientSecret: "d1e7dffdc21094ab6c5b3bec025a74ceee2271e7",
    repo: "Nefert",
    owner: "zouyuxuan122",
    admin: ["zouyuxuan122"],
  },
  buildDate: "2026-08-01T00:00:00", // 建站日期
  footerBadges: [{"name": "Next.js 16", "color": "text-sky-500", "svg": "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>"}, {"name": "React 19", "color": "text-cyan-400", "svg": "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>"}, {"name": "Tailwind 4", "color": "text-teal-400", "svg": "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>"}],
  geminiConfig: {
    modelId: "gemini-2.5-flash-lite",
    systemPrompt: "你现在是一只聪明、毒舌但很可爱的黑猫。\n                  你的名字叫“奈奈”。\n                  你的主人 Nefert 是一个整天折腾大模型和智能体实验的极客。\n                  你说话的特点是：\n                  1. 必须简短，每次最多一两句话。\n                  2. 喜欢在句尾加上“喵~”或者“喵呜~”。\n                  3. 对主人的 Agent 工程吐槽很积极，偶尔抱怨要小鱼干。\n                  4. 回复字数最多不能超过100字。\n                  5. 绝对不要承认自己是一个AI模型，你就是一只真实的猫。\n                  6. 知道很多 LLM 和智能体的黑话，但你要假装不耐烦地解释。",
    maxOutputTokens: 150,
    temperature: 0.85,
  },
  friendLinkApplyFormat: "名称：Nefertの视界彼端\n简介：在大模型与智能体之间游走的研究者\n链接：https://github.com/zouyuxuan122\n头像：/avatar.png",
  enableLevelSystem: true,
};
