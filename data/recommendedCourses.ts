// 🌟 首页「推荐课程」栏目数据：手动精选，标注难度
export interface RecommendedCourse {
  slug: string;
  title: string;
  category: string;
  cover: string;
  difficulty: '入门' | '进阶' | '高级';
}

export const recommendedCourses: RecommendedCourse[] = [
  {
    slug: 'course-217',
    title: 'TypeScript 高级类型实战',
    category: 'TypeScript',
    cover: '/albums/38fd9941af58631b786c3705129555c324619211.webp',
    difficulty: '高级',
  },
  {
    slug: 'course-088',
    title: '吴恩达机器学习课程（Coursera）',
    category: 'AI 与数据',
    cover: '/albums/c3fd9652f2c09f360ad36352f4e07387d29e4899.avif',
    difficulty: '进阶',
  },
  {
    slug: 'course-001',
    title: 'Python 官方教程',
    category: 'Python',
    cover: '/albums/0bfc11bb8124199be868faf41260af3ac519479d.avif',
    difficulty: '入门',
  },
  {
    slug: 'course-132',
    title: 'MDN CSS 教程',
    category: '前端基础',
    cover: '/albums/1d6455084abe21cb0c1ca58e67bcdc6b1f1b238b.avif',
    difficulty: '入门',
  },
  {
    slug: 'course-105',
    title: 'ECharts 官方教程',
    category: 'AI 与数据',
    cover: '/albums/c3cf5d284f67f49f6a57b3c4676bcfc4f4efc713.avif',
    difficulty: '进阶',
  },
  {
    slug: 'course-197',
    title: 'JavaScript 高级程序设计（红宝书）',
    category: 'JavaScript',
    cover: '/albums/2897f6f8a89fd20f267da57a61ded30500f435ca.avif',
    difficulty: '进阶',
  },
];
