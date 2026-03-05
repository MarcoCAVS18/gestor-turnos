// src/components/about/FeedbackSection/index.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, UserX, Send, Heart, User, EyeOff, MessageSquare, PenLine, Clock, ShieldAlert, Clock3 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { submitFeedback, getFeedbackReviews, getUserFeedback } from '../../../services/firebaseService';
import { hasProfanity } from '../../../utils/profanityFilter';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const FeedbackSection = ({ colors }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [view, setView] = useState('loading');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [profanityError, setProfanityError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const firstName = currentUser?.displayName?.split(' ')[0] || t('about.feedback.anonymousUser');

  // timeAgo function using translations
  const timeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return t('about.feedback.timeAgo.justNow');
    if (diff < 3600) return `${Math.floor(diff / 60)}${t('about.feedback.timeAgo.minutesAgo')}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t('about.feedback.timeAgo.hoursAgo')}`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}${t('about.feedback.timeAgo.daysAgo')}`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}${t('about.feedback.timeAgo.monthsAgo')}`;
    return `${Math.floor(diff / 31536000)}${t('about.feedback.timeAgo.yearsAgo')}`;
  };

  const blurVariants = {
    initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
  };

  // Load reviews + check if user already submitted
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const [fetchedReviews, existingFeedback] = await Promise.all([
          getFeedbackReviews(),
          currentUser ? getUserFeedback(currentUser.uid) : null,
        ]);
        if (cancelled) return;
        setReviews(fetchedReviews);
        if (existingFeedback) {
          setHasSubmitted(true);
          if (existingFeedback.status === 'pending') {
            setIsPending(true);
          }
          setView('reviews');
        } else {
          setView('form');
        }
      } catch {
        if (!cancelled) {
          setReviews([]);
          setView('form');
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, [currentUser]);

  // Auto-advance reviews carousel
  useEffect(() => {
    if (view !== 'reviews' || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [view, reviews.length]);

  // Thank you → pending_info transition
  useEffect(() => {
    if (view !== 'thankyou') return;
    const timeout = setTimeout(() => {
      setView('pending_info');
    }, 2500);
    return () => clearTimeout(timeout);
  }, [view]);

  // Pending info → reviews transition
  useEffect(() => {
    if (view !== 'pending_info') return;
    const timeout = setTimeout(async () => {
      try {
        const freshReviews = await getFeedbackReviews();
        setReviews(freshReviews);
      } catch {
        // keep existing reviews
      }
      setView('reviews');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [view]);

  const handleSubmit = useCallback(async () => {
    if (rating === 0 || !currentUser) return;

    // Check for profanity
    if (comment.trim() && hasProfanity(comment)) {
      setProfanityError(true);
      return;
    }

    setProfanityError(false);
    setLoading(true);
    try {
      await submitFeedback({
        userId: currentUser.uid,
        displayName: isAnonymous ? '' : firstName,
        rating,
        comment: comment.trim(),
        isAnonymous,
      });
      setIsPending(true);
    } catch {
      // silently handled
    } finally {
      setHasSubmitted(true);
      setView('thankyou');
      setLoading(false);
    }
  }, [rating, comment, isAnonymous, currentUser, firstName]);

  const goToForm = useCallback(() => {
    setRating(0);
    setComment('');
    setIsAnonymous(false);
    setView('form');
  }, []);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  const renderStars = (count, size = 16, interactive = false) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoveredStar(star)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
          style={{ touchAction: 'manipulation' }}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          <Star
            size={size}
            className={`transition-colors duration-150 ${
              star <= (interactive ? (hoveredStar || rating) : count)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <motion.div
      id="feedback"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Card variant="surface" padding="none" className="overflow-hidden h-full">
        <div className="p-6 min-h-[340px] h-full flex flex-col">
          <AnimatePresence mode="wait">

            {/* ---- LOADING ---- */}
            {view === 'loading' && (
              <motion.div
                key="loading"
                variants={blurVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex items-center justify-center"
              >
                <div
                  className="w-5 h-5 border-2 rounded-full animate-spin"
                  style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}
                />
              </motion.div>
            )}

            {/* ---- FORM ---- */}
            {view === 'form' && (
              <motion.div
                key="form"
                variants={blurVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col flex-1"
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={18} style={{ color: colors.primary }} />
                  <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                    {hasSubmitted ? t('about.feedback.updateTitle') : t('about.feedback.title')}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed mb-5" style={{ color: colors.textSecondary }}>
                  {hasSubmitted
                    ? t('about.feedback.updateDescription')
                    : t('about.feedback.description')
                  }
                </p>

                {/* Stars */}
                <div className="mb-4">
                  <p className="text-xs font-medium mb-2" style={{ color: colors.textSecondary }}>
                    {t('about.feedback.rateQuestion')}
                  </p>
                  {renderStars(rating, 28, true)}
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (profanityError) setProfanityError(false);
                  }}
                  placeholder={t('about.feedback.commentPlaceholder')}
                  rows={3}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 placeholder:text-xs ${
                    profanityError ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-slate-700'
                  }`}
                  style={{
                    color: colors.text,
                    '--tw-ring-color': profanityError ? '#f87171' : colors.primary,
                    // iOS zooms on inputs with font-size < 16px; override text-sm here
                    fontSize: '16px',
                  }}
                />

                {/* Profanity warning */}
                <AnimatePresence>
                  {profanityError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-red-500 dark:text-red-400 mt-1.5 mb-3"
                    >
                      <ShieldAlert size={14} />
                      <span className="text-xs">{t('about.feedback.profanityWarning')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!profanityError && <div className="mb-5" />}

                {/* Publish as + Submit */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto">
                  {/* Publish as toggle */}
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 flex-1">
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(false)}
                      className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        !isAnonymous
                          ? 'text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                      style={{ touchAction: 'manipulation', ...(!isAnonymous ? { backgroundColor: colors.primary } : {}) }}
                    >
                      <User size={13} />
                      {t('about.feedback.publishAs')} {firstName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(true)}
                      className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isAnonymous
                          ? 'text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                      style={{ touchAction: 'manipulation', ...(isAnonymous ? { backgroundColor: colors.primary } : {}) }}
                    >
                      <EyeOff size={13} />
                      {t('about.feedback.anonymous')}
                    </button>
                  </div>

                  {/* Submit */}
                  <Button
                    onClick={handleSubmit}
                    disabled={rating === 0 || loading}
                    icon={Send}
                    iconPosition="left"
                    size="sm"
                    themeColor={colors.primary}
                    loading={loading}
                    loadingText={t('about.feedback.sending')}
                  >
                    {hasSubmitted ? t('about.feedback.update') : t('about.feedback.send')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ---- THANK YOU ---- */}
            {view === 'thankyou' && (
              <motion.div
                key="thankyou"
                variants={blurVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center flex-1 text-center gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                >
                  <Heart size={44} className="text-red-400 fill-red-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                    {t('about.feedback.thankYou')}
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {t('about.feedback.thankYouDesc')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ---- PENDING INFO ---- */}
            {view === 'pending_info' && (
              <motion.div
                key="pending_info"
                variants={blurVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center flex-1 text-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                >
                  <Clock size={44} style={{ color: colors.primary }} />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                    {t('about.feedback.underReview')}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: colors.textSecondary }}>
                    {t('about.feedback.underReviewDesc')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ---- REVIEWS CAROUSEL ---- */}
            {view === 'reviews' && (
              <motion.div
                key="reviews"
                variants={blurVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={14} style={{ color: colors.primary }} />
                  <h3 className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    {t('about.feedback.whatPeopleSay')}
                  </h3>
                </div>

                {/* Pending review - small banner above carousel */}
                {isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs"
                    style={{ backgroundColor: `${colors.primary}12`, color: colors.primary }}
                  >
                    <Clock3 size={12} />
                    <span>{t('about.feedback.yourReviewPending')}</span>
                  </motion.div>
                )}

                {reviews.length > 0 ? (
                  <div className="flex-1 flex flex-col relative">
                    {/* Time ago - top right, outside carousel */}
                    {reviews[currentReview] && (
                      <div
                        className="absolute top-0 right-0 flex items-center gap-1 text-[10px] z-10"
                        style={{ color: colors.textSecondary, opacity: 0.6 }}
                      >
                        <Clock size={10} />
                        {timeAgo(reviews[currentReview].createdAt)}
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentReview}
                        variants={blurVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex items-center justify-center"
                      >
                        {(() => {
                          const review = reviews[currentReview];
                          if (!review) return null;
                          const commentLen = (review.comment || '').length;
                          const commentSize = commentLen > 200 ? 'text-xs' : commentLen > 100 ? 'text-sm' : 'text-base';
                          return (
                            <div className="flex flex-col items-center justify-center text-center gap-4">
                              {/* Avatar */}
                              {review.isAnonymous ? (
                                <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shrink-0">
                                  <UserX size={22} className="text-gray-500 dark:text-gray-400" />
                                </div>
                              ) : (
                                <div
                                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-lg font-bold text-white"
                                  style={{ backgroundColor: colors.primary }}
                                >
                                  {getInitial(review.displayName)}
                                </div>
                              )}

                              {/* Name + Stars */}
                              <div>
                                <p className="text-base font-semibold mb-1" style={{ color: colors.text }}>
                                  {review.isAnonymous ? t('about.feedback.anonymousUser') : review.displayName}
                                </p>
                                <div className="flex justify-center">
                                  {renderStars(review.rating, 18)}
                                </div>
                              </div>

                              {/* Comment */}
                              {review.comment && (
                                <p className={`${commentSize} leading-relaxed italic max-w-md`} style={{ color: colors.textSecondary }}>
                                  &ldquo;{review.comment}&rdquo;
                                </p>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={goToForm}
                        className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ color: colors.primary, touchAction: 'manipulation' }}
                      >
                        <PenLine size={12} />
                        {hasSubmitted ? t('about.feedback.changeReview') : t('about.feedback.leaveReview')}
                      </button>
                      {reviews.length > 1 && (
                        <div className="flex gap-1.5">
                          {reviews.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentReview(i)}
                              className="w-4 h-4 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer"
                              style={{ touchAction: 'manipulation' }}
                              aria-label={`Review ${i + 1}`}
                            >
                              <span
                                className="block rounded-full transition-all duration-200"
                                style={{
                                  width: i === currentReview ? '8px' : '6px',
                                  height: i === currentReview ? '8px' : '6px',
                                  backgroundColor: i === currentReview ? colors.primary : (colors.transparent20 || '#D1D5DB'),
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    >
                      <Clock size={40} style={{ color: colors.primary, opacity: 0.7 }} />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                        {t('about.feedback.noFeedback')}
                      </p>
                      <p className="text-xs leading-relaxed max-w-[200px] mx-auto" style={{ color: colors.textSecondary }}>
                        {t('about.feedback.noFeedbackDesc')}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedbackSection;
