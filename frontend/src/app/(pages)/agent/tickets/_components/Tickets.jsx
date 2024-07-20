'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRightIcon, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const closedTickets = [
  {
    id: 1,
    title: 'Ticket 1',
    status: 'Closed',
    date: '2021-07-21',
  },
  {
    id: 2,
    title: 'Ticket 2',
    status: 'Closed',
    date: '2021-07-21',
  },
  {
    id: 3,
    title: 'Ticket 3',
    status: 'Closed',
    date: '2021-07-21',
  },
];

const openTickets = [
  {
    id: 4,
    title: 'Ticket 4',
    status: 'Open',
    date: '2021-07-21',
  },
  {
    id: 5,
    title: 'Ticket 5',
    status: 'Open',
    date: '2021-07-21',
  },
  {
    id: 6,
    title: 'Ticket 6',
    status: 'Open',
    date: '2021-07-21',
  },
];

const Tickets = () => {
  const [isOpenForClosedTickets, setIsOpenForClosedTickets] = useState(false);
  const [isOpenForOpenTickets, setIsOpenForOpenTickets] = useState(true);

  return (
    <div className="h-full">
      <h3 className="font-medium mb-4">Tickets</h3>
      <Collapsible
        open={isOpenForOpenTickets}
        onOpenChange={setIsOpenForOpenTickets}
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">Ongoing</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {openTickets.map((ticket, index) => (
            <div
              className="flex items-center justify-between rounded-lg bg-background p-4 hover:bg-muted"
              key={index}
            >
              <div>
                <h4 className="text-sm font-medium">{ticket?.title}</h4>
                <p className="text-xs text-muted-foreground">{ticket?.date}</p>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={isOpenForClosedTickets}
        onOpenChange={setIsOpenForClosedTickets}
        className="mt-4"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">Resolved</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {closedTickets.map((ticket, index) => (
            <div
              className="flex items-center justify-between rounded-lg bg-background p-4 hover:bg-muted"
              key={index}
            >
              <div>
                <h4 className="text-sm font-medium">{ticket?.title}</h4>
                <p className="text-xs text-muted-foreground">{ticket?.date}</p>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Tickets;
