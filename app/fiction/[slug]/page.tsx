import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'highlight.js/styles/atom-one-dark.css';

import Navbar from '../../../components/Navbar';
import PageTransition from '../../../components/PageTransition';
import BackButton from '../../../components/BackButton';
import { siteConfig } from '../../../siteConfig';

async function getFictionData(slug: string) {
  const fullPath = path.join(process.cwd(), 'fictions', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  let { data, content } = matter(fileContents);

  content = content.replace(/\r\n/g, '\n').replace(/^[ \t]+$/gm, '');
  const blocks = content.split(/(```[\s\S]*?```)/g);
  content = blocks.map((block, index) => {
    if (index % 2 === 1) return block;
    return block.replace(/\n{3,}/g, (match) => {
      const brCount = match.length - 2;
      return '\n\n' + '<br/>'.repeat(brCount) + '\n\n';
    });
  }).join('');

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    // @ts-ignore
    .use(rehypeHighlight, { detect: true, ignoreMissing: true, subset: ['cpp', 'c', 'python', 'java', 'javascript', 'typescript', 'go', 'rust', 'bash', 'json', 'html', 'css', 'sql', 'xml'] })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return {
    slug,
    contentHtml: processedContent.toString(),
    title: data.title,
    date: data.date,
    tags: data.tags && Array.isArray(data.tags) ? data.tags : [],
    motto: data.motto || '',
    cover: data.cover || '/covers/fiction-qi-ri.png',
  };
}

function renderAfterword(text: string) {
  const parts = text.split(/(https?:\/\/[^\s（）()]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 underline underline-offset-2 hover:opacity-80 transition-opacity">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default async function FictionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const fiction = await getFictionData(resolvedParams.slug);

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />
      <PageTransition>
        <main className="w-[95%] md:w-[90%] max-w-6xl mx-auto mt-24 md:mt-28 flex flex-col gap-6 relative z-10">

          <article className="flex-1 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700">
            <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 relative group">
              <img src={fiction.cover} alt="封面" className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" />
            </div>

            <div className="p-5 md:p-12 relative">
              <BackButton />

              <header className="mb-6 md:mb-8 border-b border-slate-300/50 dark:border-slate-700 pb-5 md:pb-6 relative">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-black text-pink-600 dark:text-pink-400 bg-pink-500/10 dark:bg-pink-400/10 border border-pink-500/20">
                    小说
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors duration-700 pr-16 md:pr-24 leading-snug">
                  {fiction.title}
                </h1>

                {fiction.motto && (
                  <p className="italic text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mb-4 md:mb-5 flex items-start gap-2 leading-relaxed">
                    <span className="w-1 h-4 md:h-5 bg-pink-400/60 rounded-full mt-1 flex-shrink-0"></span>
                    {fiction.motto}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {fiction.tags.map((tag: string) => (
                    <div key={tag} className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold bg-white/30 dark:bg-slate-900/50 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-colors duration-700 shadow-sm border border-white/20 dark:border-white/5">
                      <span className="text-[10px] md:text-xs opacity-70">#</span> {tag}
                    </div>
                  ))}
                </div>
              </header>

              <div className="relative">
                <style>{`
                  .prose h1 { font-size: 1.8rem !important; font-weight: 900 !important; margin-bottom: 1.2rem !important; margin-top: 2rem !important; line-height: 1.3 !important; color: inherit !important; }
                  .prose h2 { font-size: 1.5rem !important; font-weight: 800 !important; margin-bottom: 1rem !important; margin-top: 1.5rem !important; color: inherit !important; }
                  .prose h3 { font-size: 1.2rem !important; font-weight: 700 !important; margin-bottom: 0.8rem !important; color: inherit !important; }
                  .prose p { font-size: 0.95rem !important; line-height: 1.85 !important; color: inherit !important; }
                  .prose blockquote { border-left: 3px solid #a855f7 !important; padding-left: 1rem !important; color: inherit !important; opacity: 0.9 !important; }
                  .prose img { border-radius: 0.75rem !important; margin: 1rem auto !important; }
                  .prose code { background: rgba(99,102,241,0.12) !important; padding: 0.15rem 0.4rem !important; border-radius: 0.3rem !important; font-size: 0.85em !important; }
                  .prose pre { border-radius: 0.75rem !important; overflow-x: auto !important; font-size: 0.85rem !important; }
                `}</style>
                <div className="prose max-w-none text-slate-800 dark:text-slate-200 tracking-wide transition-colors duration-700" dangerouslySetInnerHTML={{ __html: fiction.contentHtml }} />
              </div>

              <div className="mt-10 md:mt-14 pt-6 border-t border-slate-300/50 dark:border-slate-700 text-center">
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium italic mb-4">—— 故事还没有结束，它由你我来书写 ——</p>
                <Link
                  href="/chatter?tab=fiction"
                  className="inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-full bg-indigo-500 text-white font-black text-sm md:text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  ← 返回小说栏目
                </Link>
              </div>
            </div>
          </article>
        </main>
      </PageTransition>
    </div>
  );
}
