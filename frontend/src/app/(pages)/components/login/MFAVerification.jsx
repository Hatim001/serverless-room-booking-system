// 'use client';

// import { useEffect, useState } from 'react';

// import { useAuth } from '@/hooks/use-auth';
// import { useRouter } from 'next/navigation';
// import CaesarCipher from '@/app/[locale]/components/login/CaesarCipher';
// import SecurityQuestion from '@/app/[locale]/components/login/SecurityQuestion';

// const MFAVerification = ({ role }) => {
//   const { session } = useAuth();
//   const router = useRouter();
//   const [mfaType, setMfaType] = useState('securityQuestion');

//   useEffect(() => {
//     prepareForm();
//   }, []);

//   const prepareForm = () => {
//     // call API to check MFA Status
//     if (!session?.mfa_1) {
//       setMfaType('securityQuestion');
//     } else if (!session?.mfa_2) {
//       setMfaType('caesarCipher');
//     } else {
//       setMfaType('completed');
//     }
//   };

//   const verifySecurityQuestion = (values) => {
//     const payload = {
//       email: session?.user?.email,
//       answer: values?.answer,
//     };
//     POST('/auth/login/mfa/security-question', payload)?.then((res) => {
//       setMfaType('caesarCipher');
//     });
//   };

//   const verifyCaesarCipher = (values) => {
//     const payload = {
//       email: session?.user?.email,
//       plain_text: values?.plainText,
//       user_input: values?.userInput,
//     };
//     POST('/auth/login/mfa/caesar-cipher', payload)?.then((res) => {
//       setMfaType('completed');
//       router.push(`/`);
//     });
//   };

//   const mfaCompleted = () => {
//     return (
//       <div>
//         <h1>Multi-factor Authentication Completed!!</h1>
//       </div>
//     );
//   };

//   switch (mfaType) {
//     case 'securityQuestion':
//       return (
//         <SecurityQuestion
//           question={session?.user?.mfa_1?.question}
//           onSubmit={verifySecurityQuestion}
//         />
//       );

//     case 'caesarCipher':
//       return <CaesarCipher onSubmit={verifyCaesarCipher} />;

//     case 'completed':
//       return mfaCompleted();

//     default:
//       break;
//   }
// };

// export default MFAVerification;

'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { Step, Stepper } from '@/components/stepper';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/loading';
import SecurityQuestion from './SecurityQuestion';
import CaesarCipher from './CaesarCipher';

const MFAVerification = ({ role }) => {
  const { session } = useAuth();
  const router = useRouter();
  const [initialStep, setInitialStep] = useState(null);
  const [disableForm, setDisableForm] = useState(false);
  const { user = {}, mfa_1 = {}, mfa_2 = {} } = session || {};

  useEffect(() => {
    prepareForm();
  }, [session]);

  const prepareForm = async () => {
    const email = user?.email;
    if (!email) {
      router.push(`/`);
    } else {
      if (!mfa_1.verified) {
        setInitialStep(0);
      } else if (!mfa_2.verified) {
        setInitialStep(1);
      } else {
        router.push(`/rooms`);
      }
    }
  };

  const saveSecurityQuestion = async (values) => {
    const payload = {
      email: session?.user?.email,
      answer: values?.answer,
    };
    return fetch('/api/auth/login/mfa/security-question', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  const saveCaesarCipher = (values) => {
    setDisableForm(true);
    const payload = {
      email: session?.user?.email,
      cipher_decryption_key: values?.encryptionKey,
    };
    fetch('/api/auth/login/mfa/caesar-cipher', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      .then((res) => {
        router.push(`/${role}/login`);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setDisableForm(false);
      });
  };

  const steps = [
    {
      label: 'MFA #1',
      component: SecurityQuestion,
      onSubmit: saveSecurityQuestion,
      props: {
        question: mfa_1?.question,
      },
    },
    {
      label: 'MFA #2',
      component: CaesarCipher,
      onSubmit: saveCaesarCipher,
    },
  ];

  if (initialStep === null) {
    return <Loading />;
  }

  return (
    <div className="flex lg:w-1/2 md:w-3/4 py-5 mx-auto flex-col gap-4 sm:w-full">
      <h1 className="text-xl text-center mb-2 font-bold text-gray-800 dark:text-white">
        Verify Multi-Factor Authentication
      </h1>
      <Stepper initialStep={initialStep} steps={steps}>
        {steps.map((stepProps, index) => {
          const { component: Component, onSubmit, props = {} } = stepProps;
          return (
            <Step key={stepProps.label} {...stepProps}>
              <div className=" flex items-center justify-center">
                <Component
                  onSubmit={onSubmit}
                  disableForm={disableForm}
                  {...props}
                />
              </div>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};

export default MFAVerification;
