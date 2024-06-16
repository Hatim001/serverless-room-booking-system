import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import CaesarCipher from '@/app/[locale]/components/login/CaesarCipher';
import SecurityQuestion from '@/app/[locale]/components/login/SecurityQuestion';

const MFAVerification = ({ role }) => {
  const { session } = useAuth();
  const router = useRouter();
  const [mfaType, setMfaType] = useState('securityQuestion');

  useEffect(() => {
    prepareForm();
  }, []);

  const prepareForm = () => {
    // call API to check MFA Status
    if (!session?.mfa_1) {
      setMfaType('securityQuestion');
    } else if (!session?.mfa_2) {
      setMfaType('caesarCipher');
    } else {
      setMfaType('completed');
    }
  };

  const verifySecurityQuestion = (values) => {
    const payload = {
      email: session?.user?.email,
      answer: values?.answer,
    };
    POST('/auth/login/mfa/security-question', payload)?.then((res) => {
      setMfaType('caesarCipher');
    });
  };

  const verifyCaesarCipher = (values) => {
    const payload = {
      email: session?.user?.email,
      plain_text: values?.plainText,
      user_input: values?.userInput,
    };
    POST('/auth/login/mfa/caesar-cipher', payload)?.then((res) => {
      setMfaType('completed');
      router.push(`/`);
    });
  };

  const mfaCompleted = () => {
    return (
      <div>
        <h1>Multi-factor Authentication Completed!!</h1>
      </div>
    );
  };

  switch (mfaType) {
    case 'securityQuestion':
      return (
        <SecurityQuestion
          question={session?.user?.mfa_1?.question}
          onSubmit={verifySecurityQuestion}
        />
      );

    case 'caesarCipher':
      return <CaesarCipher onSubmit={verifyCaesarCipher} />;

    case 'completed':
      return mfaCompleted();

    default:
      break;
  }
};

export default MFAVerification;
