'use client';

import React, { useState } from 'react';
import styles from './ReviewItem.module.css';
import StarRating from '../StarRating/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../lib/api';

/**
 * ReviewItem Component
 * Displays individual review with helpful/unhelpful voting and edit functionality
 */
export default function ReviewItem({ review, onReviewUpdated }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [helpful, setHelpful] = useState({
    helpful: review.helpful || 0,
    unhelpful: review.unhelpful || 0,
    userVote: null,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: review.rating,
    title: review.title || '',
    comment: review.comment,
  });

  // Check if current user owns this review
  const isOwner = user && review.userId && 
    (review.userId._id === user.id || review.userId === user.id);

  const handleHelpfulClick = async (isHelpful) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    if (helpful.userVote === isHelpful) {
      toast.info('You have already voted');
      return;
    }

    try {
      setLoading(true);
      const result = await apiFetch(`/reviews/${review._id}/helpful`, {
        method: 'POST',
        body: JSON.stringify({ helpful: isHelpful }),
      });

      const updatedReview = result.data.review;

      setHelpful({
        helpful: updatedReview.helpful || 0,
        unhelpful: updatedReview.unhelpful || 0,
        userVote: isHelpful,
      });

      onReviewUpdated && onReviewUpdated(updatedReview);
      toast.success('Thank you for your feedback');
    } catch (error) {
      toast.error('Error voting on review');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.comment || editForm.comment.length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      const result = await apiFetch(`/reviews/${review._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          rating: editForm.rating,
          title: editForm.title || null,
          comment: editForm.comment,
        }),
      });

      const updatedReview = result.data.review;
      
      // Update the review with user info preserved
      onReviewUpdated && onReviewUpdated({
        ...updatedReview,
        userId: review.userId, // Preserve user info
      });
      
      setIsEditing(false);
      toast.success('Review updated successfully');
    } catch (error) {
      toast.error(error.message || 'Error updating review');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      rating: review.rating,
      title: review.title || '',
      comment: review.comment,
    });
    setIsEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Edit mode view
  if (isEditing) {
    return (
      <div className={styles.reviewItem}>
        <form onSubmit={handleEditSubmit} className={styles.editForm}>
          <h4 className={styles.editTitle}>Edit Your Review</h4>
          
          <div className={styles.editField}>
            <label>Rating</label>
            <div className={styles.ratingSelect}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${editForm.rating >= star ? styles.starActive : ''}`}
                  onClick={() => setEditForm({ ...editForm, rating: star })}
                  aria-label={`Rate ${star} stars`}
                >
                  {editForm.rating >= star ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.editField}>
            <label htmlFor="edit-title">Title (optional)</label>
            <input
              id="edit-title"
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Summarize your review"
              maxLength={100}
              className={styles.editInput}
            />
          </div>

          <div className={styles.editField}>
            <label htmlFor="edit-comment">Review</label>
            <textarea
              id="edit-comment"
              value={editForm.comment}
              onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
              placeholder="Share your experience with this product"
              minLength={10}
              maxLength={1000}
              required
              className={styles.editTextarea}
              rows={4}
            />
            <span className={styles.charCount}>{editForm.comment.length}/1000</span>
          </div>

          <div className={styles.editActions}>
            <button
              type="button"
              onClick={handleCancelEdit}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.reviewItem}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            {review.userId?.name?.charAt(0) || 'U'}
          </div>
          <div className={styles.details}>
            <h4>{review.userId?.name || 'Anonymous'}</h4>
            <div className={styles.meta}>
              <StarRating rating={review.rating} size="small" showLabel={false} />
              <span className={styles.date}>{formatDate(review.createdAt)}</span>
              {review.verifiedPurchase && (
                <span className={styles.verified}>Verified Purchase</span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          {review.status !== 'approved' && (
            <span className={styles.statusBadge}>{review.status}</span>
          )}
          {isOwner && (
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
              aria-label="Edit your review"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {review.title && <h5 className={styles.title}>{review.title}</h5>}

      <p className={styles.comment}>{review.comment}</p>

      <div className={styles.footer}>
        <span className={styles.helpfulQuestion}>Was this helpful?</span>
        <div className={styles.buttons}>
          <button
            className={`${styles.helpBtn} ${helpful.userVote === true ? styles.active : ''}`}
            onClick={() => handleHelpfulClick(true)}
            disabled={loading}
            aria-label="Mark as helpful"
          >
            Helpful ({helpful.helpful})
          </button>
          <button
            className={`${styles.helpBtn} ${helpful.userVote === false ? styles.active : ''}`}
            onClick={() => handleHelpfulClick(false)}
            disabled={loading}
            aria-label="Mark as unhelpful"
          >
            Not Helpful ({helpful.unhelpful})
          </button>
        </div>
      </div>
    </div>
  );
}
