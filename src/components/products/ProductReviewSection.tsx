import React from 'react';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ProductReviewSectionProps {
  productId: string;
  reviews: Review[];
  canReview?: boolean;
  showReviewForm: boolean;
  setShowReviewForm: (show: boolean) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  handleSubmitReview: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
  reviews,
  canReview,
  showReviewForm,
  setShowReviewForm,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  handleSubmitReview,
  isSubmitting,
}) => {
  return (
    <div className="mt-8 sm:mt-12 md:mt-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
          Customer Reviews
        </h2>
        {canReview && (
          <Button 
            variant="outline" 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full sm:w-auto"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-card rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm">
          <h3 className="font-medium mb-4 text-sm sm:text-base">Share Your Experience</h3>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm text-muted-foreground mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="focus:outline-none p-0.5"
                >
                  <Star
                    className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                      star <= reviewRating
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30 hover:text-accent/50'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm text-muted-foreground mb-2">Your Review</label>
            <Textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              rows={4}
              required
              className="text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              type="submit" 
              variant="gold" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Review
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowReviewForm(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-medium text-primary text-sm sm:text-base">
                    {review.user_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">
                    {review.user_name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-secondary/30 rounded-xl p-6 sm:p-8 text-center">
          <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
