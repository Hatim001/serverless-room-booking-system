import { Button } from '@/components/ui/button';
import EllipsisTooltip from '@/components/ui/ellipsis-tooltip';
import { randomNumber } from '@/lib/utils';

const BookingCard = ({ booking }) => {
  const {
    room = {},
    total_price,
    check_in_date,
    check_out_date,
    guests,
  } = booking;
  return (
    <div className="transition ease-in-out w-full h-[200px] bg-white rounded-lg shadow hover:shadow-lg hover:outline hover:outline-2 hover:outline-violet-300 hover:p-1 cursor-pointer hover:-translate-y-1">
      <div className="flex justify-left w-full h-full">
        <div className="w-1/3">
          <picture>
            <img
              src={`https://picsum.photos/id/${randomNumber(1, 100)}/1500`}
              // src={booking?.room?.images?.[0]?.url}
              alt={`${booking?.room?.name} Cover Image`}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </picture>
        </div>
        <div className="w-2/3 p-4">
          <div className="flex flex-col justify-between h-full space-y-2">
            <div>
              <div className="flex justify-between items-center w-full">
                <EllipsisTooltip
                  className={'w-1/2 font-medium'}
                  text={room?.name}
                />
                <div>${total_price} CAD</div>
              </div>
              <div className="text-sm text-slate-700">
                {room?.config?.beds} Beds, {room?.config?.bathrooms} Bathrooms{' '}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <div className="text-xs text-slate-500 flex items-center">
                  <span>Check In - </span>
                  <span className="font-medium">
                    {new Date(check_in_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center">
                  <span>Check Out - </span>
                  <span className="font-medium">
                    {new Date(check_out_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center">
                  <span>Total Guests - </span>
                  <span className="font-medium">{guests}</span>
                </div>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline">
                  Mark as Completed
                </Button>
                <Button size="sm">Add Review</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
