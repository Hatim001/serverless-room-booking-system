import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Ratings } from '@/components/ui/ratings';
import DUMMY_REVIEWS from '@/utils/reviews';
import React from 'react';

const RoomReviews = () => {
  const ReviewCard = ({ review }) => {
    return (
      <div className="flex space-x-4 p-4">
        <Avatar>
          <AvatarFallback>{review?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{review.name}</h3>
          <div className="flex space-x-4">
            <Ratings rating={review.rating} size={13} variant="yellow" />
            <span className="text-xs">{review.date}</span>
          </div>
          <p className="text-sm text-gray-800">{review.reviewText}</p>
        </div>
      </div>
    );
  };
  return (
    <div>
      <span className="text-lg font-medium">Reviews</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {DUMMY_REVIEWS.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </div>
  );
};

export default RoomReviews;
