// src/pages/BlogPost.jsx
// Public SEO blog article at /blog/:slug (and localized /es|/fr/blog/:slug).
// Pre-rendered for Google. Content comes from src/data/blogPosts.js.

import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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

// Render **bold** spans inside a plain-text block.
const renderText = (text) =>
  text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>));

const Block = ({ block, accent }) => {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-8 mb-3">{block.text}</h2>;
    case 'ul':
      return (
        <ul className="list-disc pl-5 space-y-1.5 my-3 text-slate-600">
          {block.items.map((it, i) => <li key={i}>{renderText(it)}</li>)}
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
                  {r.map((c, ci) => <td key={ci} className="px-3 py-2 text-slate-600 align-top">{renderText(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'note':
      return (
        <div className="my-5 rounded-xl border-l-4 bg-slate-50 px-4 py-3 text-sm text-slate-600" style={{ borderColor: accent }}>
          {renderText(block.text)}
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
          <Link to={blogPath(lang)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft size={14} /> Blog
          </Link>
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
          {L.content.map((block, i) => <Block key={i} block={block} accent={post.accent} />)}
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
