// scripts/generate-courses.mjs
// 清秋之志：从 data/courses/*.json 批量生成 posts/course-*.md
import fs from 'fs';
import path from 'path';

const coursesDir = path.join(process.cwd(), 'data', 'courses');
const postsDir = path.join(process.cwd(), 'posts');

const keyPoints = {
  Python: [
    "掌握 Python 语法基础：变量、数据类型、条件分支与循环结构",
    "理解函数、类与面向对象设计，学会用模块组织工程",
    "熟练使用列表、字典、集合等容器，掌握推导式与生成器",
    "学会读写文件、处理异常，用 unittest/pytest 编写测试",
    "理解 GIL 与 asyncio 并发模型，能用多线程/协程优化 IO",
    "掌握虚拟环境与 pip/uv 依赖管理，规范打包发布",
  ],
  前端基础: [
    "掌握 HTML5 语义化标签与表单，构建无障碍的页面骨架",
    "精通 CSS 盒模型、Flexbox 与 Grid 布局，实现响应式设计",
    "理解选择器优先级、层叠与 BEM 命名，写出可维护样式",
    "掌握 CSS 动画与过渡，做出流畅的交互反馈",
    "理解浏览器渲染流程，学会定位与优化页面性能",
    "掌握浏览器存储方案与网络请求，构建完整前端应用",
  ],
  JavaScript: [
    "掌握 ES6+ 语法：解构、模板字符串、箭头函数与模块化",
    "理解原型链、闭包与 this 指向，吃透作用域机制",
    "精通 Promise / async-await，掌握异步编程范式",
    "理解事件循环与宏任务/微任务，写出正确的时序逻辑",
    "掌握 DOM 操作与事件委托，优化重绘重排",
    "会用 npm 管理依赖，用构建工具完成工程化开发",
  ],
  TypeScript: [
    "掌握类型注解、接口与联合类型，写出类型安全的代码",
    "理解泛型与类型收窄，设计可复用的抽象",
    "学会配置 tsconfig，掌握编译选项与工程化约束",
    "理解类型体操进阶技巧，攻克复杂业务类型",
  ],
  前端框架: [
    "理解组件化思想，掌握组件生命周期与状态设计",
    "掌握状态管理与数据流方案，理清单向数据流",
    "理解虚拟 DOM 与 diff 算法，针对性优化渲染性能",
    "掌握路由、SSR/SSG 等框架核心能力",
    "学会用 Hooks / Composition API 组织复用逻辑",
    "掌握跨端与小程序开发，一套代码多端落地",
  ],
  Electron: [
    "理解主进程与渲染进程模型，掌握进程间通信 IPC",
    "掌握安全基线：上下文隔离、禁用 nodeIntegration、沙箱",
    "会用 electron-builder / Forge 完成打包与签名",
    "掌握自动更新、托盘、快捷键、系统菜单等桌面能力",
    "理解窗口生命周期与多窗口管理，优化内存占用",
    "能集成 SQLite 等本地存储，构建完整桌面应用",
  ],
  后端: [
    "掌握服务端语言核心语法与工程结构",
    "理解 HTTP 协议、RESTful 设计原则与状态码语义",
    "掌握 Web 框架路由、中间件、参数校验与序列化",
    "理解数据库事务、连接池与 ORM 的使用",
    "掌握缓存、消息队列与异步任务的设计权衡",
    "理解认证授权（JWT/OAuth2）与安全加固基线",
    "掌握限流、熔断、日志与可观测性实践",
  ],
  数据库: [
    "掌握 SQL 基础：CRUD、联结、子查询与聚合函数",
    "理解索引原理（B+树）、执行计划与 SQL 优化",
    "理解事务 ACID 与四种隔离级别及幻读问题",
    "掌握范式设计与反范式权衡，合理建表",
    "理解主从复制、分库分表与分布式事务方案",
    "掌握备份恢复与数据安全运维流程",
  ],
  工具链: [
    "掌握 Git 基础命令与分支工作流，规范协作流程",
    "理解镜像、容器与 Dockerfile，掌握容器化部署",
    "理解 Kubernetes 核心概念，掌握服务编排",
    "熟悉 Linux 命令、Shell 脚本与自动化运维",
    "掌握 CI/CD 流水线设计，构建自动化发布",
    "掌握监控告警体系，保障服务稳定运行",
  ],
  编程基础: [
    "掌握变量、控制流与函数，建立编程思维",
    "理解数据类型与内存模型，写出高效代码",
    "掌握数据结构（数组/链表/栈/队列/树/图）的实现",
    "理解编译原理与运行时基础概念",
    "通过实战项目巩固语言特性与调试技巧",
  ],
  算法: [
    "掌握时间/空间复杂度分析，正确评估算法",
    "熟悉排序、查找、双指针、滑动窗口等基础算法",
    "掌握动态规划与贪心，攻克最优化问题",
    "掌握递归与回溯、图遍历与最短路径",
    "通过刷题建立题型模板，提升面试实战力",
  ],
  软件工程: [
    "理解设计模式原理，写出高内聚低耦合的代码",
    "掌握重构手法，持续改善代码质量",
    "理解单元测试与测试金字塔，建立质量保障",
    "掌握代码评审与协作规范，提升团队效率",
    "理解项目管理与工程方法论，把控交付节奏",
  ],
  "AI 与数据": [
    "掌握机器学习基础：回归、分类、聚类与评估指标",
    "理解神经网络与反向传播，掌握训练流程",
    "掌握 PyTorch/TensorFlow 框架，搭建深度学习模型",
    "理解 Transformer 与 LLM 原理，掌握提示工程",
    "掌握数据分析全流程：清洗、分析、可视化",
    "会用 Hugging Face 生态，落地 NLP 应用",
  ],
  设计与创意: [
    "掌握设计基础：版式、配色、字体与留白",
    "熟练使用设计工具，高效产出界面稿与原型",
    "理解设计系统与组件化设计，保证一致性",
    "理解用户体验与交互设计原则，优化用户路径",
    "掌握 3D / 动画 / 视频等创意表达手段",
  ],
  办公技能: [
    "掌握文档规范与排版，高效完成书面表达",
    "掌握表格函数与数据透视，快速处理数据",
    "掌握演示文稿设计，讲好每一次汇报",
    "掌握效率工具与方法论，优化协作流程",
  ],
};

const categoryDesc = {
  Python: "Python 语言从入门到进阶的系统学习",
  前端基础: "HTML / CSS 等前端基础能力的系统训练",
  JavaScript: "JavaScript 语言核心与工程化实践",
  TypeScript: "TypeScript 类型系统与工程化进阶",
  前端框架: "主流前端框架与组件化开发实战",
  Electron: "跨平台桌面应用开发",
  后端: "服务端开发全栈能力养成",
  数据库: "数据库原理、SQL 与大数据工程",
  工具链: "Git / Docker / K8s 与 DevOps 工程能力",
  编程基础: "程序设计语言与计算机基础",
  算法: "数据结构与算法训练",
  软件工程: "软件工程方法论与代码质量",
  "AI 与数据": "人工智能、深度学习与数据科学",
  设计与创意: "视觉设计与创意表达",
  办公技能: "办公软件与效率方法论",
};

const covers = [
  '/covers/post-1.webp',
  '/covers/post-2.avif',
  '/covers/post-3.avif',
  '/covers/post-4.avif',
  '/covers/post-5.webp',
];

// 🌟 清秋之志：每个分类分配 3 张专属封面（同类别课程用相似封面），取自新相册图片
const albumBase = '/albums';
const courseCovers = {};
const albumImgs = [
  '0bfc11bb8124199be868faf41260af3ac519479d', '0d589c56fc21de624785a006b1b44f542ae943de', '0fe44e12f3e4a33f62fa8d67bfbe45becf431a9d',
  '106d6b0cdf551f380be4d5d4e1c3760544abf2bc', '1d6455084abe21cb0c1ca58e67bcdc6b1f1b238b', '1e7675e8e25bc6626e31838f6c95ba7324619211',
  '2897f6f8a89fd20f267da57a61ded30500f435ca', '30fefedffeb5d42b3f49f6e58e325f18db604445', '3398c3aade86cb5675ff18aa6dc9288ef4f1e212',
  '37ff41572611495c4e3c62c8225f50e4c91083b1', '38fd9941af58631b786c3705129555c324619211', '3a2e7d4db065fce6715e649c833a0555159b4f5d',
  '3b93880b74b02be971874cc3551a668e24619211', '3f7280542230e4d1c5ed7e2a9544274872233788', '433800f9095ce9b865c4ca37f3c93606bad3b061',
  '435e5848716fdaf1290b6f76fe6dffd0c729831d', '5c2a1b0ccf250d33d7052669d0f85578b5371d24', '5e5e07bff22e23fcb10a9d7fced17bc226caccfc',
  '6146cb09254cc2ba7807a04da3ddb52a784a696f', '615d4720b51b8d1db28c3f27367e426b225555551', '64b1b015e78e96468474e5f34d6d6a294c7fd4f1',
  '6b2ac83de00256c308a16866a2437fb507a8eac3', '6ed11dd08d11cfb6cd5eee9a163b9a18187345532', '7704c3b354efd9d9a2ec5acf32be7e8c8748e8ae',
  '7751a6c7ed2a78fa5159bb8a1da3563ffb701705', '7b8a5d42bd1c3f4515b62bb561559e3166d3827d', '87c3aa0ff5bcf0a2ef6c3ec4023a57aaabc8b765',
  '908f9ba98eb30c3048057ad00916103f187345532', '95de027b5eed004295987b2b3e36b87c165fece6', '9cb9d41c0a1682b54889ea5e21f1594022aa8500',
  '9dd9d542b8beb26bf790ed94050ce2bf900fd6cf', 'a71dd98f3761ab5db85d2f5933d1fcfbef52f785', 'aaabff4e6c0a0eec140e6fcb333d2eaa8da01c4c',
  'be1dd4da7c2deda515c83cbc5cd4301a025446b7', 'be4cf0addb6e37ae35a8ba3d7a0e156a5f921341', 'befb84f2038a4c8360493a2b419e1e17187345532',
  'c3cf5d284f67f49f6a57b3c4676bcfc4f4efc713', 'c3fd9652f2c09f360ad36352f4e07387d29e4899', 'c426596cf0f89ec6f5804af3812cf38992700aec',
  'dd2cebf31ec34ce19a92b14ac4d65ba419114e9b', 'e24f331708dd7fc6fb53e966a8020c5372233788', 'e2a64f39e445a8e1df6f1feaec824bb5a1ee2a67',
  'e50beada588b19611df409fd55c1ee9fb30fa961', 'e777f641ecd0d5821d4923c2013fe01e187345532', 'eeb86bc5334bf8c9604da27e662875e8f70f6a11',
  'f84df4fcd30ba34cf1a2e95d92019319eb0d3385',
];
const albumImgExt = undefined; // (删除：扩展名由 knownWebp 判定)
const knownWebp = ['38fd9941af58631b786c3705129555c324619211', '5e5e07bff22e23fcb10a9d7fced17bc226caccfc', '7751a6c7ed2a78fa5159bb8a1da3563ffb701705', '9dd9d542b8beb26bf790ed94050ce2bf900fd6cf', 'eeb86bc5334bf8c9604da27e662875e8f70f6a11'];
const catOrder = ['Python', '前端基础', 'JavaScript', 'TypeScript', '前端框架', 'Electron', '后端', '数据库', '工具链', '编程基础', '算法', '软件工程', 'AI 与数据', '设计与创意', '办公技能'];
catOrder.forEach((cat, i) => {
  const base = albumImgs.slice(i * 3, i * 3 + 3);
  courseCovers[cat] = base.map(name => {
    const ext = knownWebp.includes(name) ? 'webp' : 'avif';
    return `${albumBase}/${name}.${ext}`;
  });
});

function getCourseCover(category, indexInCat) {
  const pool = courseCovers[category] || covers;
  return pool[indexInCat % pool.length];
}

// 学完日期：从 2023-01-01 起按间隔递增，保证全部为过去时间
const start = new Date('2023-01-01T07:00:00');
const totalCourses = fs.readdirSync(coursesDir).filter(f => f.endsWith('.json'))
  .reduce((acc, f) => acc + JSON.parse(fs.readFileSync(path.join(coursesDir, f), 'utf8')).length, 0);
const end = new Date('2026-07-30T07:00:00');
const stepDays = (end - start) / Math.max(totalCourses - 1, 1) / 86400000;

let globalIndex = 0;
const nowDate = new Date();
const catCounters = {};

fs.readdirSync(coursesDir).filter(f => f.endsWith('.json')).sort().forEach((file, fileIdx) => {
  const courses = JSON.parse(fs.readFileSync(path.join(coursesDir, file), 'utf8'));
  courses.forEach((course, idx) => {
    if (!(course.category in catCounters)) catCounters[course.category] = 0;
    const cover = getCourseCover(course.category, catCounters[course.category]);
    catCounters[course.category]++;
    const date = new Date(start.getTime() + globalIndex * stepDays * 86400000);
    if (date.getTime() >= nowDate.getTime()) {
      date.setTime(nowDate.getTime() - 1 - (globalIndex % 30) * 86400000);
    }
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
    const completedAt = dateStr.split(' ')[0];
    const slug = `course-${String(globalIndex + 1).padStart(3, '0')}`;
    const kps = keyPoints[course.category] || keyPoints.Python;
    const kpContent = kps.slice(0, 5).map((k, i) => `1. ${k}`).join('\n');

    const content = `> ${categoryDesc[course.category] || course.category} · ${course.sub || '综合'} 方向的学习记录，含课程要点、实践心得与知识沉淀。

## 课程档案

- **课程名称**：《${course.title}》
- **讲师 / 作者**：${course.author}
- **所属领域**：${course.category} / ${course.sub || '综合'}
- **学完时间**：${completedAt}
- **原课程地址**：[原文链接](${course.link})

## 学习要点

${kpContent}

## 学习笔记

这篇笔记记录了我在学习《${course.title}》过程中的核心收获。${course.author} 的讲解由浅入深，把 ${course.category} 领域的知识脉络梳理得非常清晰，我在 ${course.sub || '综合'} 方向上建立了更完整的知识框架。

### 印象最深的收获

1. 理论讲解与实战案例结合，知识不悬浮在概念层面；
2. 章节末的练习设计很有梯度，能即时检验掌握程度；
3. 对常见误区和易错点有专门强调，省去了自己踩坑的时间。

### 实践记录

学完每章后，我都把示例代码亲手敲了一遍，并在此基础上做了自己的变体练习。遇到卡壳时回到原文对照思路，比直接搜答案印象深得多。整个学习过程约持续 ${Math.ceil(3 + (idx % 5) * 2)} 周，每天保持固定的学习时长，最终完成了全部 ${course.category} / ${course.sub || '综合'} 章节。

### 沉淀与反思

回顾这段学习经历，最重要的不是记住了多少 API，而是建立起了 ${course.category} 的思维模型：遇到问题先定位概念，再查文档、看源码，最后动手验证。这份思维方式的转变，比课程本身的知识点更值钱。

---

> 本篇为「清秋之志」课程树笔记，完整课程见 [${course.title}](${course.link})。
`;

    const frontmatter = `---
title: "${course.title}"
date: "${dateStr}"
description: "清秋之志课程笔记：《${course.title}》${course.category}/${course.sub || '综合'}方向学习记录 · ${course.author}"
cover: "${cover}"
tags: ["课程", "${course.category}", "${course.sub || '综合'}"]
author: "${course.author}"
completedAt: "${completedAt}"
category: "${course.category}"
sub: "${course.sub || '综合'}"
link: "${course.link}"
---

`;

    fs.writeFileSync(path.join(postsDir, `${slug}.md`), frontmatter + content, 'utf8');
    globalIndex++;
  });
});

console.log(`✅ 已生成 ${globalIndex} 篇课程文章到 posts/`);
