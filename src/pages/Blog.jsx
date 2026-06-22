// src/pages/Blog.jsx
// Public SEO blog index at /blog (and localized /es|/fr/blog). Pre-rendered for Google.

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { postsForLang, getLocalizedPost } from '../data/blogPosts';

const GRADIENT = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)';
const PINK = '#EC4899';
const BASE = 'https://orary.app';
const LANGS = ['en', 'es', 'fr'];

const blogPath = (lang, slug = '') => `${lang === 'en' ? '' : `/${lang}`}/blog${slug ? `/${slug}` : ''}`;

const UI = {
  en: {
    getStarted: 'Get started free', min: 'min',
    title: 'Guides for workers on the move',
    subtitle: 'Earnings, taxes and Working Holiday Visa days — explained simply, by people who’ve done the shifts.',
    seoTitle: 'Blog — Orary | Shift work, earnings & Working Holiday Visa guides',
    seoDesc: 'Practical guides for shift workers, delivery riders and Working Holiday Visa backpackers: track your 88 days, calculate your real pay, and stay on top of your earnings.',
  },
  es: {
    getStarted: 'Empezá gratis', min: 'min',
    title: 'Guías para trabajadores en movimiento',
    subtitle: 'Ganancias, impuestos y los días de la Working Holiday Visa — explicado simple, por gente que hizo los turnos.',
    seoTitle: 'Blog — Orary | Turnos, ganancias y guías de Working Holiday Visa',
    seoDesc: 'Guías prácticas para trabajadores por turnos, riders de delivery y backpackers con Working Holiday Visa: cómo contar tus 88 días, calcular tu sueldo real y controlar tus ganancias.',
  },
  fr: {
    getStarted: 'Commence gratuitement', min: 'min',
    title: 'Guides pour les travailleurs en mouvement',
    subtitle: 'Revenus, impôts et jours de Working Holiday Visa — expliqués simplement, par ceux qui ont fait les quarts.',
    seoTitle: 'Blog — Orary | Travail, revenus et guides Working Holiday Visa',
    seoDesc: 'Guides pratiques pour les travailleurs en quarts, livreurs et backpackers en Working Holiday Visa : compter tes 88 jours, calculer ta vraie paie et suivre tes revenus.',
  },
};

const Blog = ({ lang = 'en' }) => {
  const ui = UI[lang] || UI.en;
  const posts = postsForLang(lang).map((p) => getLocalizedPost(p.slug, lang));
  const url = `${BASE}${blogPath(lang)}`;
  const dateLocale = lang === 'en' ? 'en-US' : lang;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Orary Blog',
    url,
    inLanguage: lang,
    description: ui.seoDesc,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${BASE}${blogPath(lang, p.slug)}`,
    })),
  });

  return (
    <div className="min-h-screen bg-slate-50 font-poppins">
      <Helmet>
        <html lang={lang} />
        <title>{ui.seoTitle}</title>
        <meta name="description" content={ui.seoDesc} />
        <link rel="canonical" href={url} />
        {LANGS.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${BASE}${blogPath(l)}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${BASE}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={ui.seoTitle} />
        <meta property="og:description" content={ui.seoDesc} />
        <meta property="og:image" content="https://orary.app/assets/images/logo2.png" />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>

      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10" style={{ background: GRADIENT }}>
        <div className="flex items-center justify-between px-5 xl:px-10 py-3.5 max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/SVG/logo-white.svg" alt="Orary" className="w-7 h-7" />
            <span className="text-white font-bold text-base">Orary</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-xl bg-white/10 p-0.5">
              {LANGS.map((l) => (
                <Link
                  key={l}
                  to={blogPath(l)}
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
            <Link
              to="/register"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: PINK }}
            >
              {ui.getStarted} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: GRADIENT }} className="px-5 xl:px-10 pt-12 pb-14">
        <div className="max-w-screen-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Blog space wordmark — mirrors the two-tone "Or|ary" logo split from /about */}
            <span className="inline-block mb-4 text-2xl font-extrabold tracking-tight leading-none">
              <span className="text-white">Blog</span>
              <span style={{ color: PINK }}>ary</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{ui.title}</h1>
            <p className="text-slate-400 text-sm mt-3 max-w-xl">{ui.subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Post list */}
      <div className="px-5 xl:px-10 py-10 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to={blogPath(lang, p.slug)}
                className="group block h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="h-1 w-full" style={{ backgroundColor: p.accent }} />
                <div className="p-5">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3"
                    style={{ backgroundColor: `${p.accent}1a`, color: p.accent }}
                  >
                    {p.tag}
                  </span>
                  <h2 className="text-base font-bold text-slate-800 leading-snug group-hover:text-slate-900">
                    {p.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2 line-clamp-3">{p.description}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                    <span>{new Date(p.date).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {p.readingTime} {ui.min}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 xl:px-10 py-6 border-t border-slate-200">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <Link to="/australia-88" className="hover:text-slate-600 transition-colors">88-day visa tracker</Link>
          <Link to="/faq" className="hover:text-slate-600 transition-colors">FAQ</Link>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
