import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../public/logo.png';

const Header = ({ routes }) => {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;
  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b-2 border-slate-200 text-sm py-3 sm:py-0 dark:bg-neutral-800 dark:border-neutral-700">
      <nav
        className="relative max-w-[85rem] w-full mx-auto py-2 sm:flex sm:items-center sm:justify-between"
        aria-label="Global"
      >
        <div className="h-[50px] w-[250px]">
          <Link
            href="/"
            className="text-xl font-semibold dark:text-white"
            aria-label="DalVacation"
          >
            <Image
              src={Logo}
              alt="/"
              className="max-h-full max-w-full"
              priority
            />
          </Link>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end py-2 md:py-0 sm:ps-7">
            {routes?.map((route, index) => (
              <Link
                key={index}
                href={`${route?.path}`}
                aria-label={route?.label}
                className={cn(
                  'py-3 ps-px sm:px-3 font-medium text-gray-500 hover:text-violet-500 dark:text-neutral-400 dark:hover:text-violet-500',
                  isActive(route?.path)
                    ? 'text-violet-500 dark:text-primary'
                    : 'text-gray-500 dark:text-neutral-400',
                )}
              >
                {route?.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
