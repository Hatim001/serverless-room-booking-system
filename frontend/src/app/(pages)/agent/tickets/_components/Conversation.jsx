'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef } from 'react';

const chatData = [
  {
    id: 1,
    message: 'Hello, how can I help you today?',
    sender: 'agent',
    timestamp: '12:00 PM',
  },
  {
    id: 2,
    message: 'I have a problem with my order',
    sender: 'customer',
    timestamp: '12:01 PM',
  },
  {
    id: 3,
    message: 'Sure, what seems to be the issue?',
    sender: 'agent',
    timestamp: '12:02 PM',
  },
  {
    id: 4,
    message: 'My order was not delivered',
    sender: 'customer',
    timestamp: '12:03 PM',
  },
  {
    id: 5,
    message:
      'I am sorry to hear that, can you please provide me with your order number?',
    sender: 'agent',
    timestamp: '12:04 PM',
  },
  {
    id: 6,
    message: 'Hello, how can I help you today?',
    sender: 'agent',
    timestamp: '12:00 PM',
  },
  {
    id: 7,
    message: 'I have a problem with my order',
    sender: 'customer',
    timestamp: '12:01 PM',
  },
  {
    id: 8,
    message: 'Sure, what seems to be the issue?',
    sender: 'agent',
    timestamp: '12:02 PM',
  },
  {
    id: 9,
    message: 'My order was not delivered',
    sender: 'customer',
    timestamp: '12:03 PM',
  },
  {
    id: 10,
    message:
      'I am sorry to hear that, can you please provide me with your order number?',
    sender: 'agent',
    timestamp: '12:04 PM',
  },
  {
    id: 1,
    message: 'Hello, how can I help you today?',
    sender: 'agent',
    timestamp: '12:00 PM',
  },
  {
    id: 2,
    message: 'I have a problem with my order',
    sender: 'customer',
    timestamp: '12:01 PM',
  },
  {
    id: 3,
    message: 'Sure, what seems to be the issue?',
    sender: 'agent',
    timestamp: '12:02 PM',
  },
  {
    id: 4,
    message: 'My order was not delivered',
    sender: 'customer',
    timestamp: '12:03 PM',
  },
  {
    id: 5,
    message:
      'I am sorry to hear that, can you please provide me with your order number?',
    sender: 'agent',
    timestamp: '12:04 PM',
  },
];

const Conversation = () => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const Messages = () => {
    return (
      <div className="flex-grow w-full mt-4 overflow-y-scroll">
        <div className="grid grid-col-1 gap-2">
          {chatData.map((message, index) => {
            return (
              <div
                key={index}
                className={`flex text-sm flex-col space-y-2 ${
                  message.sender === 'agent' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    message.sender === 'agent'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-violet-500 text-white'
                  }`}
                >
                  {message.message}
                </div>
                <div
                  className={`text-xs text-gray-500 ${
                    message.sender === 'agent' ? 'text-left' : 'text-right'
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const BottomBar = () => {
    return (
      <div className="h-20 w-full flex justify-between items-end py-1 space-x-2">
        <Input placeholder="Type a message" />
        <Button>Send</Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <Messages />
      <BottomBar />
    </div>
  );
};

export default Conversation;
