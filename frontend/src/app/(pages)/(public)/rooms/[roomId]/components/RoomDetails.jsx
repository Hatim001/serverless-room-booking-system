import { Separator } from '@/components/ui/separator';
import DUMMY_AMENITIES from '@/utils/amenities';
import React from 'react';

const RoomDetails = ({ room }) => {
  const { name, config, description, amenities = [], review = [] } = room;

  const RoomTitle = () => (
    <div>
      <span className="font-medium text-lg">{name}</span>
      <div className="flex items-center space-x-2 py-1 text-sm">
        <div>{config?.guests || 4} Guests</div>{' '}
        <Separator orientation="vertical" className="h-5" />
        <div>{config?.beds || 1} Bed</div>{' '}
        <Separator orientation="vertical" className="h-5" />
        <div>{config?.baths || 1} Bath</div>
      </div>
    </div>
  );

  const OverallFeedbackAndPolarity = () => <div></div>;

  const RoomDescription = () => (
    <div>
      <p className="text-sm leading-loose">{description}</p>
    </div>
  );

  const RoomAmenities = () => (
    <div>
      <span className="text-lg font-medium">What this place offers</span>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-4">
        {DUMMY_AMENITIES?.map((amenity, index) => {
          const { icon: AmenityIcon, title, description } = amenity;
          return (
            <div className="flex space-x-4" key={`amenity-${index}`}>
              <div>
                <AmenityIcon />
              </div>
              <div className="w-2/3 space-y-1">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-slate-500 truncate overflow-hidden">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-5 pr-6">
      <RoomTitle />
      <Separator className="my-6" />
      {/* <OverallFeedbackAndPolarity />
      <Separator className="my-6" /> */}
      <RoomDescription />
      <Separator className="my-6" />
      <RoomAmenities />
    </div>
  );
};

export default RoomDetails;
