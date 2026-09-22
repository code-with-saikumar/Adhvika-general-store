import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReview } from '@/hooks/useReviews';
import { OrderItem } from '@/hooks/useOrders';

interface OrderReviewFormProps {
  orderId: string;
  orderItems: OrderItem[];
  hasReviewed: boolean;
}

const OrderReviewForm: React.FC<OrderReviewFormProps> = ({ orderId, orderItems, hasReviewed }) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || rating === 0) return;

    await createReview.mutateAsync({
      productId: selectedProductId,
      rating,
      comment
    });

    // Reset form
    setSelectedProductId(null);
    setRating(0);
    setComment('');
  };

  if (hasReviewed) {
    return (
      <div className="bg-secondary/30 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          ✓ Thank you for your review! It will be displayed after admin approval.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 rounded-lg p-4">
      <h4 className="font-medium text-foreground mb-3">Write a Review</h4>
      
      {!selectedProductId ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-2">Select a product to review:</p>
          <div className="flex flex-wrap gap-2">
            {orderItems.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => item.product_id && setSelectedProductId(item.product_id)}
                disabled={!item.product_id}
                className="flex items-center gap-2"
              >
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-6 h-6 object-cover rounded"
                  />
                )}
                <span className="truncate max-w-[150px]">{item.product_name}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Reviewing:</span>
            <span className="font-medium">
              {orderItems.find(item => item.product_id === selectedProductId)?.product_name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProductId(null)}
              className="text-xs"
            >
              Change
            </Button>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={rating === 0 || createReview.isPending}
            >
              {createReview.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProductId(null);
                setRating(0);
                setComment('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrderReviewForm;
