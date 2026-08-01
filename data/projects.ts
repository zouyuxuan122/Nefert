export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl?: string;
  tags: string[];
};

export const projectsData: Project[] = [
  {
    "id": "proj_zxcode",
    "name": "ZX-Code",
    "githubUrl": "https://github.com/zouyuxuan122/ZX-code",
    "description": "全能 AI 编程 Agent：免 API Key 直连 DeepSeek/GLM/Kimi 等九家国产大模型，内置技能自进化引擎（GEPA）、长期记忆、OmO 多智能体编排、AST-Grep/LSP 代码理解和 3D 桌宠工作台。",
    "icon": "ZX",
    "tags": ["AI Agent", "GEPA", "OmO", "MCP"]
  },
  {
    "id": "proj_zxsite",
    "name": "ZX-Code Website",
    "githubUrl": "https://github.com/zouyuxuan122/zx-code-website",
    "description": "ZX-Code 的展示网站：暗色玻璃拟态 + 非线性动效，部署于 GitHub Pages。",
    "icon": "W",
    "tags": ["Next.js", "Glassmorphism", "GitHub Pages"]
  },
  {
    "id": "proj_chatxuan_android",
    "name": "ChatXuan Android",
    "githubUrl": "https://github.com/zouyuxuan122/chatxuan-android-",
    "description": "ChatXuan 的 Android 客户端，自己日常在用的移动端入口。",
    "icon": "A",
    "tags": ["Android", "AI", "App"]
  },
  {
    "id": "proj_multiagent_paper",
    "name": "多模型协同推演",
    "githubUrl": "https://github.com/zouyuxuan122/2.-Multi-Agent-Collaborative-Deliberation",
    "description": "多模型协同系统的方法论研究：系统性梳理多 Agent 协同的短板与对策，为构建高性能、高可靠的桌面级推理应用打基础。",
    "icon": "M",
    "tags": ["Multi-Agent", "Research", "System Design"]
  },
  {
    "id": "proj_zxdex",
    "name": "zxdex",
    "description": "更通用的桌面级 AI 智能体框架：能（可选）看见屏幕、调用本地工具、替你执行重复操作，本地优先、低打扰。",
    "icon": "D",
    "tags": ["Agent", "Tool Use", "Local-first"]
  },
  {
    "id": "proj_chatzxplus",
    "name": "Chat-zx-plus",
    "description": "AI 服务反向代理管理器：把 DeepSeek、GLM、Kimi、Qwen 等平台聚合成 OpenAI 兼容 API，支持负载均衡、模型映射与请求日志。",
    "icon": "P",
    "tags": ["Reverse Proxy", "OpenAI API", "Multi-Provider"]
  },
  {
    "id": "proj_fengyue",
    "name": "小宣风月",
    "description": "AI 桌面陪伴正式版：在清浅 v1 之上重写了整套架构，加入角色系统、长期记忆、可插拔技能与窗口交互，目标是做一个真正「住进桌面」的 AI 伴侣。",
    "icon": "风",
    "tags": ["Electron", "Vue 3", "TypeScript", "LLM"]
  },
  {
    "id": "proj_fengyue_v1",
    "name": "小宣风月 · 清浅 v1",
    "description": "AI 桌面陪伴初代原型：把一个会呼吸、会聊天的 AI 装进桌面悬浮窗，支持多轮对话、表情与轻量记忆，记录了最初关于「桌面伙伴」的所有想象。",
    "icon": "清",
    "tags": ["Electron", "AI SDK", "WebSocket"]
  },
  {
    "id": "proj_fengyue_claw",
    "name": "小宣风月 claw",
    "description": "把风月系列拆成可独立发布的 monorepo：核心、桌面壳、Skill 库、CLI 工具各自演进，每个部件都能单独转动。",
    "icon": "爪",
    "tags": ["Monorepo", "Electron", "Plugin System"]
  },
  {
    "id": "proj_xiaodao_mcp",
    "name": "小宣 mcp",
    "description": "基于 MCP 协议实现的小型服务器：让 AI 客户端可以调用本地工具、文件与窗口操作，把「桌面能力」暴露给智能体。",
    "icon": "M",
    "tags": ["MCP", "TypeScript", "JSON-RPC"]
  },
  {
    "id": "proj_evospark",
    "name": "Qingq · EvoSpark",
    "description": "在核显笔记本上运行的本地自进化 AI 模型方案：以 MoE 稀疏激活、动态 Early Exit、LoRA 增量学习为核心，半小时完成一轮自我迭代。",
    "icon": "E",
    "tags": ["PyTorch", "MoE", "LoRA", "Self-Evolve"]
  },
  {
    "id": "proj_xuanxuan",
    "name": "xuanxuan",
    "description": "「能看见你屏幕」的 AI 助手雏形：截图、识别、可执行操作脚本，在本地电脑上演示「AI 当助手」的早期尝试。",
    "icon": "x",
    "tags": ["Python", "Computer Vision", "Automation"]
  },
  {
    "id": "proj_aistudy",
    "name": "ai-study-system",
    "description": "AI 驱动的学习系统：把学习资料、错题、心得喂给一个会成长的 AI 伙伴，自动出题、知识图谱、间隔重复，让自学不再孤单。",
    "icon": "学",
    "tags": ["AI", "Spaced Repetition", "Knowledge Graph"]
  },
  {
    "id": "proj_hailing",
    "name": "浅音",
    "description": "基于 Qwen 模型的本地文本转语音 Web 界面：多音色切换、语速调节、批量生成，把高质量语音合成搬进本地浏览器，零依赖云端。",
    "icon": "海",
    "tags": ["Python", "FastAPI", "Qwen TTS"]
  },
  {
    "id": "proj_sap",
    "name": "Super Agent Party",
    "description": "多智能体协作派对：让多个 AI 智能体在同一空间里协作、讨论、甚至「吵起来」，一个小型沙盒，支持自定义角色与情景剧本。",
    "icon": "S",
    "tags": ["Multi-Agent", "Electron", "Streaming"]
  },
  {
    "id": "proj_sap_branch",
    "name": "Super Agent Party · 分支",
    "description": "Super Agent Party 的并行分支：探索更开放的 Agent 协议与可视化执行流，两个版本互相喂养想法，孵化更好的协作体验。",
    "icon": "S",
    "tags": ["Multi-Agent", "Visualization", "Sandbox"]
  },
  {
    "id": "proj_n9a",
    "name": "N9A-agent-zx",
    "description": "为《重返未来：1999》代肝托管而生的智能 Agent 系统：自动日常、刷材料、清体力、活动跟踪，基于 MCP 协议的任务编排，支持多账号并行与异常自恢复。",
    "icon": "N",
    "tags": ["Python", "MCP", "Agent", "Game"]
  },
  {
    "id": "proj_werewolf",
    "name": "AI 狼人杀模拟器",
    "description": "多 AI 博弈的桌面推理游戏：让多个大模型扮演不同角色的狼人杀，发言、投票、女巫救人各有独立记忆与策略，支持视频录制、历史回放与自定义规则。",
    "icon": "狼",
    "tags": ["Electron", "Gemini API", "TTS"]
  },
  {
    "id": "proj_novelcompany",
    "name": "小说公司",
    "description": "AI 辅助小说创作平台：把 AI 当作你的「编辑部」，多角色讨论、章节级一致性、人物档案与世界观库，多人协作下让一个故事从大纲长成长篇。",
    "icon": "说",
    "tags": ["LLM", "Editor", "Multi-User"]
  },
  {
    "id": "proj_summercherry",
    "name": "夏日樱桃",
    "githubUrl": "https://github.com/zouyuxuan122/summer-cherry",
    "description": "基于 enigma protector 与 VoidNovelEngine 引擎打造的夏日主题视觉互动小说。",
    "icon": "夏",
    "tags": ["Visual Novel", "VoidNovelEngine"]
  },
  {
    "id": "proj_piupiu",
    "name": "PiuPiu Desktop",
    "description": "轻量的 IM 客户端雏形：极简界面、可扩展协议层、对小窗模式做了特别优化，希望聊天的体验更安静、不打扰。",
    "icon": "P",
    "tags": ["Electron", "IM Protocol", "WebSocket"]
  },
  {
    "id": "proj_seatmaster",
    "name": "SeatMaster Pro",
    "githubUrl": "https://github.com/zouyuxuan122/zouyuxuan122.github.io",
    "description": "AI 智能座位管家：为活动、教室、婚礼、考场设计的座位编排工具，可视化拖拽、自动分配算法、导出 PDF/Excel，把繁琐的排座交给一行「智能分配」。",
    "icon": "S",
    "tags": ["Algorithm", "Canvas", "PDF Export"]
  },
  {
    "id": "proj_opensteamtool",
    "name": "OpenSteamTool GUI",
    "description": "给命令行 Steam 工具包上一层直观界面：批量管理游戏、备份存档、修复库，让非命令行用户也能享受的开源小工具。",
    "icon": "O",
    "tags": ["Electron", "Steam API", "CLI Wrapper"]
  },
  {
    "id": "proj_poem",
    "name": "poem-main",
    "description": "把古诗词放进桌面的静默角落：每日一诗、随机翻牌、收藏夹，希望打开电脑的瞬间，能和一千年前的句子打一个照面。",
    "icon": "诗",
    "tags": ["Electron", "Poetry API", "Tray Widget"]
  },
  {
    "id": "proj_zxsong",
    "name": "zx-song",
    "description": "把下载这件事「藏回桌面」的小工具：粘贴链接、选清晰度、回车，让保存视频和音乐回到干净的三步流程。",
    "icon": "Z",
    "tags": ["Electron", "yt-dlp", "FFmpeg"]
  },
  {
    "id": "proj_zhushou_ebook",
    "name": "zhushou ebook",
    "description": "电子书阅读助手：多格式支持、章节进度、护眼排版，一个小而完整的阅读容器。",
    "icon": "书",
    "tags": ["Android", "EPUB", "Renderer"]
  },
  {
    "id": "proj_reversetools",
    "name": "逆向工具",
    "description": "用于静态/动态分析的一组 Python 脚本集：解包、特征提取、报告生成，把研究过程中重复的环节固化成可复用的工具。",
    "icon": "逆",
    "tags": ["Python", "Reverse Engineering", "Scripting"]
  },
  {
    "id": "proj_qingqian",
    "name": "qingqian mcd",
    "description": "典型的「现代全栈」骨架：FastAPI 做后端服务、Next.js 做前端渲染、类型安全从前到后，让小程序也能按生产级标准快速落地。",
    "icon": "Q",
    "tags": ["FastAPI", "Next.js", "PostgreSQL"]
  },
  {
    "id": "proj_radar",
    "name": "radar-video-generator",
    "description": "把雷达数据、动画与音频合成为可视化视频的 Node 工具，可作为 demo、汇报背景或音乐可视化使用。",
    "icon": "R",
    "tags": ["Node.js", "Canvas", "FFmpeg", "WebGL"]
  },
  {
    "id": "proj_zhongkao_jin",
    "name": "中考锦囊",
    "description": "小米手环 9 上的备考小应用：每日一题、考前倒计时、错题回顾，把「再坚持一下」放进抬手就能看见的地方。",
    "icon": "锦",
    "tags": ["Quick App", "Mi Band 9", "Wear OS"]
  },
  {
    "id": "proj_zhongkao_helper",
    "name": "中考助手",
    "description": "中考冲刺伴侣的快应用版：科目复习计划、错题本、考前提醒，轻盈、安静，专注于手腕上的那一小段时间。",
    "icon": "中",
    "tags": ["Quick App", "Mi Band 9", "Scheduler"]
  },
  {
    "id": "proj_web",
    "name": "web",
    "githubUrl": "https://github.com/zouyuxuan122/web",
    "description": "我的第一代个人站：单页 HTML 作品集，带 3D 透视卡片与项目巡览动效，是本博客的前身。",
    "icon": "W",
    "tags": ["HTML", "Portfolio", "3D Effects"]
  },
  {
    "id": "proj_999",
    "name": "999",
    "githubUrl": "https://github.com/zouyuxuan122/999",
    "description": "早期网页实验页，为这个博客的交互风格积累了不少点子。",
    "icon": "9",
    "tags": ["HTML", "Experiment"]
  },
];
