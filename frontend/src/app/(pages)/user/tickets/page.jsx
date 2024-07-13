import React from 'react';
import Conversation from './_components/Conversation';
import Tickets from './_components/Tickets';

const Index = () => {
  return (
    <div className="flex justify-between w-full h-full py-2 pt-3">
      <div className="w-1/3 h-full lg:block border-t border-b border-l rounded-l-lg p-2 px-4">
        <Tickets />
      </div>
      <div className="w-2/3 h-full overflow-scroll border rounded-r-lg p-2 px-4">
        <Conversation />
      </div>
    </div>
  );
};

export default Index;
