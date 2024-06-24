'use client';

import { Loading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { randomNumber } from '@/lib/utils';
import { Heart, Share } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import RoomBooking from './components/RoomBooking';
import RoomDetails from './components/RoomDetails';
import RoomReviews from './components/RoomReviews';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Index = ({ params }) => {
  const { roomId } = params;
  const [room, setRoom] = useState({});
  const [loading, setLoading] = useState(false);
  const { images = [], price_per_day, name } = room;

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/rooms/${roomId}`);
      const data = await response.json();
      if (response.ok) {
        setRoom(data?.room);
      } else {
      }
    } finally {
      setLoading(false);
    }
  };

  const NavBar = () => (
    <Breadcrumb className="py-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms">Rooms</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  const Header = () => (
    <div className="flex justify-end items-center py-2">
      <div className="flex space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Share className="w-6 h-6" />
          <span className="sr-only">Share</span>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Heart className="w-6 h-6" />
          <span className="sr-only">Save</span>
        </button>
      </div>
    </div>
  );

  const Gallery = () => (
    <div className="grid grid-cols-2 gap-1 rounded">
      <div>
        <picture>
          <img
            src={`https://picsum.photos/id/${randomNumber(1, 100)}/1500`}
            alt={`${room?.name} Cover Image`}
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {[0, 1, 2, 3].map((image, index) => (
          <picture key={index}>
            <img
              src={`https://picsum.photos/id/${randomNumber(1, 100)}/1000`}
              alt={`${room?.name} Cover Image - ${index}`}
              className="w-full h-full object-cover"
            />
          </picture>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <Loading placeHolder={'Fetching details...'} />;
  }

  return (
    <div>
      <NavBar />
      <Header />
      <Gallery />
      <div className="grid grid-cols-1 grid-cols-3 gap-6 pt-6">
        <div className="md:col-span-2">
          <RoomDetails room={room} />
        </div>
        <div>
          <RoomBooking room={room} />
        </div>
        <Separator className="col-span-3" />
        <div className="col-span-3">
          <RoomReviews />
        </div>
      </div>
    </div>
  );
};

export default Index;
