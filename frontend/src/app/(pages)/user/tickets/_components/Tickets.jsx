import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRightIcon, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import useTicketsConnections from '@/lib/firebaseUtils/useTicketsConnections';
import EllipsisTooltip from '@/components/ui/ellipsis-tooltip';

const Tickets = ({ selectedTicket, setSelectedTicket }) => {
  const { isAuthenticatedUser, session } = useAuth();
  const [isOpenForClosedTickets, setIsOpenForClosedTickets] = useState(false);
  const [isOpenForOpenTickets, setIsOpenForOpenTickets] = useState(true);
  // const chatSubscriptionRef = useRef(null);
  const ticketList = useTicketsConnections(session?.user?.email);
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  useEffect(() => {
    setOpenTickets(ticketList?.filter((ticket) => !ticket.isResolved));
    setClosedTickets(ticketList?.filter((ticket) => ticket.isResolved));
    if (selectedTicket) {
      const matchingTicket = ticketList.find(
        (ticket) => ticket?.ticketId === selectedTicket?.ticketId,
      );
      if (matchingTicket) {
        setSelectedTicket(matchingTicket);
      }
    }
  }, [ticketList]);

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
          {openTickets
            .sort((a, b) => b.lastUpdatedTimestamp - a.lastUpdatedTimestamp)
            .map((ticket, index) => (
              <div
                className={`flex items-center justify-between rounded-lg ${ticket.ticketId === selectedTicket?.ticketId ? 'bg-muted border' : 'bg-background'} p-4 hover:bg-muted`}
                key={index}
                onClick={() => handleTicketClick(ticket)}
              >
                <div>
                  <div className="flex items-center text-sm font-medium space-x-1">
                    <span className="w-14">Ticket:</span>
                    <EllipsisTooltip
                      text={`#${ticket?.ticketId}`}
                      className={'w-40 cursor-pointer'}
                    />
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="w-20">Booking ID:</span>
                    <EllipsisTooltip
                      text={ticket?.bookingId}
                      className={'w-40 cursor-pointer'}
                    />
                  </div>
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
          {closedTickets
            .sort((a, b) => b.lastUpdatedTimestamp - a.lastUpdatedTimestamp)
            .map((ticket, index) => (
              <div
                className={`flex items-center justify-between rounded-lg ${ticket.ticketId === selectedTicket?.ticketId ? 'bg-muted border' : 'bg-background'} p-4 hover:bg-muted`}
                key={index}
                onClick={() => handleTicketClick(ticket)}
              >
                <div>
                  <h4 className="text-sm font-medium">
                    Ticket: #{ticket?.ticketId}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Booking: #{ticket?.bookingId}
                  </p>
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
