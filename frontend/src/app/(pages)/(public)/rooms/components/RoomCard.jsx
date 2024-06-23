import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const RoomCard = ({ room }) => {
  const { images, name, description, price_per_day, config = {} } = room;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <Card className="max-w-xs rounded-lg overflow-hidden border-none shadow-none group relative cursor-pointer">
      <div className="relative">
        <picture>
          <img
            src={images?.[currentIndex]}
            alt="A cozy mountain cabin with a wooden deck and a white door"
            className="w-full h-48 object-cover rounded"
          />
        </picture>
        {/* <Badge className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Guest favorite
        </Badge>
        <Heart className="absolute top-4 right-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-4 h-4 text-black" />
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={nextSlide}
        >
          <ChevronRight className="w-4 h-4 text-black" />
        </button>
      </div>
      <CardContent className="p-1 pt-2 text-xs">
        <div className="flex justify-between text-sm items-center">
          <div className="basis-3/4 truncate font-semibold">{name}</div>
          <div className="basis-1/4 flex justify-end font-normal">
            <span>4.8</span>
            <span>(12)</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 py-1">
          <div>{config?.beds || 1} Bed</div>{' '}
          <Separator orientation="vertical" className="h-5" />
          <div>{config?.baths || 1} Bath</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-gray-500 font-bold">
            ${price_per_day} CAD night
          </div>
          <div className="text-gray-500 font-normal">
            ${price_per_day * 3} CAD total
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
