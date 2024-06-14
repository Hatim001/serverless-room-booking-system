const GUEST_ROUTES = [
  {
    label: 'Rooms',
    path: '/rooms',
  },
  {
    label: 'Guest Login',
    path: '/user/login',
  },
  {
    label: 'Agent Login',
    path: '/agent/login',
  },
];

const USER_ROUTES = [
  {
    label: 'Rooms',
    path: '/rooms',
  },
  {
    label: 'My Bookings',
    path: '/bookings',
  },
  {
    label: 'Logout',
    path: '/logout',
  },
];

const AGENT_ROUTES = [
  {
    label: 'Logout',
    path: '/logout',
  },
];

export { GUEST_ROUTES, USER_ROUTES, AGENT_ROUTES };
