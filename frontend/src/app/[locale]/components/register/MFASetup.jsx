'use client';

import { useState, useEffect } from 'react';

import CaesarCipher from '@/app/[locale]/components/register/CaesarCipher';
import SecurityQuestion from '@/app/[locale]/components/register/SecurityQuestion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';

const MFASetup = ({ role }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mfaType, setMfaType] = useState('securityQuestion');

  useEffect(() => {
    prepareForm();
  }, []);

  const prepareForm = () => {
    // call API to check MFA Status
  };

  const saveSecurityQuestion = (values) => {
    const payload = {
      email: searchParams.get('email'),
      question: values?.question,
      answer: values?.answer,
    };
    POST('/auth/register/mfa/security-question', payload)?.then((res) => {
      setMfaType('caesarCipher');
    });
  };

  const saveCaesarCipher = (values) => {
    const payload = {
      email: searchParams.get('email'),
      cipher_decryption_key: values?.encryptionKey,
    };
    POST('/auth/register/mfa/caesar-cipher', payload)?.then((res) => {
      setMfaType('completed');
      router.push(`/${role}/login`);
    });
  };

  const mfaCompleted = () => {
    return (
      <div>
        <h1>Multi-factor Authentication setup completed</h1>
      </div>
    );
  };

  switch (mfaType) {
    case 'securityQuestion':
      return <SecurityQuestion onSubmit={saveSecurityQuestion} />;

    case 'caesarCipher':
      return <CaesarCipher onSubmit={saveCaesarCipher} />;

    case 'completed':
      return mfaCompleted();

    default:
      break;
  }
};

export default MFASetup;
