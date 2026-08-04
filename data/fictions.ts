// 🌟 杂谈「小说」栏目：小说正文存放在 fictions/*.md，由页面读取解析
export interface Fiction {
  slug: string;
  title: string;
  date: string;
  cover?: string;
  tags?: string[];
  content: string;
  afterword?: string;
}
