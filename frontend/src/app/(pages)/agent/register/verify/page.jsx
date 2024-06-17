'use client';

import React from 'react';

import { POST } from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import VerificationCode from '@/app/(pages)/components/verification-code';

const Index = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [disableForm, setDisableForm] = React.useState(false);

  const verifyCode = (values) => {
    setDisableForm(true);
    POST('/auth/register/verify', {
      email: searchParams.get('email'),
      code: values.code,
    })
      .then((res) => {
        toast({
          title: 'Success',
          description: res?.data?.message,
        });
        router.push('/agent/login');
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err?.response?.data?.message,
          variant: 'destructive',
        });
      })
      .finally(() => {
        setDisableForm(false);
      });
  };

  const resendCode = () => {
    setDisableForm(true);
    POST('/auth/register/resend-code', {
      email: searchParams.get('email'),
    })
      .then((res) => {
        toast({
          title: 'Success',
          description: res?.data?.message,
        });
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err?.response?.data?.message,
          variant: 'destructive',
        });
      })
      .finally(() => {
        setDisableForm(false);
      });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div>
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Account Verification
            </h1>
          </div>
          <div className="mt-5 mx-auto">
            <VerificationCode
              onSubmit={verifyCode}
              resendCode={resendCode}
              disableForm={disableForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
