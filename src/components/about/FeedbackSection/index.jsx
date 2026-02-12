// src/components/about/FeedbackSection/index.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, UserX, Send, Heart, User, EyeOff, MessageSquare, PenLine, Clock } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { submitFeedback, getFeedbackReviews, getUserFeedback } from '../../../services/firebaseService';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const timeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
};

const blurVariants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(4px)' },
};

const FeedbackSection = ({ colors }) => {
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

  const firstName = currentUser?.displayName?.split(' ')[0] || 'User';

  // Load reviews + check if user already submitted
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      console.log('[FeedbackSection] init, currentUser:', currentUser?.uid);
      try {
        const [fetchedReviews, existingFeedback] = await Promise.all([
          getFeedbackReviews(),
          currentUser ? getUserFeedback(currentUser.uid) : null,
        ]);
        console.log('[FeedbackSection] reviews:', fetchedReviews.length, 'existingFeedback:', existingFeedback);
        if (cancelled) return;
        setReviews(fetchedReviews);
        if (existingFeedback) {
          setHasSubmitted(true);
          setView('reviews');
        } else {
          setView('form');
        }
      } catch (err) {
        console.error('[FeedbackSection] init ERROR:', err);
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

  // Thank you → reviews transition
  useEffect(() => {
    if (view !== 'thankyou') return;
    const timeout = setTimeout(async () => {
      try {
        const freshReviews = await getFeedbackReviews();
        setReviews(freshReviews);
      } catch {
        // keep existing reviews
      }
      setView('reviews');
    }, 2500);
    return () => clearTimeout(timeout);
  }, [view]);

  const handleSubmit = useCallback(async () => {
    console.log('[FeedbackSection] handleSubmit, rating:', rating, 'user:', currentUser?.uid);
    if (rating === 0 || !currentUser) return;
    setLoading(true);
    try {
      await submitFeedback({
        userId: currentUser.uid,
        displayName: isAnonymous ? '' : firstName,
        rating,
        comment: comment.trim(),
        isAnonymous,
      });
      console.log('[FeedbackSection] submit SUCCESS');
    } catch (err) {
      console.error('[FeedbackSection] submit ERROR:', err);
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
                    {hasSubmitted ? 'Update your review' : 'Your feedback matters'}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed mb-5" style={{ color: colors.textSecondary }}>
                  {hasSubmitted
                    ? 'Changed your mind? No worries, update your review anytime.'
                    : 'Every comment helps me keep improving GestAPP. Who knows, maybe one day all of this will have been truly worth it!'
                  }
                </p>

                {/* Stars */}
                <div className="mb-4">
                  <p className="text-xs font-medium mb-2" style={{ color: colors.textSecondary }}>
                    How would you rate your experience?
                  </p>
                  {renderStars(rating, 28, true)}
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you think... (optional)"
                  rows={3}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 mb-5 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 placeholder-gray-400 dark:placeholder-gray-500"
                  style={{
                    color: colors.text,
                    '--tw-ring-color': colors.primary,
                  }}
                />

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
                      style={!isAnonymous ? { backgroundColor: colors.primary } : undefined}
                    >
                      <User size={13} />
                      Publish as {firstName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(true)}
                      className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isAnonymous
                          ? 'text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                      style={isAnonymous ? { backgroundColor: colors.primary } : undefined}
                    >
                      <EyeOff size={13} />
                      Anonymous
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
                    loadingText="Sending..."
                  >
                    {hasSubmitted ? 'Update' : 'Send'}
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
                    Thank you so much!
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Your feedback truly helps shape the future of GestAPP.
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary, opacity: 0.7 }}>
                    Every bit of support counts more than you think.
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
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={14} style={{ color: colors.primary }} />
                  <h3 className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    What people are saying
                  </h3>
                </div>

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
                                  {review.isAnonymous ? 'Anonymous User' : review.displayName}
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
                        style={{ color: colors.primary }}
                      >
                        <PenLine size={12} />
                        {hasSubmitted ? 'Change your review' : 'Leave a review'}
                      </button>
                      {reviews.length > 1 && (
                        <div className="flex gap-1.5">
                          {reviews.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentReview(i)}
                              className="w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer"
                              style={{
                                backgroundColor: i === currentReview ? colors.primary : (colors.transparent20 || '#D1D5DB'),
                                transform: i === currentReview ? 'scale(1.3)' : 'scale(1)',
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Be the first to leave a review!
                    </p>
                    <Button
                      onClick={goToForm}
                      icon={PenLine}
                      iconPosition="left"
                      size="sm"
                      themeColor={colors.primary}
                    >
                      Leave a review
                    </Button>
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
