// src/pages/BlogPost.jsx
// Public SEO blog article at /blog/:slug (and localized /es|/fr/blog/:slug).
// Pre-rendered for Google. Content comes from src/data/blogPosts.js.

import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { getPost, getLocalizedPost, postLangs } from '../data/blogPosts';

const GRADIENT = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';
const PINK = '#EC4899';
const BASE = 'https://orary.app';

// Localized chrome strings (the article body comes from the post data).
const UI = {
  en: { minRead: 'min read', keepReading: 'Keep reading', allArticles: '← All articles', tracker: '88-day visa tracker' },
  es: { minRead: 'min de lectura', keepReading: 'Seguí leyendo', allArticles: '← Todos los artículos', tracker: 'Tracker visa 88 días' },
  fr: { minRead: 'min de lecture', keepReading: 'À lire ensuite', allArticles: '← Tous les articles', tracker: 'Suivi visa 88 jours' },
};

const blogPath = (lang, slug = '') => `${lang === 'en' ? '' : `/${lang}`}/blog${slug ? `/${slug}` : ''}`;

const LINK_CLS = 'font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-2';

// Pull the post slug out of an internal blog href like /es/blog/<slug>.
const slugFromHref = (href) => {
  const m = href.match(/\/blog\/([^/?#]+)/);
  return m ? m[1] : null;
};

// Internal blog link that shows a small localized preview card on hover.
const BlogLink = ({ href, label, lang }) => {
  const slug = slugFromHref(href);
  const target = slug ? getLocalizedPost(slug, lang) : null;
  const [open, setOpen] = useState(false);

  if (!target) return <Link to={href} className={LINK_CLS}>{label}</Link>;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link to={href} className={LINK_CLS}>{label}</Link>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-20 mt-2 block w-72 max-w-[80vw] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl pointer-events-none"
            style={{ borderTopColor: target.accent, borderTopWidth: 3 }}
          >
            <span
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 not-italic align-middle"
              style={{ backgroundColor: `${target.accent}1a`, color: target.accent }}
            >
              {target.tag}
            </span>
            <span className="block text-sm font-bold text-slate-800 leading-snug">{target.title}</span>
            <span className="block text-xs text-slate-500 leading-relaxed mt-1 line-clamp-3">{target.description}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

// Render **bold** spans and [label](url) links inside a plain-text block.
// Internal paths (starting with "/") become preview-card blog links; anything
// else renders as a normal anchor.
const renderText = (text, lang = 'en') => {
  const nodes = [];
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      const [, , label, href] = match;
      nodes.push(
        href.startsWith('/')
          ? <BlogLink key={key++} href={href} label={label} lang={lang} />
          : <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>{label}</a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

const Block = ({ block, accent, lang }) => {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-8 mb-3">{block.text}</h2>;
    case 'ul':
      return (
        <ul className="list-disc pl-5 space-y-1.5 my-3 text-slate-600">
          {block.items.map((it, i) => <li key={i}>{renderText(it, lang)}</li>)}
        </ul>
      );
    case 'table':
      return (
        <div className="my-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left font-semibold text-slate-700 border-b-2 border-slate-200 px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri} className="border-b border-slate-100">
                  {r.map((c, ci) => <td key={ci} className="px-3 py-2 text-slate-600 align-top">{renderText(c, lang)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'steps':
      return (
        <div className="my-6">
          {block.items.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </div>
                {i < block.items.length - 1 && (
                  <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: `${accent}33` }} />
                )}
              </div>
              <div className="pb-5">
                <p className="font-semibold text-slate-800">{step.title}</p>
                <p className="text-slate-600 text-sm leading-relaxed mt-1">{renderText(step.text, lang)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    case 'note':
      return (
        <div className="my-5 rounded-xl border-l-4 bg-slate-50 px-4 py-3 text-sm text-slate-600" style={{ borderColor: accent }}>
          {renderText(block.text, lang)}
        </div>
      );
    case 'cta':
      return (
        <div className="my-7 rounded-2xl p-6 text-center" style={{ background: GRADIENT }}>
          <p className="text-white font-semibold mb-4">{block.text}</p>
          <Link
            to={block.to}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: PINK, boxShadow: `0 4px 20px ${PINK}50` }}
          >
            {block.label} <ArrowRight size={15} />
          </Link>
        </div>
      );
    case 'p':
    default:
      return <p className="text-slate-600 leading-relaxed my-3">{renderText(block.text)}</p>;
  }
};

const BlogPost = ({ lang = 'en' }) => {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/blog" replace />;
  // No translation for this language → send to the English version.
  if (lang !== 'en' && !post.translations?.[lang]) return <Navigate to={`/blog/${slug}`} replace />;

  const ui = UI[lang] || UI.en;
  const L = getLocalizedPost(slug, lang);
  const langs = postLangs(post);
  const url = `${BASE}${blogPath(lang, slug)}`;
  const dateLocale = lang === 'en' ? 'en-US' : lang;

  const relatedPosts = (post.related || []).map(getPost).filter(Boolean);
  const relHref = (rp) => (lang !== 'en' && rp.translations?.[lang] ? blogPath(lang, rp.slug) : `/blog/${rp.slug}`);

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: L.title,
    description: L.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: lang,
    mainEntityOfPage: url,
    url,
    author: { '@type': 'Organization', name: 'Orary' },
    publisher: {
      '@type': 'Organization',
      name: 'Orary',
      logo: { '@type': 'ImageObject', url: 'https://orary.app/assets/images/logo2.png' },
    },
    image: 'https://orary.app/assets/images/logo2.png',
  });
  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${BASE}${blogPath(lang)}` },
      { '@type': 'ListItem', position: 2, name: L.title, item: url },
    ],
  });

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      <Helmet>
        <html lang={lang} />
        <title>{`${L.title} | Orary`}</title>
        <meta name="description" content={L.description} />
        <link rel="canonical" href={url} />
        {langs.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${BASE}${blogPath(l, slug)}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={L.title} />
        <meta property="og:description" content={L.description} />
        <meta property="og:image" content="https://orary.app/assets/images/logo2.png" />
        <meta property="article:published_time" content={post.date} />
        <script type="application/ld+json">{articleJsonLd}</script>
        <script type="application/ld+json">{breadcrumbJsonLd}</script>
      </Helmet>

      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10" style={{ background: GRADIENT }}>
        <div className="flex items-center justify-between px-5 xl:px-10 py-3.5 max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/SVG/logo-white.svg" alt="Orary" className="w-7 h-7" />
            <span className="text-white font-bold text-base">Orary</span>
          </Link>
          <div className="flex items-center gap-2">
            {langs.length > 1 && (
              <div className="flex items-center gap-0.5 rounded-xl bg-white/10 p-0.5">
                {langs.map((l) => (
                  <Link
                    key={l}
                    to={blogPath(l, slug)}
                    hrefLang={l}
                    aria-current={l === lang ? 'true' : undefined}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                      l === lang ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {l}
                  </Link>
                ))}
              </div>
            )}
            <Link to={blogPath(lang)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <ArrowLeft size={14} /> Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: GRADIENT }} className="px-5 xl:px-10 pt-12 pb-28">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wide uppercase"
              style={{ backgroundColor: `${post.accent}33`, color: '#c7d2fe' }}
            >
              {L.tag || post.tag}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{L.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
              <span>{new Date(post.date).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readingTime} {ui.minRead}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article card */}
      <div className="px-5 xl:px-10 max-w-3xl mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="-mt-20 relative bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-9"
        >
          {L.content.map((block, i) => <Block key={i} block={block} accent={post.accent} lang={lang} />)}
        </motion.article>

        {relatedPosts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{ui.keepReading}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rp) => {
                const rl = getLocalizedPost(rp.slug, lang);
                return (
                  <Link
                    key={rp.slug}
                    to={relHref(rp)}
                    className="group block bg-white rounded-2xl border border-slate-200 shadow-sm p-4 transition-shadow hover:shadow-md"
                  >
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                      style={{ backgroundColor: `${rp.accent}1a`, color: rp.accent }}
                    >
                      {rl.tag || rp.tag}
                    </span>
                    <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-slate-900">{rl.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 mb-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <Link to={blogPath(lang)} className="hover:text-pink-500 transition-colors">{ui.allArticles}</Link>
          <Link to="/australia-88" className="hover:text-pink-500 transition-colors">{ui.tracker}</Link>
          <Link to="/faq" className="hover:text-pink-500 transition-colors">FAQ</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
